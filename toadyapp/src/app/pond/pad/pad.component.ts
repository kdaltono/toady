import { Component, OnInit, Input, ViewEncapsulation, Inject } from '@angular/core';
import { DisplayTask } from 'src/app/displaytask';
import { RestService } from 'src/app/rest.service';
import { Pad } from 'src/app/pad';
import { MessageService } from 'src/app/message.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JWTAuthService } from 'src/app/jwtauth.service';

@Component({
  selector: 'app-pad',
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.css']
})
export class PadComponent implements OnInit { 

  @Input() pondId!: string;
  padTasks: { pad: Pad, tasks: DisplayTask[]}[] = [];
  tabIndex: number = 0;
  padsLoaded: boolean = false;

  constructor(
    private restService: RestService,
    public jwtAuthService: JWTAuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.updateUI();
  }

  updateUI(): void {
    this.padsLoaded = false;
    this.padTasks = [];

    setTimeout(() => {
      this.populatePadData();
      this.padsLoaded = true;
    }, 1000);
  }

  populatePadData(): void {
    // TODO: This shouldn't just load all of the tasks, it should really only load
    // the ones that you view
    let pads: Pad[] = []
    this.restService.getPondPadData(this.pondId).subscribe(
      data => {
        pads = data;
        pads.forEach(pad => {
          pad.activeTime = new FormGroup({
            start: new FormControl(pad.start_dstamp),
            end: new FormControl(pad.end_dstamp)
          });

          this.restService.getPadTasks(pad.pad_id.toString()).subscribe(
            tasks => {
              this.padTasks.push({
                pad: pad,
                tasks: tasks
              })
              this.padTasks = this.padTasks.sort(this.padSortFunction);
            }
          )
        })
      }
    )
  }

  // TODO: This doesnt sort properly, sometimes it works and sometimes it doesn't
  padSortFunction(a: { pad: Pad, tasks: DisplayTask[] }, b: { pad: Pad, tasks: DisplayTask[] }) {
    if (a.pad.order_value < b.pad.order_value) {
      return -1;
    }
    if (a.pad.order_value > b.pad.order_value) {
      return 1;
    }
    return 0;
  }

  updatePad(pad: Pad): void {
    // TODO: Find a way to stop this function being called if the date has already been updated
    if (pad.pad_is_complete) {
      this.restService.updatePadReviewText(pad.pad_id.toString(), pad.review_text)
    } else {
      // This would instead update all of the details like due date etc...
      let startDate: Date = pad.activeTime.get('start')?.value;
      let insertStartDate = `${startDate.getUTCFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`

      let endDate: Date = pad.activeTime.get('end')?.value;
      let insertEndDate = `${endDate.getUTCFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`

      this.restService.updatePadStartAndEndDates(insertStartDate, insertEndDate, pad.pad_id.toString())
    }
  }

  deletePad(pad: Pad): void {
    if (confirm('Are you sure you want to delete this pad?')) {
      this.restService.deletePad(pad.pad_id.toString())
      this.updateUI();
    }
  }

  drop(event: CdkDragDrop<any>) {
    // TODO: Maybe this should be a service like the comments and task statuses
    moveItemInArray(this.padTasks, event.previousIndex, event.currentIndex);
    this.padTasks[event.previousIndex].pad.order_value = event.previousIndex;
    this.padTasks[event.currentIndex].pad.order_value = event.currentIndex;

    let min = Math.min(event.previousIndex, event.currentIndex);
    let max = Math.max(event.previousIndex, event.currentIndex);

    var padOrderValues: { pad_id: number, order_value: number }[] = [];

    for (var i = min; i <= max; i++) {
      this.padTasks[i].pad.order_value = i + 1;
      padOrderValues.push({pad_id: this.padTasks[i].pad.pad_id, order_value: i + 1});
    }

    this.restService.updatePadOrderValues(padOrderValues);
  }
}