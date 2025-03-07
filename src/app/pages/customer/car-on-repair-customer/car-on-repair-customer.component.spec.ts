import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarOnRepairCustomerComponent } from './car-on-repair-customer.component';

describe('CarOnRepairCustomerComponent', () => {
  let component: CarOnRepairCustomerComponent;
  let fixture: ComponentFixture<CarOnRepairCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarOnRepairCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarOnRepairCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
