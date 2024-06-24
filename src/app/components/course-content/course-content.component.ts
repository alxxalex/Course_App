import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chapter } from 'src/app/common/chapter';
import { Course } from 'src/app/common/course';
import { Video } from 'src/app/common/video';
import { CourseService } from 'src/app/services/course.service';
// import { VgApiService } from '@videogular/ngx-videogular/core';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.css'],
})
export class CourseContentComponent implements OnInit {
  selectedChapter: Chapter = new Chapter();
  selectedVideo: Video | null = new Video();
  course!: Course;
  isVideoPresent: boolean = false;
  email!: string;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private elementRef: ElementRef,
    // private vgApi: VgApiService
  ) {}

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email')!;
    this.route.params.subscribe((params) => {
      let id = params['id'];
      this.courseService.getCourseById(id).subscribe((data) => {
        this.course = data;
        this.course.courseId = id;
        this.selectedVideo = this.course.chapterList[0].videoList[0];
        for (let i = 0; i < this.course.chapterList.length; i++) {
          const chapter = this.course.chapterList[i];
          for (let j = 0; j < chapter.videoList.length; j++) {
            const video = chapter.videoList[j];
            if (!video.usersThatWatched.includes(this.email)) {
              this.selectedVideo = video;
              break;
            }
          }
          if (
            this.selectedVideo.title !==
            this.course.chapterList[0].videoList[0].title
          ) {
            break;
          }
        }
        this.isVideoPresent = true;
      });
    });
    window.scrollTo(0, 0);
  }

  openChapter(chapter: Chapter) {
    if (this.selectedChapter.title === chapter.title) {
      this.selectedChapter = new Chapter();
    } else {
      this.selectedChapter = chapter;
    }
  }

  selectVideo(video: Video) {
    this.isVideoPresent = false;

    this.selectedVideo = { ...video };

    let videoBarItems =
      this.elementRef.nativeElement.querySelectorAll('.video-bar-item');

    videoBarItems.forEach((v: HTMLElement) => {
      if (
        this.selectedVideo !== null &&
        v.innerHTML.trim() === this.selectedVideo.title
      ) {
        v.classList.add('click-background');
      } else {
        v.classList.remove('click-background');
      }
    });

    this.isVideoPresent = true;
  }

  // onPlayerReady(api: VgApiService) {
  //   this.vgApi = api;
  //   console.log(api.getDefaultMedia().canPlay);
  // }

  onVideoEnded() {
    if (
      this.selectedVideo?.title !== undefined &&
      !this.selectedVideo?.usersThatWatched.includes(this.email)
    ) {
      this.selectedVideo.usersThatWatched.push(this.email);
      this.course.chapterList.forEach((chapter) => {
        chapter.videoList.forEach((video) => {
          if (video.title === this.selectedVideo?.title) {
            video.usersThatWatched = this.selectedVideo.usersThatWatched;
          }
        });
      });

      this.courseService
        .updateCourse(this.course, this.course.courseId)
        .subscribe((data) => {});
    }
    console.log(1);
    
    for (let i = 0; i < this.course.chapterList.length; i++) {
      const chapter = this.course.chapterList[i];
      for (let j = 0; j < chapter.videoList.length; j++) {
        const video = chapter.videoList[j];   
        if (video.title === this.selectedVideo?.title) {
          console.log(2);
          if (j + 1 < chapter.videoList.length) {
            this.selectedVideo = chapter.videoList[j + 1];
          }
          break;
        }
      }
    }
  }
}
