import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideeffectComponent } from './sideeffect.component';

describe('SideeffectComponent', () => {
  let component: SideeffectComponent;
  let fixture: ComponentFixture<SideeffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideeffectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SideeffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
