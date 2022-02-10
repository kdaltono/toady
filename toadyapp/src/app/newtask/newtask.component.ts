import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestService } from '../rest.service';
import { Pond } from '../pond';
import { Pad } from '../pad';

import { SimplifiedUser } from '../simplifieduser';
import { JWTAuthService } from '../jwtauth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-newtask',
  templateUrl: './newtask.component.html',
  styleUrls: ['./newtask.component.css']
})
export class NewtaskComponent implements OnInit {

  @ViewChild('newtaskform', { static: false }) newTaskForm?: NgForm;

  users: SimplifiedUser[] = [];
  selectedUsers: SimplifiedUser[] = [];

  ponds: Pond[] = [];
  selectedPond: Pond = {} as Pond;

  pads: Pad[] = [];
  selectedPad: Pad = {} as Pad;

  constructor(
    private restService: RestService,
    private authService: JWTAuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.restService.getUsers().subscribe(users => this.users = users);
    this.loadAssignedPonds();
  }

  loadAssignedPonds(): void {
    this.restService.getUserAssignedPonds(this.authService.getCurrentUserID()).subscribe(
      ponds => {
        this.ponds = ponds;
      }
    )
  }

  loadPads(): void {
    if (this.selectedPond) {
      this.restService.getPondPadData(this.selectedPond.pond_id.toString()).subscribe(
        pads => {
          this.pads = pads;
        }
      )
    } else {
      this.pads = [];
    }
  }

  onNewTaskSubmit() {
    this.messageService.add("Beginning insert new task");
    const taskTitle = this.newTaskForm?.value.tasktitle;
    const taskDescription = this.newTaskForm?.value.taskdesc;
    const pondId = this.selectedPond.pond_id;
    const padId = this.selectedPad.pad_id;
    
    // Need to find a way to submit a new task
    this.restService.insertNewTask(taskTitle, taskDescription, 
      this.selectedUsers, padId.toString(), pondId.toString());
  }
}
