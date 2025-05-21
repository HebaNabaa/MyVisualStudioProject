import { Component } from '@angular/core';
import { MContainerComponent } from "../m-framework/components/m-container/m-container.component";
import { Surgeons } from '../data/surgeons';
import { CommonModule } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { DataSnapshot, getDatabase, onValue, ref } from 'firebase/database';
import { ScheduleSessionsComponent } from '../features/schedule-sessions/schedule-sessions.component';
import { OnInit } from '@angular/core';
import { count } from 'rxjs';
@Component({
  selector: 'app-loadcalculation',
  standalone: true,
  imports: [MContainerComponent, CommonModule],
  templateUrl: './loadcalculation.component.html',
  styleUrl: './loadcalculation.component.css'
})


 
export class LoadcalculationComponent implements OnInit {
  surgeons: string[] = [];
  db:any;
drDareenCount: number;
drHebaCount: number;
drLynnCount: number;
drMohammadCount: number;
drAhmadCount: number;
drLaylaCount: number;
drKiranCount: number;
drFaheemCount: number;
drZakaryaCount: number;
drAliCount: number;

  constructor() {
this.drDareenCount = 0;
this.drHebaCount = 0;
this.drLynnCount = 0;
this.drMohammadCount = 0;
this.drAhmadCount = 0;
this.drLaylaCount = 0;
this.drKiranCount = 0;
this.drFaheemCount = 0;
this.drZakaryaCount = 0;
this.drAliCount = 0;
  const app = initializeApp(environment);
  this.db = getDatabase(app);
}

ngOnInit(): void {
  const surgeonsList: string[] = [];

  let count1 = 0;
  let count2 = 0;
  let count3 = 0;
  let count4 = 0;
  let count5 = 0;
  let count6 = 0;
  let count7 = 0;
  let count8 = 0;
  let count9 = 0;
  let count10 = 0;

  onValue(ref(this.db, 'items'), (snapshot) => {
    const data = snapshot.val();

    if (data) {
      Object.keys(data).forEach((key) => {
        const session = data[key];

        if (session.surgeonName) {
          surgeonsList.push(session.surgeonName);

          if (session.surgeonName === 'Dr.Dareen Alherbawi') count1++;
          else if (session.surgeonName === 'Dr.Heba Naba') count2++;
          else if (session.surgeonName === 'Dr.Lynn Abbidi') count3++;
          else if (session.surgeonName === 'Dr.Mohammad Ahsan') count4++;
          else if (session.surgeonName === 'Dr.Ahmad Salim') count5++;
          else if (session.surgeonName === 'Dr.Layla Abdalla') count6++;
          else if (session.surgeonName === 'Dr.Kiran Mostafa') count7++;
          else if (session.surgeonName === 'Dr.Faheem Tadros') count8++;
          else if (session.surgeonName === 'Dr.Zakarya Hilal') count9++;
          else if (session.surgeonName === 'Dr. Ali Hasan') count10++;
        }

 this.drDareenCount = count1;
this.drHebaCount = count2;
this.drLynnCount = count3;
this.drMohammadCount = count4;
this.drAhmadCount = count5;
this.drLaylaCount = count6;
this.drKiranCount = count7;
this.drFaheemCount = count8;
this.drZakaryaCount = count9;
this.drAliCount = count10;

      });

      this.surgeons = surgeonsList;

   
    } else {
      console.log("No data found");
    }
  });
}
}