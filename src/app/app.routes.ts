import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ScheduleSessionsComponent } from './features/home/schedule-sessions/schedule-sessions.component';
import { LoadcalculationComponent } from './loadcalculation/loadcalculation.component';
import { ErrorTableComponent } from './features/error-table/error-table.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'schedule-sessions', component: ScheduleSessionsComponent },
  {path:'loadcalculation' , component: LoadcalculationComponent},
  { path: 'error-table', component: ErrorTableComponent }
];