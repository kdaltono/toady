import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

import { RestService } from 'src/app/rest.service';
import { JWTAuthService } from 'src/app/jwtauth.service';
import { Comment } from 'src/app/comment';

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

  ngOnInit(): void {
    this.currentUserId = this.jwtAuthService.getCurrentUserID();
    this.setComments();
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
    });
  }

  submitComment() {
    // This doesn't seem like a secure way of submitting comments. Should probably go off of
    // the Bearer token somehow
    if (this.currentUserId === null) {
      this.jwtAuthService.logout();
    } else {
      this.restService.insertNewComment(this.taskId, this.currentUserId, this.commentText);

      // Add fake comment, this will be removed and the real one loaded from server if 
      // the page is refreshed
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
}
