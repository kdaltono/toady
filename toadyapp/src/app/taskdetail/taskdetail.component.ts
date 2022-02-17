import { Component, Input, OnInit } from '@angular/core';
import { DisplayTask } from '../displaytask';

@Component({
  selector: 'task-detail',
  templateUrl: './taskdetail.component.html',
  styleUrls: ['./taskdetail.component.css']
})
export class TaskdetailComponent implements OnInit {

  @Input() task: DisplayTask = {} as DisplayTask;

  constructor() { }

  ngOnInit(): void {
  }

}
