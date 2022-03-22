import { TestBed } from '@angular/core/testing';

import { AssignPondUserService } from './assign-pond-user.service';

describe('AssignPondUserService', () => {
  let service: AssignPondUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignPondUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
