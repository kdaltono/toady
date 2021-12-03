import { TestBed } from '@angular/core/testing';

import { JWTAuthService } from './jwtauth.service';

describe('JWTAuthService', () => {
  let service: JWTAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JWTAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
