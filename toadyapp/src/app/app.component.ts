import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { JWTAuthService } from './jwtauth.service';
import { SidenavService } from './sidenav.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidenav') public sidenav: MatSidenav = {} as MatSidenav;
  title = 'toadyapp';

  constructor(
    private sidenavService: SidenavService,
    private jwtAuthService: JWTAuthService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  logout(): void {
    this.jwtAuthService.logout();
    this.router.navigate(['/login']);
  }
}
