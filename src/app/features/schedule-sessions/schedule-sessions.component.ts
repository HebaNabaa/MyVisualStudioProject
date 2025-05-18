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
import{LocalService} from '../../services/Schedule.service'


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
    sessionId: any[];

    constructor(public persistence : PersistenceService, public router:Router, public localService: LocalService) {
      const surgeonList = new Surgeons();
      this.surgeons = surgeonList.listOfSurgeons;
      this.operations = new Operations();
      this.surgeries = this.operations.listOfSurgeries;
      this.formWarning = "";
      this.sessions = [];
      this.scheduled = [];
      this.sessionId=[];
      const firebaseApp = initializeApp(environment);
      this.db = getDatabase(firebaseApp);

      this.schedule = [
        new SlotSchedule('Slot 1','MW','9:00 to 10:45'),
        new SlotSchedule('Slot 2','MW','10:55 to 12:40'),
        new SlotSchedule('Slot 3','MW','12:50 to 14:35'),
        new SlotSchedule('Slot 4','MW','15:00 to 16:45'),
        new SlotSchedule('Slot 5','MW','16:55 to 18:40'),
        new SlotSchedule('Slot 6','MW','18:50 to 20:35'),
        new SlotSchedule('Slot 7','MW','20:45 to 22:30'),
        new SlotSchedule('Slot 8','TR','9:00 to 10:45'),
        new SlotSchedule('Slot 9','TR','10:55 to 12:40'),
        new SlotSchedule('Slot 10','TR','12:50 to 14:35'),
        new SlotSchedule('Slot 11','TR','15:00 to 16:45'),
        new SlotSchedule('Slot 12','TR','16:55 to 18:40'),
        new SlotSchedule('Slot 13','TR','18:50 to 20:35'),
        new SlotSchedule('Slot 14','TR','20:45 to 22:30'),];

        this.abuDhabi = this.schedule;
        this.alAin = this.schedule;
    }


    ngOnInit(): void{
      this.remotelistItems = this.persistence.getRemoteList();
        this.scheduled = this.localService.getList();

    }

    createSessions() {
      if (!this.SelectedSurgery || this.numberOfSessions < 1) {
        this.formWarning = "Please select an operation and enter a valid number of sessions";
        return;
      }

      this.sessions=[]

      for (let i = 0; i < this.numberOfSessions; i++) {
        this.sessions.push({
          s:"",
          sessionId: i + 1,
          surgery: this.SelectedSurgery,
          surgeonName: "",
          equipment: "",
          timeSlot: "",
          campus: ""
        });
      }



    }

  submitSessions(form:any) {

   this.scheduled.push(...this.sessions);
   this.sessions.forEach(session => this.persistence.add(session,'remote'));
   console.log(this.scheduled)
   this.scheduled = this.localService.getList();
    //localStorage.setItem('local', JSON.stringify(this.scheduled));

  };






DeleteSessions(item: any) {
  const index = this.scheduled.findIndex(s => s.s === item.s);
  if (index !== -1) {
    this.scheduled.splice(index, 1);
   this.scheduled = this.localService.getList();
   this.persistence.remove(item.s,'remote');
  }
}
  get localList(){
    return this.persistence.getLocalList();




}}





