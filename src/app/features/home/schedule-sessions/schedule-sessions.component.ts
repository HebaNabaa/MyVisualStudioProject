import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MContainerComponent } from "../../../m-framework/components/m-container/m-container.component";


@Component({
  selector: 'app-schedule-sessions',
  standalone: true,
  imports: [MContainerComponent,],
  templateUrl: './schedule-sessions.component.html',
  styleUrl: './schedule-sessions.component.css'
})
export class ScheduleSessionsComponent {

}
