import { Component, OnInit } from '@angular/core';

import { User } from '../user';
import { RestService } from '../rest.service';
import { MessageService } from '../message.service';
import { DisplayTask } from '../displaytask';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  users: User[] = [];
  info: string = '';
  displayTasks: DisplayTask[] = [];

  constructor(
    private restService: RestService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Call the rest service, and then save them here and display them on the page
    // Also updaet user.ts to the correct values pls
    this.setDisplayTasks();
  }

  setUsers(): void {
    this.restService.getProtectedRoute()
      .subscribe(info => this.info = JSON.stringify(info));
    this.messageService.add("UserDetails: retrieved users");
  }

  setDisplayTasks(): void {
    const userId = localStorage.getItem('user_id');

    if (userId) {
      this.restService.getDisplayTasks(userId)
        .subscribe(tasks => this.displayTasks = tasks);
      this.messageService.add("UserDetails: retrieved displayt tasks");
    } else {
      this.messageService.add("UserDetails: local storage 'user_id' is not set");
    }
  }
}
