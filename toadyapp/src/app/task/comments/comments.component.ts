import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

import { RestService } from 'src/app/rest.service';
import { JWTAuthService } from 'src/app/jwtauth.service';
import { Comment } from 'src/app/comment';
import { interval } from 'rxjs';
import { CommentService } from './comment.service';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  constructor(
    private commentService: CommentService,
    private jwtAuthService: JWTAuthService,
    private messageService: MessageService
  ) { }

  @Input() taskId!: string;
  taskComments: Comment[] = [];
  commentText: string = '';
  currentUserId: string = '';

  deleteComment: boolean = false;
  selectedComment!: Comment | undefined;

  ngOnInit(): void {  
    this.messageService.add("Comments ngOnInit() called");
    this.commentService.loadTaskComments(this.taskId);
    this.commentService.getInstance().subscribe(comments => {
      this.taskComments = comments;
    });

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    this.commentService.pushComments();
  }

  submitComment() {
    // This doesn't seem like a secure way of submitting comments. Should probably go off of
    // the Bearer token's user_id somehow
    if (this.currentUserId === null) {
      this.jwtAuthService.logout();
    } else {
      this.commentService.commitComment({
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
    this.commentService.deleteComment(this.selectedComment!);
    this.deleteComment = false;
  }
}
