import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarOnRepairMecanoComponent } from './car-on-repair-mecano.component';

describe('CarOnRepairMecanoComponent', () => {
  let component: CarOnRepairMecanoComponent;
  let fixture: ComponentFixture<CarOnRepairMecanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarOnRepairMecanoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarOnRepairMecanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
