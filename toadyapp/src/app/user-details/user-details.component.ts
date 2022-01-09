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

  displayTasks: DisplayTask[] = [];
  tasksLoaded: boolean = false;

  constructor(
    private restService: RestService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Wait 2 seconds so that db can update properly
    setTimeout(() => {
      this.setDisplayTasks();
    }, 1000);
  }

  setDisplayTasks(): void {
    const userId = localStorage.getItem('user_id');

    // This doesn't work when the user isn't logged in. It looks odd waiting and 
    // then redirecting the user
    this.restService.getDisplayTasks(userId!)
      .subscribe(tasks => {
        this.displayTasks = tasks;
        this.tasksLoaded = true;
      });
  }
}
