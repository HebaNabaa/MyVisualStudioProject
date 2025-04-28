
// Run the app
// Add another light sensor to be shown on a different canvasjs chart
// Modify your implementation to be shown on the same canvasjs chart (one chart, two lines)
// Modify your implementation to show three lines on the same chart. Light1, light2, their average
// Add a slider to control a LED's intesity. 


import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MCardComponent } from '../../m-framework/components/m-card/m-card.component';
import { MResultBoxComponent } from '../../m-framework/components/m-result-box/m-result-box.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { PersistenceService } from '../../m-framework/services/persistence.service';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set} from 'firebase/database';
import { MAnalogOutputComponent } from '../../m-framework/components/m-analog-output/m-analog-output.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MContainerComponent,MCardComponent,MResultBoxComponent,CanvasJSAngularChartsModule,MAnalogOutputComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HardwareComponent {
  
  DCMotorSpeed: number; 
  ServoMotorAngle: number;
  LEDState: number;
  ButtonState: number;
  LightSensorState: number;
  LightSensorValues: any[];
  chart: any;
  chartOptions: any;
  db: any; 
  refDC: any; 
  refServo: any; 
  refLED: any; 
  refButton: any;
  refLight: any;

  getChartInstance(chart: object) {
    this.chart = chart;
  }

  
  constructor(public persistenceService:PersistenceService) // Step 2: Inject the service - Depend. Injection 
  {
    this.DCMotorSpeed = 0;
    this.ServoMotorAngle = 0;
    this.LEDState = 0;
    this.ButtonState = -1;
    this.LightSensorState = -1; // Unknown at beginning 
    this.LightSensorValues = []; // Initialize with default values
    this.chartOptions = { theme: "light2", title: { text: "Live Data"}, axisX: {title: "Time",  valueFormatString: "HH:mm:ss",  xValueType: "dateTime"}};
    const firebaseApp = initializeApp(environment);
    this.db = getDatabase(firebaseApp);
    this.refButton = ref(this.db,'monitor/button');
    this.refLight = ref(this.db,'monitor/light_sensor');
    
    onValue(this.refButton,(snapshot)=>{
      this.ButtonState = snapshot.val();
      console.log("Button State: ", this.ButtonState);
      }
    );
    onValue(this.refLight,(snapshot)=>{ 
      this.LightSensorState = snapshot.val();
      console.log("Light Sensor State: ", this.LightSensorState);
      this.LightSensorValues.push({x: new Date(), y: this.LightSensorState});
      this.chartOptions.data = [{ type: "line", dataPoints: this.LightSensorValues}]
      this.chart.render();
      }
    );
  }
  
  updateDCMotorSpeed() {
    set(ref(this.db,'/control'), { dcmotor: this.DCMotorSpeed, servo: this.ServoMotorAngle, led: this.LEDState }).then(() => {
      console.log("DC Motor Speed updated in Firebase");
    });
  }
  updateServoMotorAngle() {
    set(ref(this.db,'/control'), { dcmotor: this.DCMotorSpeed, servo: this.ServoMotorAngle, led: this.LEDState }).then(() => {
      console.log("Angle updated in Firebase");
    });
  }
  toggleLED() {
    this.LEDState = this.LEDState == 0? 100:0;
    set(ref(this.db,'/control'), { dcmotor: this.DCMotorSpeed, servo: this.ServoMotorAngle, led: this.LEDState }).then(() => {
      console.log("LED Command Send");
    });
  }
}
