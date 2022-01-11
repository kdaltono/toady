import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sideNav: MatSidenav = {} as MatSidenav;

  public setSidenav(sidenav: MatSidenav) {
    this.sideNav = sidenav;
  }

  public open() {
    return this.sideNav.open();
  }

  public close() {
    return this.sideNav.close();
  }

  public toggle(): void {
    this.sideNav.toggle();
  }
}
