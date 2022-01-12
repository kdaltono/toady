import { Component, OnInit } from '@angular/core';
import { JWTAuthService } from '../jwtauth.service';
import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(
    private sidenavService: SidenavService,
    private jwtAuthService: JWTAuthService
  ) { }

  ngOnInit(): void {
  }

  toggleSideNav(): void {
    this.sidenavService.toggle();
  }

  isLoggedIn(): boolean {
    return this.jwtAuthService.isLoggedIn();
  }
}
