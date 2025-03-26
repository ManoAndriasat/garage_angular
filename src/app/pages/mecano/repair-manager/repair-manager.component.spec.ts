import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairManagerComponent } from './repair-manager.component';

describe('RepairManagerComponent', () => {
  let component: RepairManagerComponent;
  let fixture: ComponentFixture<RepairManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
