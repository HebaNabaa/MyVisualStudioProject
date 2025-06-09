import { from, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PersistenceService } from '../../m-framework/services/persistence.service';
import { Router } from '@angular/router';
import { LocalService } from '../../services/Schedule.service';
import { getDatabase } from 'firebase/database';
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


    verA.session.forEach((scheduleA) =>{
      let match = false;

      verB.session.forEach((scheduleB)=>{
        if(scheduleA.surgery === scheduleB.surgery && scheduleA.campus === scheduleB.campus){
          match = true;

          if(scheduleA.timeSlot !== scheduleB.timeSlot){
            timeChanges.push(`${scheduleA.timeSlot} moved to ${scheduleB.timeSlot}.`);
            changes.push(`🕒 Time change: ${scheduleA.timeSlot} -> ${scheduleB.timeSlot}.`);
          }
          if(scheduleA.surgeonName !== scheduleB.surgeonName){
            facultyChanges.push(`${scheduleA.surgeonName} changed for ${scheduleB.surgeonName}.`);
            changes.push(`🥼 Faculty change: ${scheduleA.surgeonName} -> ${scheduleB.surgeonName}.`);
          }
        }
      });
      if(!match){
        removedSessions.push(`${scheduleA.surgery} Session Removed.`);
        changes.push(`➖ Removed Session: ${scheduleA.surgery} from campus ${scheduleA.campus}.`);
      }
    });

    verB.session.forEach((scheduleB)=>{
      let match = false;
      verA.session.forEach((scheduleA)=>{
        if(scheduleB.surgery===scheduleA.surgery && scheduleB.campus === scheduleA.campus){
          match=true;
        }
      });
      if(!match){
        addedSessions.push(`${scheduleB.surgery} Session Added.`);
        changes.push(`➕ Added Session: ${scheduleB.surgery} from campus ${scheduleB.campus}.`);
      }
    });

    this.compareResults$ = from([{changes,timeChanges,facultyChanges,addedSessions,removedSessions}]);
    this.compare = true;
  }

}
