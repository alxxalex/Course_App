import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/common/course';
import { CourseService } from 'src/app/services/course.service';
import { JobTitle } from 'src/app/common/job-title';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  jobTitlesSelected: boolean = false;
  jobTitles = Object.values(JobTitle);
  selectedTitle: string = '';
  email = sessionStorage.getItem('email')!;
  loading: boolean = false;
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  recommendedCourses: Course[] = [];

  // Pagination
  thePageNumber: number = 1;
  thePageSize: number = 6;
  theTotalElements: number = 0;
  searchTitle: string = '';

  constructor(
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    // this.courseService.getCourses().subscribe((data) => {
    //   for (let i = 0; i < data.length; i++) {
    //     let newCourse = new Course();
    //     newCourse = data[i];
    //     newCourse.courseId = data[i].id;
    //     this.courses.unshift(newCourse);
    //   }
    //   this.filteredCourses = this.courses;
    // });

    this.listCourses('','');
  }

  filterByJobTitle(title: string) {
    if (this.selectedTitle == title) {
      this.selectedTitle = '';
      // this.filteredCourses = this.courses;
    } else {
      this.selectedTitle = title;

      // this.filteredCourses = this.courses.filter((c) =>
      //   c.jobTitle.includes(this.selectedTitle)
      // );
    }
    this.listCourses(this.searchTitle,this.selectedTitle)
  }

  // doSearch(value: string) {
  //   this.courseService.searchCourses(value).subscribe((data: any) => {
  //     this.courses = [];
  //     for (let i = 0; i < data.length; i++) {
  //       let newCourse = new Course();
  //       newCourse = data[i];
  //       newCourse.courseId = data[i].id;
  //       this.courses.unshift(newCourse);
  //     }
  //     this.filteredCourses = this.courses;
  //     console.log(this.filteredCourses);
  //   });
  // }

  listCourses(title: string, jobTitle: string) {
    this.courseService
      .findCoursesByTitle(
        title,
        this.thePageNumber - 1,
        this.thePageSize,
        jobTitle
      )
      .subscribe((data) => this.processResult(data));
  }

  processResult(data: any) {
    console.log(data);

    this.courses = [];

    for (let i = 0; i < data.content.length; i++) {
      let newCourse = new Course();
      newCourse = data.content[i];
      newCourse.courseId = data.content[i].id;
      // this.courses.unshift(newCourse);
      this.courses.push(newCourse);
    }
    this.filteredCourses = this.courses;

    this.thePageNumber = data.pageable.pageNumber + 1;
    this.thePageSize = data.pageable.pageSize;
    this.theTotalElements = data.totalElements;
  }

  allCoursesIfBlank(value: string) {
    if (value == '') {
      // this.courseService.getCourses().subscribe((data) => {
      //   this.courses = [];
      //   for (let i = 0; i < data.length; i++) {
      //     let newCourse = new Course();
      //     newCourse = data[i];
      //     newCourse.courseId = data[i].id;
      //     this.courses.unshift(newCourse);
      //   }
      //   this.filteredCourses = this.courses;
      // });
      this.listCourses('',this.selectedTitle);
    }
  }
}
