import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DisplayTask } from 'src/app/displaytask';
import { RestService } from 'src/app/rest.service';
import { Pad } from 'src/app/pad';
import { MessageService } from 'src/app/message.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pad',
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.css']
})
export class PadComponent implements OnInit { 

  @Input() pondId!: string;
  padTasks: { pad: Pad, tasks: DisplayTask[]}[] = [];
  tabIndex: number = 0;

  constructor(
    private restService: RestService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.updateUI();
  }

  updateUI(): void {
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
}
