import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { Chapter } from 'src/app/common/chapter';
import { Course } from 'src/app/common/course';
import { JobTitle } from 'src/app/common/job-title';
import { CourseTransferService } from 'src/app/services/course-transfer.service';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css'],
})
export class CourseFormComponent implements OnInit {
  public file: NgxFileDropEntry | undefined;
  fileUploaded: boolean = false;
  fileEntry: FileSystemFileEntry | undefined;

  isAuthenticated: boolean = false;
  userFullName: string = '';

  createCourseFormGroup: any;
  loading: boolean = false;

  jobTitles = Object.values(JobTitle);  

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private courseTransferService: CourseTransferService,
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  ngOnInit(): void {
    this.createCourseFormGroup = this.formBuilder.group({
      details: this.formBuilder.group({
        title: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        firstChapter: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        jobTitle: new FormControl('', [
          Validators.required,
        ]),
      }),
    });
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.userFullName = sessionStorage.getItem("userFullName")!;
    });
  }

  get title() {
    return this.createCourseFormGroup.get('details.title');
  }

  get description() {
    return this.createCourseFormGroup.get('details.description');
  }

  get firstChapter() {
    return this.createCourseFormGroup.get('details.firstChapter');
  }

  get jobTitle(){
    return this.createCourseFormGroup.get('details.jobTitle');
  }

  public dropped(droppedFile: NgxFileDropEntry) {
    if (droppedFile.fileEntry.isFile) {
      this.file = droppedFile;
      this.fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      this.fileEntry.file((file: File) => {
        console.log(droppedFile.relativePath, file);

        this.fileUploaded = true;
      });
    } else {
      const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      console.log(droppedFile.relativePath, fileEntry);
    }
  }

  onSubmit() {
    console.log('Handling the submit');

    if (this.createCourseFormGroup.invalid) {
      this.createCourseFormGroup.markAllAsTouched();

      return;
    }

    this.loading = true;
    
    this.createCourse();
  }

  onJobsChange(jobs: string[]): void {
    console.log('Jobs:', jobs);
    this.createCourseFormGroup.get('details.jobTitle')?.setValue(jobs);
  }

  createCourse() {
    if (this.fileEntry !== undefined) {
      this.fileEntry.file((file) => {
        let course = new Course();
        course.title = this.createCourseFormGroup.get('details.title')?.value;
        course.description = this.createCourseFormGroup.get(
          'details.description'
        )?.value;
        let firstChapter = new Chapter();
        firstChapter.title = this.createCourseFormGroup.get(
          'details.firstChapter'
        )?.value;
        course.chapterList[0] = firstChapter;
        course.author = this.userFullName;
        course.pictureUrl = sessionStorage.getItem('profilePictureUrl')!;
        course.jobTitle = this.jobTitle?.value;

        this.courseService.addCourse(course).subscribe((data) => {
          if (this.fileEntry !== undefined) {
            this.fileEntry.file((file) => {
              const courseId = data.id;
              course.courseId = data.id;

              this.courseService
                .uploadThumbnail(file, courseId)
                .subscribe((data) => {
                  console.log('Thumbnail has been uploaded:' + data);
                  course.thumbnailUrl = data;

                  this.courseTransferService.transferObject(course);

                  this.router.navigate([
                    { outlets: { primary: 'course-videos' } },
                  ]);
                });
            });
          }
        });
      });
    }
  }
}
