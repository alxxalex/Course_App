import { TestBed } from '@angular/core/testing';

import { CourseTransferService } from './course-transfer.service';

describe('CourseTransferService', () => {
  let service: CourseTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
