import { Injectable } from '@angular/core';
import { UserToPond } from '../models/user_to_pond';
import { RestService } from '../rest.service';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class AssignPondUserService {

  private removedPondUsers: UserToPond[] = [];
  private addedPondUsers: UserToPond[] = [];

  constructor(
    private restService: RestService
  ) { }

  /*private commitChanges() {
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
  }*/

  private commitChanges() {
    if (this.addedPondUsers.length > 0) {
      let finalAddedPondUsers = this.getFinalArray(this.addedPondUsers, this.removedPondUsers);
      // assignPondUsers(finalAddedPondusers)
    }
    if (this.removedPondUsers.length > 0) {
      let finalRemovedPondUsers = this.getFinalArray(this.removedPondUsers, this.addedPondUsers);
      // unassignPondUsers(finalRemovedUsers)
    }

    this.addedPondUsers = [];
    this.removedPondUsers = [];
  }

  private getFinalArray(array1: any[], array2: any[]): any[] {
    return _.filter(array1, function(obj){ return !_.findWhere(array2, obj) })
  }

  assignUserToPond(userId: number, pondId: number, account_type_id: number): void {
    this.addedPondUsers.push({
      user_id: userId,
      pond_id: pondId,
      account_type_id: account_type_id
    })
    this.addedPondUsers = _.uniq(this.addedPondUsers);
  }

  removeUserFromPond(userId: number, pondId: number, account_type_id: number): void {
    this.removedPondUsers.push({
      user_id: userId,
      pond_id: pondId,
      account_type_id: account_type_id
    })
    this.removedPondUsers = _.uniq(this.removedPondUsers);
  }
}
