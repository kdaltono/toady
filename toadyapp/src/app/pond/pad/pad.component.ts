import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pad',
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.css']
})
export class PadComponent implements OnInit { 

  @Input() pondId!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
