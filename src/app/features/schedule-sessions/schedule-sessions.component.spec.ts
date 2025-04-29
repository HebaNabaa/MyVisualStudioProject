import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSessionsComponent } from './schedule-sessions.component';

describe('ScheduleSessionsComponent', () => {
  let component: ScheduleSessionsComponent;
  let fixture: ComponentFixture<ScheduleSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSessionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
