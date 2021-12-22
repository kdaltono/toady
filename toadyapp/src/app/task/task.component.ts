import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { RestService } from '../rest.service';
import { Task } from '../task';
import { Comment } from '../comment';
import * as moment from 'moment';
import { JWTAuthService } from '../jwtauth.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  taskId: string = '';
  output: string = '';
  title: string = '';
  commentText: string = '';

  taskDetails!: Task;
  taskComments: Comment[] = [];

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private jwtAuthService: JWTAuthService
  ) { }

  ngOnInit(): void {
    this.getParameter()
  }

  getParameter() {
    this.route.params
      .subscribe(params => {
        this.taskId = params['taskid'];
        if (this.taskId) {
          // Get the task ID from the REST API
          this.updateUI();
        } else {
          // Display that task could not be displayed
          this.taskDetails = {
            task_id: -1,
            task_title: "Task not found",
            task_desc: `Could not find task: ${this.taskId}`
          }
        }
      })
  }

  updateUI(): void {
    this.setTaskDetails();
    this.setComments();
  }

  async setTaskDetails(): Promise<void> {
    this.restService.getTaskFullDetails(this.taskId)
      .subscribe(data => {
        this.taskDetails = data

        this.output = JSON.stringify(this.taskDetails)
    });
  }

  async setComments(): Promise<void> {
    this.taskComments = [];

    this.restService.getTaskComments(this.taskId)
      .subscribe(data => {
        for (let comment of data) {
          let dstamp: string = moment(comment.dstamp).utc().format('DD-MM-YYYY HH:mm:ss');
          this.taskComments.push({
            comment_id: comment.comment_id,
            full_name: comment.full_name,
            comment_text: comment.comment_text,
            dstamp: dstamp
          });
        }
    });
  }

  submitComment(): void {
    let userId = localStorage.getItem("user_id");

    if (userId === null) {
      this.jwtAuthService.logout();
    } else {
      this.restService.insertNewComment(this.taskId, userId, this.commentText).then(() => {
        // TODO: This needs to wait before updating comments
        this.setComments()
      })
    }
  }
}
