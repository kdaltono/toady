import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { pairwise } from 'rxjs';
import { DisplayUser } from '../displayuser';
import * as _ from 'underscore';
import { AssignUserService } from './assign-user.service';
import { RestService } from '../rest.service';

@Component({
  selector: 'user-assignment',
  templateUrl: './user-assignment.component.html',
  styleUrls: ['./user-assignment.component.css']
})
export class UserAssignmentComponent implements OnInit {

  @Input() taskId!: string;

  reactiveForm: FormGroup = {} as FormGroup;
  assignedUsers: DisplayUser[] = [];
  assignableUsers: DisplayUser[] = [];

  constructor(
    private assignUsers: AssignUserService,
    private restService: RestService
  ) { }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      assignedUsersControl: new FormControl({ value: [] })
    });

    this.subscribeUserChange();
    this.updateUI();
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

  updateUI(): void {
    this.setAssignedUsers();
    this.getAssignableUsers();
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

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.user_id === c2.user_id : c1 === c2;
  }
}
