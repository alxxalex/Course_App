import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/common/comment';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css'],
})
export class CommentCardComponent implements OnInit {
  @Input() comment!: Comment;

  constructor(private courseService:CourseService) {}

  ngOnInit(): void {    
  }

}
