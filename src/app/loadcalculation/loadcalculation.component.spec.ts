import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoadcalculationComponent } from './loadcalculation.component';

describe('LoadcalculationComponent', () => {
  let component: LoadcalculationComponent;
  let fixture: ComponentFixture<LoadcalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadcalculationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadcalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
