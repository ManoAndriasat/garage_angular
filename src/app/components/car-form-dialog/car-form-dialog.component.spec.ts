import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarFormDialogComponent } from './car-form-dialog.component';

describe('CarFormDialogComponent', () => {
  let component: CarFormDialogComponent;
  let fixture: ComponentFixture<CarFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
