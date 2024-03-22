import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Chapter } from 'src/app/common/chapter';
import { Course } from 'src/app/common/course';
import { Enrollment } from 'src/app/common/enrollment';
import { CourseTransferService } from 'src/app/services/course-transfer.service';
import { ErnollmentService } from 'src/app/services/ernollment.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent implements OnInit {
  course!: Course;
  selectedChapter: any = null;

  constructor(
    private courseTransferService: CourseTransferService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private enrollmentService: ErnollmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseTransferService.currentObject.subscribe((course) => {
      this.course = course;
    });
    if (this.course.title == '') {
      this.course = JSON.parse(localStorage.getItem('course-details')!);
    } else {
      localStorage.setItem('course-details', JSON.stringify(this.course));
    }

    console.log(this.course);
  }

  openChapter(chapter: Chapter) {
    if (this.selectedChapter === chapter.title) {
      this.selectedChapter = null;
    } else {
      this.selectedChapter = chapter.title;
    }
  }

  enrollUser() {
    this.oktaAuth.getUser().then((res) => {
      if (res.email !== undefined) {
        let enrollment = new Enrollment(res.email, [this.course.courseId]);

        this.enrollmentService.addEnrollment(enrollment).subscribe((data) => {
          console.log(data);
        });
        
        this.router.navigate([
          { outlets: { primary: 'course-content' } },
        ])
      }
    });
  }
}
