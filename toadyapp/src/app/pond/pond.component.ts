import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pond } from '../pond';
import { DisplayUser } from '../displayuser';
import { RestService } from '../rest.service';
import { FormGroup, FormControl } from '@angular/forms';
import { pairwise } from 'rxjs';
import * as _ from 'underscore';
import { MatTabGroup } from '@angular/material/tabs';
import { DisplayTask } from '../displaytask';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-pond',
  templateUrl: './pond.component.html',
  styleUrls: ['./pond.component.css']
})
export class PondComponent implements OnInit {

  pondId: string = '';
  pond: Pond = {} as Pond;
  assignedUsers: DisplayUser[] = [];
  assignableUsers: DisplayUser[] = [];
  continuousTasks: DisplayTask[] = [];

  reactiveForm: FormGroup = {} as FormGroup;
  @ViewChild("matTab", { static: false }) matTab!: MatTabGroup;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      assignedUsersControl: new FormControl({ value: [] })
    });
    this.subscribeUserChange();

    this.setValues();
  }

  subscribeUserChange() {
    const topCtrl = this.reactiveForm.get('assignedUsersControl')
    console.log(topCtrl)
    if (topCtrl) {
      topCtrl.valueChanges
        .pipe(pairwise())
        .subscribe(([prev, next]: [DisplayUser[], DisplayUser[]]) => {
          // TODO: Implement this properly
          if (prev.length > next.length) {
            // Removals
            //let removed = _.filter(prev, function(obj){ return !_.findWhere(next, obj) })
            //this.assignUsers.removeUserFromTask(removed[0].user_id, +this.taskId);
          } else {
            // Additions
            //let added = _.filter(next, function(obj){ return !_.findWhere(prev, obj) })
            //this.assignUsers.assignUserToTask(added[0].user_id, +this.taskId);
          }
      })
    }
  }

  setValues() {
    this.getParameter();
    this.getAssignedUsers();
    this.getAssignableUsers();
    this.getContinuousTasks();
  }

  getContinuousTasks(): void {
    this.restService.getContinuousTasks(this.pondId).subscribe(
      data => {
        this.continuousTasks = data;
        this.messageService.add(`Continuous Tasks: ${JSON.stringify(this.continuousTasks)}`)
      }
    )
  }

  getParameter(): void {
    this.route.params
      .subscribe(params => {
        this.pondId = params['pondid'];
        this.restService.getPondData(this.pondId).subscribe(
          data => {
            this.pond = data;
          }
        )
    })
  }

  getAssignedUsers(): void {
    this.restService.getPondAssignedUsers(this.pondId).subscribe(
      data => {
        this.assignedUsers = data;
        this.reactiveForm.get("assignedUsersControl")!.setValue(this.assignedUsers);
      }
    )
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
