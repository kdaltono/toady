import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../rest.service';
import { Task } from '../task'

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  taskId: string = '';
  output: string = '';
  title: string = '';

  taskDetails!: Task;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService
  ) { }

  ngOnInit(): void {
    this.getParameter()
  }

  getParameter() {
    this.route.params
      .subscribe(params => {
        this.taskId = params['taskid'];
        if (this.taskId) {
          // Get the task ID from the REST API
          this.restService.getTaskFullDetails(this.taskId)
            .subscribe(data => {
              this.taskDetails = data

              this.output = JSON.stringify(this.taskDetails)
            })
        } else {
          // Display that task could not be displayed
          this.taskDetails = {
            task_id: -1,
            task_title: "Task not found",
            task_desc: `Could not find task: ${this.taskId}`
          }
        }
      })
  }

}
