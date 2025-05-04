import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MContainerComponent,RouterModule],
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
  ErrorGenerate(){
    this.router.navigateByUrl('/errorTable');
  }
  SaveSession(){
    this.router.navigateByUrl('/save-version');
  }
}
