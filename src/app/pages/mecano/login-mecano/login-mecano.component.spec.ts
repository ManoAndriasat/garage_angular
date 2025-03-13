import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMecanoComponent } from './login-mecano.component';

describe('LoginMecanoComponent', () => {
  let component: LoginMecanoComponent;
  let fixture: ComponentFixture<LoginMecanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginMecanoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginMecanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
