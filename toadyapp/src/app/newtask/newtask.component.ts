import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestService } from '../rest.service';

import { SimplifiedUser } from '../simplifieduser';

@Component({
  selector: 'app-newtask',
  templateUrl: './newtask.component.html',
  styleUrls: ['./newtask.component.css']
})
export class NewtaskComponent implements OnInit {

  @ViewChild('newtaskform', { static: false }) newTaskForm?: NgForm;

  users: SimplifiedUser[] = [];
  selectedUsers: SimplifiedUser[] = [];

  constructor(
    private restService: RestService
  ) { }

  ngOnInit(): void {
    this.restService.getUsers().subscribe(users => this.users = users);
  }

  onNewTaskSubmit(): void {
    const taskTitle = this.newTaskForm?.value.taskTitle;
    const taskDescription = this.newTaskForm?.value.taskDesc;
    
    // Need to find a way to submit a new task
  }

}
