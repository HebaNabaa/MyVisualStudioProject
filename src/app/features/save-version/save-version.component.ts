import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-save-version',
  standalone: true,
  imports: [MContainerComponent, FormsModule, CommonModule],
  templateUrl: './save-version.component.html',
  styleUrl: './save-version.component.css'
})
export class SaveVersionComponent {
  selectA : string;
  selectB : string;
  versions : any[];
  compare : boolean;

  constructor(){
    this.selectA = "";
    this.selectB = "";
    this.versions = [];
    this.compare = false;
  }

  saveVersion(){}

  compareVersions(){
    this.compare = true;
  }
}
