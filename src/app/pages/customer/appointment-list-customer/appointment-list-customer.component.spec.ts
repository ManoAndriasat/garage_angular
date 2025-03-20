import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentListCustomerComponent } from './appointment-list-customer.component';

describe('AppointmentListCustomerComponent', () => {
  let component: AppointmentListCustomerComponent;
  let fixture: ComponentFixture<AppointmentListCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentListCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentListCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
