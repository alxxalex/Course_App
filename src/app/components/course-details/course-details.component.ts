import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Chapter } from 'src/app/common/chapter';
import { Course } from 'src/app/common/course';
import { Enrollment } from 'src/app/common/enrollment';
import { CourseTransferService } from 'src/app/services/course-transfer.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent implements OnInit {
  course!: Course;
  selectedChapter: any = null;
  enrolled: boolean = true;
  email = sessionStorage.getItem('email');
  loading: boolean = false;

  constructor(
    private courseTransferService: CourseTransferService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private enrollmentService: EnrollmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    this.courseTransferService.currentObject.subscribe((course) => {
      // console.log(course);
      
      this.course = course;      
      if (this.course.title == '') {
        this.course = JSON.parse(localStorage.getItem('course-details')!);
        console.log(this.course);
        
      } else {
        localStorage.setItem('course-details', JSON.stringify(this.course));
      }
      if (this.email !== null) {
        this.enrollmentService
          .getEnrollemntByEmail(this.email)
          .subscribe((data) => {
            if(data == null){
              this.enrolled = false;
            }else{
              this.enrolled = data.courses.includes(this.course.courseId);
            }
          });
      }
    });    
  }

  openChapter(chapter: Chapter) {
    if (this.selectedChapter === chapter.title) {
      this.selectedChapter = null;
    } else {
      this.selectedChapter = chapter.title;
    }
  }

  enrollUser() {
    this.loading = true;

    if (this.email !== null) {
      this.enrollmentService
        .addEnrollment(this.email, this.course.courseId)
        .subscribe((data: any) => {
          console.log(
            'The user has enrolled to the course ' + this.course.title
          );
          this.router.navigate(['/course-content', this.course.courseId]);
        });
    }
  }

  getStarRange(count: number): number[] {
    return Array(count)
      .fill(0)
      .map((_, index) => index + 1);
  }

  navigateToCourseContent(courseId: string) {
    this.router.navigate([
      { outlets: { primary: 'course-content/' + courseId } },
    ]);
  }
}
