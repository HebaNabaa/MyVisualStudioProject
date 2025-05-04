import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveVersionComponent } from './save-version.component';

describe('SaveVersionComponent', () => {
  let component: SaveVersionComponent;
  let fixture: ComponentFixture<SaveVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveVersionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
