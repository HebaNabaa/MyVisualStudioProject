import { getDatabase, set, ref, onValue, get } from 'firebase/database';
import { Router } from '@angular/router';
import { PersistenceService } from '../../m-framework/services/persistence.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Operations } from '../../data/operations';
import { SlotSchedule } from '../../data/slotschedule';
import { MContainerComponent } from "../../m-framework/components/m-container/m-container.component";
import { timestamp } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { Surgeons } from '../../data/surgeons';
import { isNgTemplate } from '@angular/compiler';


@Component({
    selector: 'app-schedule-sessions',
    standalone: true,
    imports: [CommonModule, FormsModule,MContainerComponent],
    templateUrl: './schedule-sessions.component.html',
    styleUrls: ['./schedule-sessions.component.css']
  })

  export class ScheduleSessionsComponent implements OnInit{
    operations: Operations;
    surgeons: string[] = [];
    surgeries: string[] = [];
    SelectedSurgery: string = "";
    numberOfSessions: number=0;
    sessions:any[]=[];
    deleteSessions:any[]=[];
    scheduled : any[];
    formWarning:string="";
    schedule : SlotSchedule[];
    remotelistItems : any[] = [];
    db : any;
    abuDhabi : SlotSchedule[];
    alAin : SlotSchedule[];


    constructor(public persistence : PersistenceService, public router:Router) {
      const surgeonList = new Surgeons();
      this.surgeons = surgeonList.listOfSurgeons;
      this.operations = new Operations();
      this.surgeries = this.operations.listOfSurgeries;
      this.formWarning = "";
      this.sessions = [];
      this.scheduled = [];
      const firebaseApp = initializeApp(environment);

      this.schedule = [
        new SlotSchedule('Slot 1','MW',),
        new SlotSchedule('Slot 2','MW',),
        new SlotSchedule('Slot 3','MW',),
        new SlotSchedule('Slot 4','MW',),
        new SlotSchedule('Slot 5','MW',),
        new SlotSchedule('Slot 6','MW',),
        new SlotSchedule('Slot 7','MW',),
        new SlotSchedule('Slot 8','TR',),
        new SlotSchedule('Slot 9','TR',),
        new SlotSchedule('Slot 10','TR',),
        new SlotSchedule('Slot 11','TR',),
        new SlotSchedule('Slot 12','TR',),
        new SlotSchedule('Slot 13','TR',),
        new SlotSchedule('Slot 14','TR',),];

        this.abuDhabi = this.schedule;
        this.alAin = this.schedule;
    }


    ngOnInit(): void{
      this.remotelistItems = this.persistence.getRemoteList();
    }

    createSessions() {
      if (!this.SelectedSurgery || this.numberOfSessions < 1) {
        this.formWarning = "Please select an operation and enter a valid number of sessions";
        return;
      }

      this.sessions=[]

      for (let i = 0; i < this.numberOfSessions; i++) {
        this.sessions.push({
          sessionId: i + 1,
          surgery: this.SelectedSurgery,
          surgeonName: "",
          equipment: "",
          timeSlot: "",
          day: "",
          campus: ""
        });
      }
      const data = JSON.parse(JSON.stringify(this.sessions));

      this.persistence.add(data, "local");
      this.persistence.add(data, "remote");

    }

    resetSession(){
      this.sessions=[];
      this.numberOfSessions=0;
      this.SelectedSurgery="";
    }

    submitSessions(item: any) {
      //const Filled = this.sessions.every(session =>
        //session.surgeonName &&
        //session.equipment &&
        //session.timeSlot &&
        //session.day &&
        //session.campus
      //);
      this.scheduled.push(...this.sessions);
      alert("Submitted successfully!");

      const data = JSON.parse(JSON.stringify(this.sessions));

      this.persistence.add(data, "local");
      this.persistence.add(data, "remote");
    }

DeleteSessions(item: any) {
    const index = this.scheduled.findIndex(session => session.id === item.id);
    if (index !== -1) {
        this.scheduled.splice(index, 1);}
    
}

  //   removeSession(id: string){
  //     this.persistence.remove(id,'local');
  //     this.persistence.remove(id,'remote');
  //     alert("Session deleted successfully!")
  //   }

  //   saveVersion(){
  //   }
  //
   }
