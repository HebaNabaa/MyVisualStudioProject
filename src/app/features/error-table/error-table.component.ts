import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { LocalService } from '../../services/Schedule.service'; 
import { map, Observable,from} from 'rxjs'

interface ErrorItem {
  type: string;
  message: string;
}

interface Session {
  surgeonName: string;
  timeSlot: string;
  campus: string;
  surgery: string;
}
@Component({
  selector: 'app-error-table',
  standalone: true,
  imports: [MContainerComponent,CommonModule,],
  templateUrl: './error-table.component.html',
  styleUrl: './error-table.component.css'
})

export class ErrorTableComponent implements OnInit {
  errors$: Observable<ErrorItem[]|undefined>;
  db: any;

  constructor(private local: LocalService) {
    const app = initializeApp(environment);
    this.db = getDatabase(app);
    const sessions = this.local.getList() || [];
   
    this.errors$ = from([sessions]).pipe(
      map(sessions => {
        const errors: ErrorItem[] = [];

        
        const seen = new Set<string>();
        sessions.forEach((s1:Session) => {
          const matches = sessions.filter(
            (s2:Session) =>
              s1 !== s2 &&
              s1.surgeonName === s2.surgeonName &&
              s1.timeSlot === s2.timeSlot &&
              s1.campus !== s2.campus
          );
          if (matches.length && !seen.has(s1.surgeonName + s1.timeSlot)) {
            errors.push({
              type: 'Time Conflict',
              message: `${s1.surgeonName} is assigned to both campuses during ${s1.timeSlot}.`
            });
            seen.add(s1.surgeonName + s1.timeSlot);
          }
        });

        // Warning: surgery exists in only one campus
        const campusMap: { [surgery: string]: Set<string> } = {};
        sessions.forEach((s:Session) => {
          if (!s || !s.surgery || !s.campus) return;
          if (!campusMap[s.surgery]) campusMap[s.surgery] = new Set();
          campusMap[s.surgery].add(s.campus);
        });

        Object.keys(campusMap).forEach(surgery => {
          const campuses = [...campusMap[surgery]];
          if (campuses.length === 1) {
            errors.push({
              type: 'Warning',
              message: `${surgery} only scheduled in ${campuses[0]}.`
            });
          }
        });

        // Save to Firebase
        const firebaseData: any = {};
        errors.forEach((e, i) => firebaseData[i] = e);
        set(ref(this.db, 'errors'), firebaseData);

        return errors;
      })
    );
  }

  ngOnInit(): void {}
}


