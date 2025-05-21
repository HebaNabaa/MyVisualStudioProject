import { Component } from '@angular/core';
import { MContainerComponent } from "../m-framework/components/m-container/m-container.component";
import { Surgeons } from '../data/surgeons';
import { CommonModule } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { DataSnapshot, getDatabase, onValue, ref } from 'firebase/database';
import { ScheduleSessionsComponent } from '../features/schedule-sessions/schedule-sessions.component';
import { OnInit } from '@angular/core';
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

  constructor() {
const app= initializeApp(environment)
      this.db = getDatabase(app);

  }

  ngOnInit(): void {
    const surgeonsList: string[] = [];

    onValue(ref(this.db, 'items'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.keys(data).forEach((key) => {
          const session = data[key];
          if (session.surgeonName) {
            surgeonsList.push(session.surgeonName);
          }
        });

        this.surgeons = surgeonsList;
        console.log("Surgeons loaded:", this.surgeons);
      } else {
        console.log("No data found");
      }
    });
  }
}