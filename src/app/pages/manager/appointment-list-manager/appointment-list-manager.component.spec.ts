import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentListManagerComponent } from './appointment-list-manager.component';

describe('AppointmentListManagerComponent', () => {
  let component: AppointmentListManagerComponent;
  let fixture: ComponentFixture<AppointmentListManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentListManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentListManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
