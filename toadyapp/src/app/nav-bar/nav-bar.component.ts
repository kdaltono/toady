import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(
    private sidenavService: SidenavService
  ) { }

  ngOnInit(): void {
  }

  toggleSideNav(): void {
    this.sidenavService.toggle();
  }
}
