import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInputComponent } from './job-input.component';

describe('JobInputComponent', () => {
  let component: JobInputComponent;
  let fixture: ComponentFixture<JobInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
