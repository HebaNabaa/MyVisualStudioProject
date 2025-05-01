import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';


@Component({
  selector: 'app-error-table',
  standalone: true,
  imports: [MContainerComponent,],
  templateUrl: './error-table.component.html',
  styleUrl: './error-table.component.css'
})
export class ErrorTableComponent {

}
