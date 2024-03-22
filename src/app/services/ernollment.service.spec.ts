import { TestBed } from '@angular/core/testing';

import { ErnollmentService } from './ernollment.service';

describe('ErnollmentService', () => {
  let service: ErnollmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErnollmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
