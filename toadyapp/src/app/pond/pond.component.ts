import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PadComponent } from './pad/pad.component';
import { PondService } from './pond.service';

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
  @ViewChild('pad') padComponent!: PadComponent;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private messageService: MessageService,
    public pondService: PondService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      assignedUsersControl: new FormControl({ value: [] })
    });
    this.subscribeUserChange();
    this.getParameter();

    this.pondService.updatePondData(this.pondId);
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

  openPadUpdateDialog(): void {
    const dialogRef = this.dialog.open(PadDialog, {
      width: '250px',
      data: ''
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messageService.add("Attempted to add pad: " + result);
        this.restService.insertNewPad(this.pondId.toString(), result);
        this.padComponent.updateUI();
      }
    })
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.user_id === c2.user_id : c1 === c2;
  }
}

@Component({
  selector: 'pad-update-dialog',
  templateUrl: 'pad-update-dialog.component.html'
})
export class PadDialog {
  constructor(
    public dialogRef: MatDialogRef<PadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
