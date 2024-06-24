import { Comment } from './comment';
import { Chapter } from './chapter';
import { Rating } from './rating';
import { AuxiliaryFile } from './auxiliary-file';

export class Course {
  courseId: string = '';
  author: string = '';
  title: string = '';
  description: string = '';
  likes: number = 0;
  userLikes: Array<string> = [];
  dislikes: number = 0;
  userDislikes: Array<string> = [];
  enrolmentCount: number = 0;
  thumbnailUrl: string = '';
  commentList: Array<Comment> = [];
  ratingList: Array<Rating> = [];
  ratingMean: number = 0;
  chapterList: Array<Chapter> = [];
  pictureUrl: string = '';
  jobTitle: Array<string> = [];
  auxiliaryFiles: Array<AuxiliaryFile> = [];
  archived:boolean = false;
}
