import { TestBed } from '@angular/core/testing';

import { PondService } from './pond.service';

describe('PondServiceService', () => {
  let service: PondService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PondService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
