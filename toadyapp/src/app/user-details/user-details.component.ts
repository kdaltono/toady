import { Component, OnInit } from '@angular/core';

import { User } from '../user';
import { RestService } from '../rest.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  users: User[] = [];
  info: string = '';

  constructor(
    private restService: RestService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Call the rest service, and then save them here and display them on the page
    // Also updaet user.ts to the correct values pls
    this.setUsers();
  }

  setUsers(): void {
    this.restService.getProtectedRoute()
      .subscribe(info => this.info = JSON.stringify(info));
    this.messageService.add("UserDetails: retrieved users");
  }

}
