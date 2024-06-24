import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Course } from 'src/app/common/course';
import { CourseTransferService } from 'src/app/services/course-transfer.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() course!: Course;

  constructor(
    private router: Router,
    private courseTransferService: CourseTransferService
  ) {}

  ngOnInit(): void {    
  }

  courseDetails() {
    this.courseTransferService.transferObject(this.course);

    this.router.navigate([{ outlets: { primary: 'course-details' } }]);
  }

  getStarRange(count: number): number[] {    
    return Array(count).fill(0).map((_, index) => index + 1);
  }
}
