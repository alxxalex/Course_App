import { Component, OnInit } from '@angular/core';

import { Chapter } from 'src/app/common/chapter';
import { Course } from 'src/app/common/course';
import { Video } from 'src/app/common/video';

@Component({
  selector: 'app-course-videos',
  templateUrl: './course-videos.component.html',
  styleUrls: ['./course-videos.component.css'],
})
export class CourseVideosComponent implements OnInit {
  selectedChapter: string | undefined;
  course!: Course;
  selectedVideo!: Video ;
  isVideoSelected: boolean = false;
  isVideoPresent: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onChapterSelected(chapter: string) {
    this.selectedChapter = chapter;
    this.isVideoPresent = false;
    this.selectedVideo = new Video();
  }

  courseEmitter(course: Course) {
    this.course = { ...course };
  }

  videoEmitter(video: Video){
    
    if(video.title === ''){
      this.selectedVideo = new Video();
      this.isVideoPresent = false;      
    }else{
    this.selectedVideo = {...video}
    this.isVideoPresent = true;
    }
    
  }
}
