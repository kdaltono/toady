import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule, Router } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { MessagesComponent } from './messages/messages.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { JWTAuthService } from './jwtauth.service';
import { TaskComponent } from './task/task.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: UserDetailsComponent },
  { path: 'task/:taskid', component: TaskComponent },
  { path: '', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' }
]

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    UserDetailsComponent,
    LoginComponent,
    TaskComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    JWTAuthService, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    private jwtAuthService: JWTAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Delete the locally stored token information so that it won't send repeated
    // Unauthorised requests
    if (!this.jwtAuthService.isLoggedIn()) {
      this.jwtAuthService.logout();
      this.router.navigate(['/login']);
    }
  }
}
