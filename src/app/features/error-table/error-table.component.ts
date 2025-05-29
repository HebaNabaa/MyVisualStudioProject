import { Component,OnInit } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { LocalService } from '../../services/Schedule.service'; 
import { map,Observable,from} from 'rxjs'

interface ErrorItem {
  Type: string;
  Message: string;
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
  errors$: Observable<ErrorItem[]|undefined >; 
  db: any;

  constructor(private local: LocalService) {
    const app = initializeApp(environment);
    this.db = getDatabase(app);
    const sessions = this.local.getList() || [];
    this.errors$ = from([sessions]).pipe(
      map(sessions => {
      const errors: ErrorItem[] = [];
      const ErrorAdded = new Set<string>();

        sessions.forEach((FirstSession:Session) => {

          const Timeconflict = sessions.filter(
            (OtherSession:Session) =>
              FirstSession !== OtherSession &&
              FirstSession.surgeonName === OtherSession.surgeonName &&
              FirstSession. timeSlot=== OtherSession. timeSlot &&
              FirstSession.campus !== OtherSession.campus
          );
            if (Timeconflict.length && !ErrorAdded.has(FirstSession.surgeonName + FirstSession. timeSlot)) {
            errors.push({
              Type: 'Time Conflict',
              Message: `${FirstSession.surgeonName} is assigned to both campuses during ${FirstSession. timeSlot}.`
            });
           ErrorAdded.add(FirstSession.surgeonName+ FirstSession. timeSlot);
          }
        });

      
        const MapSurgeryToCampus: { [surgery: string]: Set<string> } = {};
        sessions.forEach((Session:Session) => {
          if (!Session || !Session.surgery || !Session.campus) return;

          if (!MapSurgeryToCampus[Session.surgery])
             MapSurgeryToCampus[Session.surgery] = new Set();
          MapSurgeryToCampus[Session.surgery].add(Session.campus);
        });

        Object.keys(MapSurgeryToCampus).forEach(surgery => {
          const campuses = [...MapSurgeryToCampus[surgery]];
          if (campuses.length === 1) {
            errors.push({
              Type: 'Warning',
              Message: `${surgery} only scheduled in ${campuses[0]}.`
            });
          }
        });

        
        const firebaseData: any = {};
        errors.forEach((Error, i) => firebaseData[i] = Error);
        set(ref(this.db, 'error'), firebaseData) 
        .then(() => console.log("Errors saved to Firebase"))
        .catch (err => {
          console.error ('Error not saved',err);
        });
        return errors;
      })
    );
  }

  ngOnInit(): void {}
}
