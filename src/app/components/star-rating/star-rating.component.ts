import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Course } from 'src/app/common/course';
import { Rating } from 'src/app/common/rating';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
})
export class StarRatingComponent {
  @Input() course: Course | undefined;
  starsSelected: number = 0;
  @Input() email!: string;

  constructor(
    public dialog: MatDialog,
    private courseService: CourseService,
    private router: Router
  ) {}

  @Output() eventEmitted: EventEmitter<void> = new EventEmitter<void>();


  openDialog(): void {
    this.starsSelected = 0;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { starsSelected: this.starsSelected, title: this.course?.title },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.starsSelected = result;
        if (
          this.course != undefined &&
          this.course.ratingList.some((rating) => rating.email === this.email)
        ) {
          Swal.fire({
            icon: 'error',
            title: 'You already rate this course',
          });
        } else {
          let ratingObject = new Rating(this.email, this.starsSelected);
          this.course?.ratingList.push(ratingObject);

          if (this.course != undefined) {
            this.courseService
              .updateCourseRating(this.course, this.course?.courseId)
              .subscribe((data) => {
                console.log('Rating added');
                this.eventEmitted.emit();
              });
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'The rating has been added',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        this.starsSelected = 0;
      }
    });
  }

}

export interface DialogData {
  starsSelected: number;
  title: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  standalone: true,
  styleUrls: ['./star-rating.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
  ],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router
  ) {}

  starsSelected: number = 0;
  starsClicked = false;

  onStarHover(starCount: number) {
    this.starsClicked = false;
    this.starsSelected = starCount;
  }

  onStarClick(starCount: number) {
    this.starsSelected = starCount;
    this.starsClicked = true;
    this.data.starsSelected = this.starsSelected;
  }

  onMouseLeave() {
    if (!this.starsClicked) {
      this.starsSelected = 0;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
