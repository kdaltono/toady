import { Injectable } from '@angular/core';
import { Pond } from '../models/pond';
import { DisplayTask } from '../models/displaytask';
import { DisplayUser } from '../models/displayuser';
import { RestService } from '../rest.service';

@Injectable({
  providedIn: 'root'
})
export class PondService {

  pondId!: string;
  pond: Pond = {} as Pond;
  assignedUsers: DisplayUser[] = [];
  assignableUsers: DisplayUser[] = [];
  continuousTasks: DisplayTask[] = [];
  // TODO: Have an object here that shows what the users permissions are

  constructor(
    private restService: RestService
  ) { }

  updatePondData(pondId: string) {
    this.pondId = pondId;
    this.emptyArrays();

    this.setArrays();
  }

  emptyArrays(): void {
    this.pond = {} as Pond;
    this.assignedUsers = [];
    this.assignableUsers = [];
    this.continuousTasks = [];
  }

  setArrays(): void {
    this.setContinuousTasks();
    this.setAssignedUsers();
    this.setAssignableUsers();
  }

  setContinuousTasks(): void {
    this.restService.getContinuousTasks(this.pondId).subscribe(
      data => {
        this.continuousTasks = data;
      }
    )
  }

  setAssignedUsers(): void {
    this.restService.getPondAssignedUsers(this.pondId).subscribe(
      data => {
        this.assignedUsers = data;
      }
    )
  }

  setAssignableUsers() {
    this.restService.getUsers().subscribe(data => {
      this.assignableUsers = data
    });
  }
}
