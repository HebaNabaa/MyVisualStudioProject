import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ScheduleSessionsComponent } from './features/schedule-sessions/schedule-sessions.component';
import { LoadcalculationComponent } from './loadcalculation/loadcalculation.component';
export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'schedule-sessions' , component:ScheduleSessionsComponent},
    {path:'loadcalculation' , component: LoadcalculationComponent} 
    
    
];
