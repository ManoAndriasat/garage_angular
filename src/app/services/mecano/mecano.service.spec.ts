import { TestBed } from '@angular/core/testing';

import { MecanoService } from './mecano.service';

describe('MecanoService', () => {
  let service: MecanoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MecanoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
