import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { VideoService } from 'src/app/services/video.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Course } from 'src/app/common/course';
import { Video } from 'src/app/common/video';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css'],
})
export class UploadVideoComponent implements OnInit {
  public droppedFile: NgxFileDropEntry | undefined;
  fileUploaded: boolean = false;
  fileEntry: FileSystemFileEntry | undefined;
  allowedExtensions = ['mp4', 'avi', 'mov', 'mkv'];
  loading: boolean = false;

  createVideoDetailsGroup: any;

  @Input() selectedChapter: string | undefined;
  @Input() course: Course | undefined;
  @Output() courseEmitter = new EventEmitter<Course>();

  constructor(
    private videoService: VideoService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createVideoDetailsGroup = this.formBuilder.group({
      video: this.formBuilder.group({
        title: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
      }),
    });
  }

  get title() {
    return this.createVideoDetailsGroup.get('video.title');
  }

  get description() {
    return this.createVideoDetailsGroup.get('video.description');
  }

  onSubmit() {
    console.log('Handling the submit');

    if (this.createVideoDetailsGroup.invalid) {
      this.createVideoDetailsGroup.markAllAsTouched();

      return;
    }

    const isDuplicate = this.course?.chapterList
      .find((chapter) => chapter.title === this.selectedChapter)
      ?.videoList.some(
        (existingVideo) => existingVideo.title === this.title?.value
      );

    if (isDuplicate) {
      Swal.fire({
        icon: 'error',
        title: 'The video title already exists',
      });
    } else {
      try {
        this.uploadVideo();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'An error occurred during video upload',
        });
      }
    }
  }

  public dropped(file: NgxFileDropEntry) {
    const extension = file.relativePath.split('.').pop()?.toLowerCase();

    if (
      file.fileEntry.isFile &&
      extension &&
      this.allowedExtensions.includes(extension)
    ) {
      this.droppedFile = file;
      this.fileEntry = this.droppedFile.fileEntry as FileSystemFileEntry;
      this.fileEntry.file((f: File) => {
        console.log(file.relativePath, f);

        this.fileUploaded = true;
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: "The video doesn't have the required format!",
      });
    }
  }

  async uploadVideo() {
    this.loading = true;
    if (this.fileEntry !== undefined) {
      try {
        this.fileEntry.file((file) => {
          this.videoService.uploadVideo(file).subscribe((data) => {
            console.log('Video has been uploaded : ' + data);

            let video = new Video();
            video.title =
              this.createVideoDetailsGroup.get('video.title')?.value;
            video.description =
              this.createVideoDetailsGroup.get('video.description')?.value;
            video.videoUrl = data;

            if (video.title == null || video.description == null) {
              Swal.fire({
                icon: 'error',
                title: 'An error occurred during video upload',
              });
            } else {
              this.course?.chapterList
                .find((chapter) => chapter.title === this.selectedChapter)
                ?.videoList.push(video);

              localStorage.setItem('course', JSON.stringify(this.course));

              this.courseEmitter.emit(this.course);
              this.createVideoDetailsGroup.reset();
              this.droppedFile = undefined;
              this.fileUploaded = false;
              this.loading = false;
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'The video has been saved',
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
        });
      } catch (error) {
        console.log('There was an error on video upload');
      }
    }
  }
}
