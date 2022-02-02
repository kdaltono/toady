import { Component, OnInit } from '@angular/core';
import { JWTAuthService } from '../jwtauth.service';
import { MessageService } from '../message.service';
import { Pond } from '../pond';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-pond-list',
  templateUrl: './pond-list.component.html',
  styleUrls: ['./pond-list.component.css']
})
export class PondListComponent implements OnInit {

  ponds: Pond[] = [];

  constructor(
    private restService: RestService,
    private jwtAuthService: JWTAuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAssignedPondList()
  }

  getAssignedPondList(): void {
    this.restService.getUserAssignedPonds(this.jwtAuthService.getCurrentUserID()).subscribe(
      data => {
        this.ponds = data;
        this.messageService.add("Ponds fetched: " + JSON.stringify(this.ponds));
      }
    )
  }
}
