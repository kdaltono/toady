import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'underscore';
import { pairwise } from 'rxjs';
import { MessageService } from '../message.service';
import { DisplayUser } from '../models/displayuser';
import { PondAssignedUser } from '../models/pond_assigned_user';
import { SimpleAccountType } from '../models/simple_account_type';
import { RestService } from '../rest.service';
import { PondService } from '../pond/pond.service';

@Component({
  selector: 'pond-assignment',
  templateUrl: './pond-assignment.component.html',
  styleUrls: ['./pond-assignment.component.css']
})
export class PondAssignmentComponent implements OnInit {

  @Input() pondId!: string;
  pondAssignedUsers: PondAssignedUser[] = [];

  accountTypeToAssignedUsers: { 
    reactiveForm: FormGroup,
    account_type: SimpleAccountType, 
    assigned_users: DisplayUser[] 
  }[] = [];

  // Get all currently unassigned users
  // Get all assigned users
  // Whenever a user is assigned, remove it from unassigned users
  // Whenever a user is unassigned, add it to unassigned users

  constructor(
    private restService: RestService,
    private messageService: MessageService,
    public pondService: PondService
  ) { }

  ngOnInit(): void {
    this.getAssignedUsers();
  }

  getAssignedUsers(): void {
    this.restService.getPondAssignedUsers(this.pondId).subscribe(
      data => {
        this.organisePondAssignedUsers(data)
      }
    )
  }

  private organisePondAssignedUsers(pondAssignedUsers: PondAssignedUser[]) {
    pondAssignedUsers.forEach(
      pondAssignedUser => {
        var accountType: SimpleAccountType = {
          account_type_id: pondAssignedUser.account_type_id,
          display_name: pondAssignedUser.display_name
        }

        var user: DisplayUser = {
          user_id: pondAssignedUser.user_id,
          username: pondAssignedUser.username,
          first_name: pondAssignedUser.first_name,
          last_name: pondAssignedUser.last_name,
          full_name: pondAssignedUser.full_name
        }

        if(!_.any(this.accountTypeToAssignedUsers, function(item) { return _.isEqual(item.account_type, accountType) })) {
          const accountTypeAndUsers = {
            reactiveForm: new FormGroup({
              assignedUsersControl: new FormControl({ value: [] })
            }),
            account_type: accountType,
            assigned_users: []
          };
          this.accountTypeToAssignedUsers.push(accountTypeAndUsers);
          this.subscribeUserChange(accountTypeAndUsers.reactiveForm);
        } 
        this.insertAssignedUserToArray(accountType, user);
      }
    )
  }

  insertAssignedUserToArray(accountType: SimpleAccountType, user: DisplayUser): void {
    const accountTypeAndUsers = _.find(this.accountTypeToAssignedUsers, function(item) {
      return _.isEqual(item.account_type, accountType);
    });

    accountTypeAndUsers?.assigned_users.push(user)
    accountTypeAndUsers?.reactiveForm.get("assignedUsersControl")!.setValue(accountTypeAndUsers.assigned_users);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.user_id === c2.user_id : c1 === c2;
  }

  subscribeUserChange(reactiveForm: FormGroup) {
    const topCtrl = reactiveForm.get('assignedUsersControl')
    console.log(topCtrl)
    if (topCtrl) {
      topCtrl.valueChanges
        .pipe(pairwise())
        .subscribe(([prev, next]: [DisplayUser[], DisplayUser[]]) => {
          if (prev.length > next.length) {
            // Removals
            let removed = _.filter(prev, function(obj){ return !_.findWhere(next, obj) })
            //this.assignUsers.removeUserFromTask(removed[0].user_id, +this.taskId);
          } else {
            // Additions
            let added = _.filter(next, function(obj){ return !_.findWhere(prev, obj) })
            //this.assignUsers.assignUserToTask(added[0].user_id, +this.taskId);
          }
      })
    }
  }
}
