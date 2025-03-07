import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentListMecanoComponent } from './appointment-list-mecano.component';

describe('AppointmentListMecanoComponent', () => {
  let component: AppointmentListMecanoComponent;
  let fixture: ComponentFixture<AppointmentListMecanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentListMecanoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentListMecanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
