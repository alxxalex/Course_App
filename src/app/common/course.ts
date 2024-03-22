import { Comment } from './comment';
import { Chapter } from './chapter';

export class Course {
  courseId:string = '';
  author: string = '';
  title: string = '';
  description: string = '';
  likes: number = 0;
  dislikes: number = 0;
  enrolmentCount: number = 0;
  thumbnailUrl: string = '';
  commentList: Array<Comment> = [];
  chapterList: Array<Chapter> = [];
}
