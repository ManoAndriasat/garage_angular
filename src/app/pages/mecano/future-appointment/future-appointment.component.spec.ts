import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureAppointmentComponent } from './future-appointment.component';

describe('FutureAppointmentComponent', () => {
  let component: FutureAppointmentComponent;
  let fixture: ComponentFixture<FutureAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FutureAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutureAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
