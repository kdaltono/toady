import { Injectable } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { MessageService } from 'src/app/message.service';
import { RestService } from 'src/app/rest.service';
import { UserToTask } from 'src/app/user_to_task';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class AssignUserService {

  private removedUsers: UserToTask[] = [];
  private addedUsers: UserToTask[] = [];

  private delay: number = 5000;
  private timer: Subscription = {} as Subscription;

  constructor(
    private restService: RestService,
  ) { 
    this.timer = interval(this.delay)
      .subscribe(() => {
        this.commitChanges()
      }
    )
  }

  private commitChanges() {
    if (this.addedUsers.length == 0 && this.removedUsers.length == 0) {
      return;
    }

    let listAddedUsers = this.addedUsers;
    let listRemovedUsers = this.removedUsers;
    let finalRemovedUsers = _.filter(listRemovedUsers, function(obj){ return !_.findWhere(listAddedUsers, obj) });
    let finalAddedUsers = _.filter(listAddedUsers, function(obj){ return !_.findWhere(listRemovedUsers, obj) });

    // Add users and clear the array
    if (finalAddedUsers.length > 0) {
      this.restService.assignUsers(finalAddedUsers);  
    }
    if (finalRemovedUsers.length > 0) {
      this.restService.unassignUsers(finalRemovedUsers);
    }
    this.addedUsers = [];
    this.removedUsers = [];
  }

  assignUserToTask(userId: number, taskId: number): void {
    this.addedUsers.push({
      user_id: userId,
      task_id: taskId
    })
    this.addedUsers = _.uniq(this.addedUsers);
  }

  removeUserFromTask(userId: number, taskId: number): void {
    this.removedUsers.push({
      user_id: userId,
      task_id: taskId
    })
    this.removedUsers = _.uniq(this.removedUsers);
  }
}
