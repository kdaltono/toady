import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { RestService } from '../rest.service';
import { Pond } from '../pond';
import { Pad } from '../pad';
import { ActivatedRoute } from '@angular/router';

import { SimplifiedUser } from '../simplifieduser';
import { JWTAuthService } from '../jwtauth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-newtask',
  templateUrl: './newtask.component.html',
  styleUrls: ['./newtask.component.css']
})
export class NewtaskComponent implements OnInit {

  @Input() padId!: string;
  @Input() pondId!: string;

  @ViewChild('newtaskform', { static: false }) newTaskForm?: NgForm;

  users: SimplifiedUser[] = [];
  selectedUsers: SimplifiedUser[] = [];

  pondSelect: FormControl = new FormControl();
  ponds: Pond[] = [];
  selectedPond: Pond = {} as Pond;

  padSelect: FormControl = new FormControl();
  pads: Pad[] = [];
  selectedPad: number = 0;

  isContinuous: boolean = false;

  constructor(
    private restService: RestService,
    private authService: JWTAuthService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.restService.getUsers().subscribe(users => this.users = users);

    this.loadAssignedPonds();
  }

  loadAssignedPonds(): void {
    this.restService.getUserAssignedPonds(this.authService.getCurrentUserID()).subscribe(
      ponds => {
        this.ponds = ponds;
        this.setSelectedPond();
      }
    )
  }

  setSelectedPond() {
    this.route.queryParams
      .subscribe(params => {
        if (params['pond_id']) {
          let pondId: number = params['pond_id'];
          this.selectedPond = this.ponds.filter(
            pond => {
              return pond.pond_id == pondId;
            }
          )[0];
          this.messageService.add('Selected Pond: ' + JSON.stringify(this.selectedPond));
          this.pondSelect.setValue(this.selectedPond);
          this.loadPads();
        }
      })
  }

  loadPads(): void {
    if (this.pondSelect.value.pond_id) {
      this.restService.getPondPadData(this.pondSelect.value.pond_id.toString()).subscribe(
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
    const pondId = this.pondSelect.value.pond_id;
    const padId = this.selectedPad;
    
    // Need to find a way to submit a new task
    this.restService.insertNewTask(taskTitle, taskDescription, 
      this.selectedUsers, this.isContinuous ? this.pads[0].pad_id.toString() : padId.toString(), pondId.toString(), this.isContinuous);
  }

  comparePonds(a: any, b: any): boolean {
    return a && b && a.pond_id == b.pond_id;
  }
}
