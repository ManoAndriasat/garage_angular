import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinDetailsComponent } from './vin-details.component';

describe('VinDetailsComponent', () => {
  let component: VinDetailsComponent;
  let fixture: ComponentFixture<VinDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VinDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
