import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

import { RestService } from 'src/app/rest.service';
import { JWTAuthService } from 'src/app/jwtauth.service';
import { Comment } from 'src/app/comment';
import { interval } from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  constructor(
    private restService: RestService,
    private jwtAuthService: JWTAuthService
  ) { }

  @Input() taskId!: string;
  taskComments: Comment[] = [];
  commentText: string = '';
  currentUserId: string = '';

  deleteComment: boolean = false;
  selectedComment!: Comment | undefined;

  // Reload the comments once every 10 seconds
  source = interval(10000);
  reloadSource = this.source.subscribe(val => this.setComments());

  ngOnInit(): void {
    this.currentUserId = this.jwtAuthService.getCurrentUserID();
    this.setComments();
  }

  ngOnDestroy(): void {
    this.reloadSource.unsubscribe();
  }

  isCurrentUserComment(userId: string): boolean {
    return this.currentUserId == userId;
  }

  setComments() {
    this.taskComments = [];

    this.restService.getTaskComments(this.taskId)
      .subscribe(data => {
        for (let comment of data) {
          let dstamp: string = moment(comment.dstamp).utc().format('DD-MM-YYYY HH:mm:ss');
          this.taskComments.push({
            isCurrentUserComment: this.isCurrentUserComment(comment.user_id),
            user_id: comment.user_id,
            comment_id: comment.comment_id,
            full_name: comment.full_name,
            comment_text: comment.comment_text,
            dstamp: dstamp
          });
        }
        this.sortTaskComments();
    });
  }

  sortTaskComments(): void {
    this.taskComments = this.taskComments.sort((n1, n2) => {
      if (moment(n1.dstamp).utc().isAfter(moment(n2.dstamp).utc())) {
        return 1;
      }

      if (moment(n1.dstamp).utc().isBefore(moment(n2.dstamp).utc())) {
        return -1;
      }
      return 0;
    })
  }

  submitComment() {
    // This doesn't seem like a secure way of submitting comments. Should probably go off of
    // the Bearer token somehow
    if (this.currentUserId === null) {
      this.jwtAuthService.logout();
    } else {
      this.restService.insertNewComment(this.taskId, this.currentUserId, this.commentText);

      this.taskComments.push({
        isCurrentUserComment: true,
        user_id: this.currentUserId,
        comment_id: -1,
        full_name: this.jwtAuthService.getFullName(),
        comment_text: this.commentText,
        dstamp: moment().utc().format('DD-MM-YYYY HH:mm:ss')
      })

      // Clear comment text
      this.commentText = '';
    }
  }

  beginDelete(comment: Comment): void {
    this.deleteComment = true;
    this.selectedComment = comment;
  }

  cancelDelete(): void {
    this.deleteComment = false;
    this.selectedComment = undefined;
  }

  confirmDelete(): void {
    /* 
    This can cause issues when there have been comments uploaded and the comments 
    haven't refreshed yet. As the index of the comment will have changed, and we 
    if there are multiple comments with the same text then we can't be sure which 
    comment we're deleting
    Will need to fix this later, but for now I will be assuming comments won't have
    the same value, and that if the ID is -1 then it is the most recent comment on that
    task by that user with the same text.
    */

    if (this.selectedComment !== undefined) {
      const commentId = this.selectedComment.comment_id;
      const commentText = this.selectedComment.comment_text;
      const userId = this.selectedComment.user_id;

      this.restService.deleteComment(commentId.toString(), commentText, userId)
      this.selectedComment = undefined;

      // Remove comment from taskComments
      this.taskComments.splice(this.taskComments.findIndex(
        comment => comment.comment_id === commentId
      ), 1)
    }
    this.deleteComment = false;
  }
}
