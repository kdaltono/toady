import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-new-pond',
  templateUrl: './new-pond.component.html',
  styleUrls: ['./new-pond.component.css']
})
export class NewPondComponent implements OnInit {

  @ViewChild('newpondform', { static: false }) newPondForm?: NgForm;

  constructor(
    private restService: RestService
  ) { }

  ngOnInit(): void {
  }

  onNewPondSubmit(): void {
    const pondName = this.newPondForm?.value.pondname;

    this.restService.insertNewPond(pondName);
  }

}
