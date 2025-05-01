import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Operations } from '../../../data/operations';
import { MContainerComponent } from "../../../m-framework/components/m-container/m-container.component";

@Component({
    selector: 'app-schedule-sessions',
    standalone: true,
    imports: [CommonModule, FormsModule,MContainerComponent],
    templateUrl: './schedule-sessions.component.html',
    styleUrl: './schedule-sessions.component.css'
  })
  export class ScheduleSessionsComponent {
    operations: Operations;         
    surgeries: string[] = [];       
    SelectedSurgery: string = ""; 
    numberOfSessions: number=0;
    sessions:any[]=[];
    formWarning:string="";  

  
    constructor() {
      this.operations = new Operations();           
      this.surgeries = this.operations.listOfSurgeries;  
      this.formWarning = "";
      this.sessions = [];
    }
  
    createSessions() {
      
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
  }
  