import {
  Component,
  OnInit,
  ElementRef,
  Output,
  EventEmitter,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Chapter } from 'src/app/common/chapter';
import { Course } from 'src/app/common/course';
import { Video } from 'src/app/common/video';
import { CourseTransferService } from 'src/app/services/course-transfer.service';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css'],
})
export class ChaptersComponent implements OnInit, AfterViewInit, OnChanges {
  constructor(
    private elementRef: ElementRef,
    private courseTransferService: CourseTransferService,
    private courseService: CourseService,
    private router: Router
  ) {}

  newChapterName: string = '';
  selectedChapter: any = null;
  selectedVideo: Video = new Video();
  @Input() course!: Course;

  @Output() selectedChapterEmitter = new EventEmitter<string>();
  @Output() courseEmitter = new EventEmitter<Course>();
  @Output() videoEmitter = new EventEmitter<Video>();


  ngOnInit(): void {
    this.courseTransferService.currentObject.subscribe((course) => {
      this.course = course;
    });
    if (this.course.title == '') {
      this.course = JSON.parse(localStorage.getItem('course')!);
    } else {
      localStorage.setItem('course', JSON.stringify(this.course));
    }

    this.selectedChapter = this.course.chapterList[0].title;
    this.selectedChapterEmitter.emit(this.selectedChapter);

    this.courseEmitter.emit(this.course);
    console.log('chapter ---> ' + this.selectedChapter);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      this.course = changes['course'].currentValue;
      if (this.course !== undefined) {
        localStorage.setItem('course', JSON.stringify(this.course));
      }
      // console.log('on change --->');
      // console.log(this.course);
    }
  }

  ngAfterViewInit() {
    const imgElement: HTMLImageElement =
      this.elementRef.nativeElement.querySelector('#thumbnail');

    imgElement.src = this.course.thumbnailUrl;
  }

  openChapter(chapter: Chapter) {
    if (this.selectedChapter === chapter.title) {
      this.selectedChapter = null;
    } else {
      this.selectedChapter = chapter.title;
      this.selectedChapterEmitter.emit(this.selectedChapter);
    }
  }

  displayNewChapter() {
    const container = this.elementRef.nativeElement.querySelector('#container');

    container.classList.remove('slide-out-animation');

    container.classList.add('slide-in-animation');

    container.style.display = 'block';

    setTimeout(function () {}, 500);
  }

  addChapter() {
    const container = this.elementRef.nativeElement.querySelector('#container');
    container.classList.remove('slide-in-animation');

    container.style.display = 'none';

    if (this.newChapterName.trim() !== '') {
      let newChapter = new Chapter();
      newChapter.title = this.newChapterName;
      this.course.chapterList.push(newChapter);
      localStorage.setItem('course', JSON.stringify(this.course));
      this.newChapterName = '';
    }
  }

  deleteVideo(videoTitle: string) {
    const chapterToDeleteFrom = this.course?.chapterList.find(
      (chapter) => chapter.title === this.selectedChapter
    );
    if (chapterToDeleteFrom) {
      chapterToDeleteFrom.videoList = chapterToDeleteFrom.videoList.filter(
        (video) => video.title !== videoTitle
      );
      localStorage.setItem('course', JSON.stringify(this.course));
    }
  }

  deleteChapter(chapterTitle: string) {
    if (this.course.chapterList.length > 1) {
      this.course.chapterList = this.course.chapterList.filter(
        (chapter) => chapter.title !== chapterTitle
      );
      localStorage.setItem('course', JSON.stringify(this.course));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'You need to have at least one chapter',
      });
    }
  }

  updateCourse() {
    this.courseService
      .updateCourse(this.course, this.course.courseId)
      .subscribe((data) => {
        this.router.navigate([{ outlets: { primary: 'courses' } }]);
      });
  }

  selectVideo(video: Video){
    if(this.selectedVideo.title === video.title){
      this.selectedVideo = new Video();
    }else{
      this.selectedVideo = video
    }
    this.videoEmitter.emit(this.selectedVideo);
  }
}
