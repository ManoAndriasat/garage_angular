import { TestBed } from '@angular/core/testing';

import { LoginMecanoService } from './login-mecano.service';

describe('LoginMecanoService', () => {
  let service: LoginMecanoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginMecanoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
