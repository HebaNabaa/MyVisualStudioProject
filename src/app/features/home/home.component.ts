
// Run the app
// Add another light sensor to be shown on a different canvasjs chart
// Modify your implementation to be shown on the same canvasjs chart (one chart, two lines)
// Modify your implementation to show three lines on the same chart. Light1, light2, their average
// Add a slider to control a LED's intesity. 


import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MContainerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(public router: Router){

  }
  ScheduleSession(){

    this.router.navigateByUrl('/schedule-sessions');

  }
  LoadCalc(){
    this.router.navigateByUrl('/loadcalculation');
  }
 
}