import { Component} from '@angular/core';
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

export class ErrorTableComponent {
  errors$: Observable<ErrorItem[]|undefined >; 
  db: any;

  constructor(private local: LocalService) {
    const app = initializeApp(environment);
    const sessions = this.local.getList() || [];
    this.db = getDatabase(app);
    this.errors$ = from([sessions]).pipe(
      map(sessions => {
      const errors: ErrorItem[] = [];
      const ErrorAdded = new Set<string>();

        sessions.forEach((FirstSession:Session) => {

          const Timeconflict = sessions.filter((OtherSession:Session) =>

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

      
        const Warning: { [surgery: string]: Set<string> } = {};
        sessions.forEach((Session:Session) => {
          if (!Session || !Session.surgery || !Session.campus) 
            return;

          if (!Warning[Session.surgery])
             Warning[Session.surgery] = new Set();
          Warning[Session.surgery].add(Session.campus);
        });

        Object.keys(Warning).forEach(surgery => {
          
          const campuses = [...Warning[surgery]];
          if (campuses.length === 1) {errors.push({
              Type: 'Warning',
              Message: `The ${surgery} surgery is only scheduled in ${campuses[0]}, Please verify if it is also scheduled in the other campus.`
            });
          }
        });

        
        const firebaseData: any = {};
        errors.forEach((Error, i) => firebaseData[i] = Error);
        set(ref(this.db, 'error'), firebaseData) 
        .then(() => console.log("Errors saved to Firebase"));
        return errors;
      })
    );
  }

  //ngOnInit(): void {}  implements OnInit
}
