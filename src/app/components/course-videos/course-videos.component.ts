import { Component, OnInit } from '@angular/core';

import { Chapter } from 'src/app/common/chapter';
import { Course } from 'src/app/common/course';

@Component({
  selector: 'app-course-videos',
  templateUrl: './course-videos.component.html',
  styleUrls: ['./course-videos.component.css'],
})
export class CourseVideosComponent implements OnInit {
  selectedChapter: string | undefined;
  course!: Course;

  constructor() {}

  ngOnInit(): void {}

  onChapterSelected(chapter: string) {
    this.selectedChapter = chapter;
  }

  courseEmitter(course: Course) {
    console.log(this.course);

    this.course = {...course};
  }
}
