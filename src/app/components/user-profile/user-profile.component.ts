import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth, loadFrame } from '@okta/okta-auth-js';
import { setInterval } from 'core-js';
import { Course } from 'src/app/common/course';
import { CourseTransferService } from 'src/app/services/course-transfer.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('auxiliaryFileInput') auxiliaryFileInput: any;
  profilePictureUrl: string | ArrayBuffer | null =
    '../../../assets/images/profile-picture.png';

  isAuthenticated: boolean = false;
  userFullName: string = '';
  email: string = '';
  enrolledCourses: Course[] = [];
  yourCourses: Course[] = [];
  selectedCourse!: Course;
  isManager: boolean = false;

  showCommentPopup: boolean = false;
  loading:boolean = false;

  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private courseService: CourseService,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private courseTransferService: CourseTransferService
  ) {}

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.email = sessionStorage.getItem('email')!;
      this.userFullName = sessionStorage.getItem('userFullName')!;
      let profilePicture = sessionStorage.getItem('profilePictureUrl');
      if (profilePicture !== '') {
        this.profilePictureUrl = profilePicture;
      }
      this.isManager = JSON.parse(sessionStorage.getItem('isManager')!);
      this.getEnrolledCourses();
      this.getYourCourses();
    });
    window.scroll(0, 0);
  }

  getEnrolledCourses() {
    this.enrolledCourses = [];
    this.courseService.getEnrolledCourses(this.email).subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        let newCourse = new Course();
        newCourse = data[i];
        newCourse.courseId = data[i].id;

        this.enrolledCourses.push(newCourse);
      }
    });
  }

  getYourCourses() {
    this.yourCourses = [];
    this.courseService
      .getCoursesByAuthor(this.userFullName)
      .subscribe((data) => {
        for (let i = 0; i < data.length; i++) {
          let newCourse = new Course();
          newCourse = data[i];
          newCourse.courseId = data[i].id;

          this.yourCourses.push(newCourse);
        }
      });
  }

  courseDetails(course: Course) {
    this.courseTransferService.transferObject(course);

    this.router.navigate([{ outlets: { primary: 'course-details' } }]);
  }


  thumbsUp(course: Course) {
    if (!course.userLikes.includes(this.email) && this.email !== '') {
      course.likes++;
      course.userLikes.push(this.email);
    } else {
      Swal.fire({
        title: 'You already liked this course',
        icon: 'info',
      });
    }

    this.courseService
      .updateCourse(course, course.courseId)
      .subscribe((data) => {});
  }

  thumbsDown(course: Course) {
    if (!course.userDislikes.includes(this.email) && this.email !== '') {
      course.dislikes++;
      course.userDislikes.push(this.email);
    } else {
      Swal.fire({
        title: 'You already disliked this course',
        icon: 'info',
      });
    }

    this.courseService
      .updateCourse(course, course.courseId)
      .subscribe((data) => {});
  }

  getStarRange(count: number): number[] {
    return Array(count)
      .fill(0)
      .map((_, index) => index + 1);
  }

  selectProfilePicture() {
    Swal.fire({
      title: 'Do you want to change your profile picture?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fileInput.nativeElement.click();
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.userService
      .updateUser(this.email, file)
      .subscribe((data: any) =>
        sessionStorage.setItem('profilePictureUrl', data.profilePictureUrl)
      );

    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePictureUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  refreshData() {
    this.getYourCourses();
    this.getEnrolledCourses();
    this.cdr.detectChanges();
  }

  deleteCourse(course: Course) {
    Swal.fire({
      title: 'Do you want to archive this course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      // if (result.isConfirmed) {
      //   this.courseService
      //     .deleteCourse(this.email, course.courseId)
      //     .subscribe((data) => this.refreshData());
      // }
      if (result.isConfirmed) {
        course.archived = true;
        this.courseService
          .updateCourse(course, course.courseId)
          .subscribe((data) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'The course has been arhived',
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  }

  addFile(fileInput: HTMLInputElement, course: Course) {
    fileInput.click();
  }

  onAuxiliaryFileSelected(event: any, course: Course) {
    const file: File = event.target.files[0];
    console.log(file.name);

    this.loading =true;
    this.courseService
      .addAuxiliaryFile(course.courseId, file)
      .subscribe((data) => {
        console.log(data);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'The file has been added',
          showConfirmButton: false,
          timer: 1500,
        });
        this.refreshData();
        this.loading = false;
      });

  }

  activateCourse(course: Course) {
    Swal.fire({
      title: 'Do you want to activate this course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        course.archived = false;
        this.courseService
          .updateCourse(course, course.courseId)
          .subscribe((data) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'The course has been activated',
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  }
}
