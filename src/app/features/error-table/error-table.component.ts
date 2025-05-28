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
  Surgeon: string;
  TimeSlot: string;
  Campus: string;
  Surgery: string;
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
      const ErrorAdded = new Set<string>();

        sessions.forEach((FirstSession:Session) => {

          const Timeconflict = sessions.filter(
            (OtherSession:Session) =>
              FirstSession !== OtherSession &&
              FirstSession.Surgeon === OtherSession.Surgeon &&
              FirstSession. TimeSlot=== OtherSession. TimeSlot &&
              FirstSession.Campus !== OtherSession.Campus
          );
            if (Timeconflict.length && !ErrorAdded.has(FirstSession.Surgeon + FirstSession. TimeSlot)) {
            errors.push({
              Type: 'Time Conflict',
              Message: `${FirstSession.Surgeon} is assigned to both campuses during ${FirstSession. TimeSlot}.`
            });
           ErrorAdded.add(FirstSession.Surgeon+ FirstSession. TimeSlot);
          }
        });

      
        const MapSurgeryToCampus: { [surgery: string]: Set<string> } = {};
        sessions.forEach((Session:Session) => {
          if (!Session || !Session.Surgery || !Session.Campus) return;

          if (!MapSurgeryToCampus[Session.Surgery])
             MapSurgeryToCampus[Session.Surgery] = new Set();
          MapSurgeryToCampus[Session.Surgery].add(Session.Campus);
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
        set(ref(this.db, 'errors'), firebaseData);
        return errors;
      })
    );
  }

  ngOnInit(): void {}
}
