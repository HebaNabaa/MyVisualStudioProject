import { ScheduleSessionsComponent } from './../schedule-sessions/schedule-sessions.component';
import { Version } from './../../data/version';
import { map, timestamp, from, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PersistenceService } from '../../m-framework/services/persistence.service';
import { Router } from '@angular/router';
import { LocalService } from '../../services/Schedule.service';
import { getDatabase, ref, push } from 'firebase/database';
import { SlotSchedule } from '../../data/slotschedule';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { FirebaseService } from '../../m-framework/services/firebase.service';

interface Versions{
  label: string;
  timestamp: string;
  session: Session[];
}

interface Session {
  surgeonName: string;
  timeSlot: string;
  campus: string;
  surgery: string;
}

interface ComparingChanges{
  changes: string[];
  timeChanges: string[];
  facultyChanges: string[];
  removedSessions: string[];
  addedSessions: string[];
}

@Component({
  selector: 'app-save-version',
  standalone: true,
  imports: [MContainerComponent, FormsModule, CommonModule],
  templateUrl: './save-version.component.html',
  styleUrl: './save-version.component.css'
})

export class SaveVersionComponent implements OnInit{
  saveVersionA : string;
  saveVersionB : string;
  compare : boolean;
  db : any

  versions : Versions[];
  compareResults$: Observable<ComparingChanges|undefined>;


  constructor(public persistence: PersistenceService, public router: Router, public localservice: LocalService, public firebaseser : FirebaseService){
    this.saveVersionA = '';
    this.saveVersionB = '';
    this.versions = [];
    this.compare = false;
    this.compareResults$ = new Observable<ComparingChanges|undefined>;

    const firebaseApp = initializeApp(environment);
    this.db = getDatabase(firebaseApp);
  }

  ngOnInit(): void {
    this.loadVersions();
  }

  async saveVersion(){
    const schedule : Versions = {
      label: `Version ${this.versions.length+1}`,
      timestamp: new Date().toLocaleString(),
      session: [
        ...this.localservice.getallScheduledList()
      ]
    };
    const versionKey = this.firebaseser.pushToList('scheduleVersions', schedule);
    await this.loadVersions();
  }

  async loadVersions(){
    this.versions = await this.firebaseser.getList('scheduleVersions');
  }
  compareVersions(){
    const verA = this.versions.find(v => v.label === this.saveVersionA);
    const verB = this.versions.find(v => v.label === this.saveVersionB);

    if(!verA || !verB){
      console.warn("Error: Pick two versions to compare!");
      return;
    }

    const changes        : string[] = [];
    const timeChanges    : string[] = [];
    const facultyChanges : string[] = [];
    const removedSessions: string[] = [];
    const addedSessions  : string[] = [];

    verA?.session.forEach((scheduleA) => {
      const matchScheduleB = verB?.session.find(scheduleB =>
        scheduleA.surgery === scheduleB.surgery && scheduleA.campus === scheduleB.campus
      );

      if(!matchScheduleB){
        removedSessions.push(`${scheduleA.surgery} Session Removed.`);
        changes.push(`➖ Removed Session: ${scheduleA.surgery} from campus ${scheduleA.campus}.`);
      }else{
        if(scheduleA.timeSlot !== matchScheduleB.timeSlot){
          timeChanges.push(`${scheduleA.timeSlot} moved to ${matchScheduleB.timeSlot}.`);
          changes.push(`🕒 Time change: ${scheduleA.timeSlot} -> ${matchScheduleB.timeSlot}.`);
        }
        if(scheduleA.surgeonName !== matchScheduleB.surgeonName){
          facultyChanges.push(`${scheduleA.surgeonName} changed for ${matchScheduleB.surgeonName}.`);
          changes.push(`🥼 Faculty change: ${scheduleA.surgeonName} -> ${matchScheduleB.surgeonName}.`)
        }
      }
    });

    verB?.session.forEach((scheduleB) => {
      const matchScheduleA = verA?.session.find(scheduleA =>
        scheduleB.surgery === scheduleA.surgery && scheduleB.campus === scheduleA.campus
      );
      if(!matchScheduleA){
        changes.push(`➕ Added Session: ${scheduleB.surgery} from campus ${scheduleB.campus}.`)
        addedSessions.push(`${scheduleB.surgery} Session Added.`)
      }
    });

    this.compareResults$ = from([{changes,timeChanges,facultyChanges,addedSessions,removedSessions}]);
    this.compare = true;
  }



  get localList(){
    return this.persistence.getLocalList();
  }

}
