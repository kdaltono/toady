import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../rest.service';
import { Task } from '../task';
import { TaskStatus } from '../task_status';
import { DisplayUser } from '../displayuser';
import { MessageService } from '../message.service';
import { SimplifiedUser } from '../simplifieduser';
import { FormControl } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  taskId: string = '';
  output: string = '';
  title: string = '';

  taskDetails!: Task;
  taskStatuses: TaskStatus[] = [];
  selectedStatus: TaskStatus = {} as TaskStatus;
  originalStatusId: number = -1;
  assignedUsers: DisplayUser[] = [];
  assignableUsers: DisplayUser[] = [];
  formControl = new FormControl([]);

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getParameter();
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

  setAssignedUsers() {
    this.restService.getAssignedUsersForTask(this.taskId)
      .subscribe(data => {
        this.assignedUsers = data;
        this.formControl.setValue(this.assignedUsers);
        this.messageService.add("Assigned users: " + JSON.stringify(data));
      })
  }

  getAssignableUsers() {
    this.restService.getUsers().subscribe(data => {
      this.assignableUsers = data
      this.messageService.add("Assignable users: " + JSON.stringify(data));
    });
  }

  remove(user_id: number): void { 
    this.assignedUsers = this.assignedUsers.filter(user => 
      user.user_id !== user_id
    );
    this.formControl.setValue(this.assignedUsers);
    // TODO: Update the database with this
  }
}
