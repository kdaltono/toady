import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'

import { AppComponent } from './app.component';
import { MessagesComponent } from './messages/messages.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { JWTAuthService } from './jwtauth.service';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: UserDetailsComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    UserDetailsComponent,
    LoginComponent
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
