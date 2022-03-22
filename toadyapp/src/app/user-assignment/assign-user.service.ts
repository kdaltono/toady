import { Injectable } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { MessageService } from 'src/app/message.service';
import { RestService } from 'src/app/rest.service';
import { UserToTask } from 'src/app/models/user_to_task';
import { UserToPond } from 'src/app/models/user_to_pond';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class AssignUserService {

  private removedTaskUsers: UserToTask[] = [];
  private addedTaskUsers: UserToTask[] = [];

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

  private getFinalArray(array1: any[], array2: any[]): any[] {
    return _.filter(array1, function(obj){ return !_.findWhere(array2, obj) })
  }

  private commitChanges() {
    if (this.addedTaskUsers.length > 0) {
      let finalAddedUsers = this.getFinalArray(this.addedTaskUsers, this.removedTaskUsers);
      this.restService.assignUsers(finalAddedUsers);
    }
    if (this.removedTaskUsers.length > 0) {
      let finalRemovedUsers = this.getFinalArray(this.removedTaskUsers, this.addedTaskUsers);
      this.restService.unassignUsers(finalRemovedUsers);
    }

    this.addedTaskUsers = [];
    this.removedTaskUsers = [];
  }

  assignUserToTask(userId: number, taskId: number): void {
    this.addedTaskUsers.push({
      user_id: userId,
      task_id: taskId
    })
    this.addedTaskUsers = _.uniq(this.addedTaskUsers);
  }

  removeUserFromTask(userId: number, taskId: number): void {
    this.removedTaskUsers.push({
      user_id: userId,
      task_id: taskId
    })
    this.removedTaskUsers = _.uniq(this.removedTaskUsers);
  }
}
