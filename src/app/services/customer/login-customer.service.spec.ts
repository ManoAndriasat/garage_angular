import { TestBed } from '@angular/core/testing';

import { LoginCustomerService } from './login-customer.service';

describe('LoginCustomerService', () => {
  let service: LoginCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
