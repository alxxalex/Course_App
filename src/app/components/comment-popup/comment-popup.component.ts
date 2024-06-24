import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Comment } from 'src/app/common/comment';
import { Course } from 'src/app/common/course';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comment-popup',
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.css'],
})
export class CommentPopupComponent {
  @Input() course: Course | undefined;
  comment: string = '';
  @Input() userFullName!: string;

  constructor(
    public dialog: MatDialog,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private courseService: CourseService
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { comment: this.comment, title: this.course?.title },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      
      if (result != undefined) {
        this.comment = result;
        let commentObject: Comment = new Comment(
          this.comment,
          this.userFullName
        );
        this.course?.commentList.push(commentObject);
        
        if (this.course != undefined) { 
                   
          this.courseService
            .updateCourse(this.course, this.course?.courseId)
            .subscribe((data) => {console.log('Comment added');
            });
        }

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'The comment has been added',
          showConfirmButton: false,
          timer: 1500,
        });

        this.comment = '';
      }
    });
  }
}

export interface DialogData {
  comment: number;
  title: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  standalone: true,
  styleUrls: ['./comment-popup.component.css'],
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
