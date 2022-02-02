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
import { NewtaskComponent } from './newtask/newtask.component';
import { CommentsComponent } from './task/comments/comments.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/modules/material/material.module';
import { RestService } from './rest.service';
import { TextareaAutoresizeDirective } from './textarea-autoresize.directive';
import { RegisterComponent } from './register/register.component';
import { SidenavService } from './sidenav.service';
import { PondComponent } from './pond/pond.component';
import { PondListComponent } from './pond-list/pond-list.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: UserDetailsComponent },
  { path: 'task/:taskid', component: TaskComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add', component: NewtaskComponent },
  { path: 'pond/:pondid', component: PondComponent },
  { path: 'pondlist', component: PondListComponent },
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
    NavBarComponent,
    NewtaskComponent,
    CommentsComponent,
    TextareaAutoresizeDirective,
    RegisterComponent,
    PondComponent,
    PondListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    JWTAuthService, 
    RestService,
    SidenavService,
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
