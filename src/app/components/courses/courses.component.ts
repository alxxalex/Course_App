import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/common/course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        let newCourse = new Course();
        newCourse = data[i];
        newCourse.courseId = data[i].id;
        this.courses.push(newCourse);
      }
    });

  }
}
