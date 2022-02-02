import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pond } from '../pond';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-pond',
  templateUrl: './pond.component.html',
  styleUrls: ['./pond.component.css']
})
export class PondComponent implements OnInit {

  pondId: string = '';
  pond: Pond = {} as Pond;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService
  ) { }

  ngOnInit(): void {
    this.getParameter();
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
}
