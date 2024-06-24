export class Comment {
  likeCount: number;
  dislikeCount: number;

  constructor(public text: string, public author: string) {
    this.likeCount = 0;
    this.dislikeCount = 0;
  }
}
