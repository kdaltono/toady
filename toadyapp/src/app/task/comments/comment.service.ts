import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { Comment } from 'src/app/comment';
import { RestService } from 'src/app/rest.service';

import * as moment from 'moment';
import { JWTAuthService } from 'src/app/jwtauth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  // BehaviourSubject that stores the array of values, this is what we will subscribe to
  private committedComments: Comment[] = [];
  private commentArray: Comment[] = [];
  private behaviourSubjectCommentArray: BehaviorSubject<Comment[]> 
    = new BehaviorSubject<Comment[]>(this.commentArray);
  
  private taskId: string = '';
  private currentUserId: string = '';

  constructor(
    private restService: RestService,
    private jwtAuthService: JWTAuthService
  ) { }

  loadTaskComments(taskId: string) {
    this.taskId = taskId;
    this.currentUserId = this.jwtAuthService.getCurrentUserID();

    // Load comments and store them
    this.setComments();
  }

  private isCurrentUserComment(userId: string): boolean {
    return this.currentUserId == userId;
  }

  private setComments() {
    this.commentArray = [];

    this.restService.getTaskComments(this.taskId)
      .subscribe(data => {
        for (let comment of data) {
          let dstamp: string = moment(comment.dstamp).utc().format('DD-MM-YYYY HH:mm:ss');
          this.addCommentToArray({
            isCurrentUserComment: this.isCurrentUserComment(comment.user_id),
            user_id: comment.user_id,
            comment_id: comment.comment_id,
            full_name: comment.full_name,
            comment_text: comment.comment_text,
            dstamp: dstamp
          });
        }
    });
  }

  getCommentArrayInstance() {
    return this.behaviourSubjectCommentArray;
  }

  private addCommentToArray(comment: Comment) {
    this.commentArray.push(comment);
    this.updateCommentArray();
  }

  commitComment(comment: Comment) {
    this.addCommentToArray(comment);
    this.committedComments.push(comment);
  }

  pushComments() {
    this.committedComments.forEach((comment) => {
      this.restService.insertNewComment(this.taskId, this.currentUserId, comment.comment_text);
    })
  }

  deleteComment(comment: Comment) {
    if (comment === undefined) return;

    if (comment.comment_id === -1) {
      this.committedComments.splice(this.committedComments.findIndex(
        com => (com.comment_id === comment.comment_id && 
          com.comment_text === comment.comment_text)
      ), 1)
    } else {
      this.restService.deleteComment(
        comment.comment_id.toString(), 
        comment.comment_text, 
        this.currentUserId);
    }

    this.commentArray.splice(this.commentArray.findIndex(
      com => (com.comment_id === comment.comment_id && 
        com.comment_text === comment.comment_text)
    ), 1)
  }

  private updateCommentArray() {
    this.behaviourSubjectCommentArray.next(this.commentArray);
  }

  getInstance() {
    return this.behaviourSubjectCommentArray;
  }
}
