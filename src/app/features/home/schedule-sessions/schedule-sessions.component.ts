import { getDatabase, set, ref, onValue } from 'firebase/database';
import { PersistenceService } from './../../../m-framework/services/persistence.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Operations } from '../../../data/operations';
import { SlotSchedule } from '../../../data/slotschedule';
import { MContainerComponent } from "../../../m-framework/components/m-container/m-container.component";
import { timestamp } from 'rxjs';
import { initializeApp } from 'firebase/app';


@Component({
    selector: 'app-schedule-sessions',
    standalone: true,
    imports: [CommonModule, FormsModule,MContainerComponent],
    templateUrl: './schedule-sessions.component.html',
    styleUrl: './schedule-sessions.component.css'
  })
  export class ScheduleSessionsComponent implements OnInit{
    operations: Operations;
    surgeries: string[] = [];
    SelectedSurgery: string = "";
    numberOfSessions: number=0;
    sessions:any[]=[];
    scheduled : any[];
    formWarning:string="";
    schedule : SlotSchedule[];
    remotelistItems : any[] = [];
    db : any;


    constructor(public persistence : PersistenceService) {
      this.operations = new Operations();
      this.surgeries = this.operations.listOfSurgeries;
      this.formWarning = "";
      this.sessions = [];
      this.scheduled = [];
      const firebaseApp = initializeApp()

      this.schedule = [
        new SlotSchedule('Slot 1','MW','09:00 to 10:45'),
        new SlotSchedule('Slot 2','MW','10:55 to 12:40'),
        new SlotSchedule('Slot 3','MW','12:50 to 14:35'),
        new SlotSchedule('Slot 4','MW','15:00 to 16:45'),
        new SlotSchedule('Slot 5','MW','16:55 to 18:40'),
        new SlotSchedule('Slot 6','MW','18:50 to 20:35'),
        new SlotSchedule('Slot 7','MW','20:45 to 22:30'),
        new SlotSchedule('Slot 8','TR','09:00 to 10:45'),
        new SlotSchedule('Slot 9','TR','10:55 to 12:40'),
        new SlotSchedule('Slot 10','TR','12:50 to 14:35'),
        new SlotSchedule('Slot 11','TR','15:00 to 16:45'),
        new SlotSchedule('Slot 12','TR','16:55 to 18:40'),
        new SlotSchedule('Slot 13','TR','18:50 to 20:35'),
        new SlotSchedule('Slot 14','TR','20:45 to 22:30'),
      ];
    }

    ngOnInit(): void{
      this.remotelistItems = this.persistence.getRemoteList();
    }

    createSessions(item: any) {
      this.persistence.add(item,"local");
      this.persistence.add(item,"remote");

      if (!this.SelectedSurgery || this.numberOfSessions < 1) {
        this.formWarning = "Please select an operation and enter a valid number of sessions";
        return;
      }


      for (let i = 0; i < this.numberOfSessions; i++) {
        this.sessions.push({
          sessionId: i + 1,
          surgeonName: "",
          equipment: "",
          timeSlot: "",
          day: "",
          campus: ""
        });
      }
    }


    submitSessions() {
      const Filled = this.sessions.every(session =>
        session.surgeonName &&
        session.equipment &&
        session.timeSlot &&
        session.day &&
        session.campus
      );

      if (!Filled) {
        this.formWarning = "Please fill all fields in each session";
        return;
      }
      alert("Submitted successfully!");
    }

    removeSession(id: string){
      this.persistence.remove(id,'local');
      this.persistence.remove(id,'remote');
      alert("Session deleted successfully!")
    }

    saveVersion(){
    }
  }
