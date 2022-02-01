import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../rest.service';
import { Task } from '../task';
import { TaskStatus } from '../task_status';
import { DisplayUser } from '../displayuser';
import { MessageService } from '../message.service';
import { FormControl, FormGroup } from '@angular/forms';
import { pairwise } from 'rxjs';
import * as _ from 'underscore';
import { AssignUserService } from './assignuser/assign-user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  hasAssignedUsers: boolean = false;
  hasAssignableUsers: boolean = false;
  taskId: string = '';
  output: string = '';
  title: string = '';

  taskDetails!: Task;
  taskStatuses: TaskStatus[] = [];
  selectedStatus: TaskStatus = {} as TaskStatus;
  originalStatusId: number = -1;
  assignedUsers: DisplayUser[] = [];
  assignableUsers: DisplayUser[] = [];
  reactiveForm: FormGroup = {} as FormGroup;
  difference: string = ''

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private messageService: MessageService,
    private assignUsers: AssignUserService
  ) { }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      assignedUsersControl: new FormControl({ value: [] })
    });
    this.subscribeUserChange();

    this.getParameter();
  }

  subscribeUserChange() {
    const topCtrl = this.reactiveForm.get('assignedUsersControl')
    console.log(topCtrl)
    if (topCtrl) {
      topCtrl.valueChanges
        .pipe(pairwise())
        .subscribe(([prev, next]: [DisplayUser[], DisplayUser[]]) => {
          if (prev.length > next.length) {
            // Removals
            let removed = _.filter(prev, function(obj){ return !_.findWhere(next, obj) })
            this.assignUsers.removeUserFromTask(removed[0].user_id, +this.taskId);
          } else {
            // Additions
            let added = _.filter(next, function(obj){ return !_.findWhere(prev, obj) })
            this.assignUsers.assignUserToTask(added[0].user_id, +this.taskId);
          }
      })
    }
  }

  ngOnDestroy(): void {
    // When the component is unloaded, update the status
    if (this.originalStatusId !== this.selectedStatus.status_id) {
      this.restService.updateTaskStatus(this.taskId, 
        this.selectedStatus.status_id.toString());
    }
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
            task_desc: `Could not find task: ${this.taskId}`,
            status_id: -1,
            status_text: "Unknown"
          }
        }
      })
  }

  updateUI(): void {
    this.setTaskDetails();
    this.setTaskStatusSelect();
    this.setAssignedUsers();
    this.getAssignableUsers();
  }

  setTaskDetails() {
    this.restService.getTaskFullDetails(this.taskId)
      .subscribe(data => {
        this.taskDetails = data

        this.selectedStatus = {
          status_id: this.taskDetails.status_id,
          status_text: this.taskDetails.status_text
        }
        this.originalStatusId = this.taskDetails.status_id;
    });
  }

  setTaskStatusSelect() {
    this.restService.getTaskStatus()
      .subscribe(data => {
        this.taskStatuses = data
      })
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.user_id === c2.user_id : c1 === c2;
  }

  setAssignedUsers() {
    this.restService.getAssignedUsersForTask(this.taskId)
      .subscribe(data => {
        this.assignedUsers = data;
        this.reactiveForm.get("assignedUsersControl")!.setValue(this.assignedUsers);
      })
  }

  getAssignableUsers() {
    this.restService.getUsers().subscribe(data => {
      this.assignableUsers = data
    });
  }

  getCanAssignUsers(): boolean {
    return this.hasAssignableUsers && this.hasAssignedUsers;
  }
}
