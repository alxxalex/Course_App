import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/common/course';
import { CourseService } from 'src/app/services/course.service';
import { PredictionService } from 'src/app/services/prediction.service';
import { JobTitle } from 'src/app/common/job-title';

@Component({
  selector: 'app-recommended-courses',
  templateUrl: './recommended-courses.component.html',
  styleUrls: ['./recommended-courses.component.css'],
})
export class RecommendedCoursesComponent implements OnInit {
  loading: boolean = true;
  email = sessionStorage.getItem('email')!;
  recommendedCourses: Course[] = [];
  filteredCourses: Course[] = [];
  jobTitles = Object.values(JobTitle);
  selectedTitle: string = '';

  constructor(
    private predictionService: PredictionService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.predictionService
      .getRecommendedCourses(this.email)
      .subscribe((data) => {
        for (let i = 0; i < data.length; i++) {
          const id = data[i].course_id;
          this.courseService
            .getCourseById(id)
            .subscribe((course) => this.recommendedCourses.push(course));
        }
        this.loading = false;
        this.filteredCourses = this.recommendedCourses;
      });
  }

  filterByJobTitle(title: string) {
    if (this.selectedTitle == title) {
      this.selectedTitle = '';
      this.filteredCourses = this.recommendedCourses;
    } else {
      this.selectedTitle = title;

      this.filteredCourses = this.recommendedCourses.filter((c) =>
        c.jobTitle.includes(this.selectedTitle)
      );
    }
  }
}
