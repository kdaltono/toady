import { Component, OnInit, Input } from '@angular/core';
import { DisplayTask } from 'src/app/displaytask';
import { RestService } from 'src/app/rest.service';
import { Pad } from 'src/app/pad';

@Component({
  selector: 'app-pad',
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.css']
})
export class PadComponent implements OnInit { 

  @Input() pondId!: string;
  padTasks: { pad: Pad, tasks: DisplayTask[]}[] = [];

  constructor(
    private restService: RestService
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
          let padTasks: DisplayTask[] = [];
          this.restService.getPadTasks(pad.pad_id.toString()).subscribe(
            tasks => {
              padTasks = tasks;
              this.padTasks.push({
                pad: pad,
                tasks: padTasks
              })
            }
          )
        })
      }
    )
    this.padTasks = this.padTasks.sort(this.padSortFunction);
  }

  padSortFunction(a: { pad: Pad, tasks: DisplayTask[] }, b: { pad: Pad, tasks: DisplayTask[] }) {
    if (a.pad.order_value < b.pad.order_value) {
      return -1;
    }
    if (a.pad.order_value > b.pad.order_value) {
      return 1;
    }
    return 0;
  }
}
