import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';
import { MessageService } from './message.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class JWTAuthService {

  private loginURL: string = 'http://localhost:8080/login';

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  sendLoginRequest(username: string, password: string) {
    this.logout();
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const reqObject = {
      username: username,
      password: password
    };

    this.http.post(this.loginURL, reqObject, { headers: headers }).subscribe(
      (response) => {
        this.setLocalStorage(response);
        // Get all of the user details based on this user
      },

      (error) => {
        this.messageService.add(JSON.stringify(error))
      },

      () => {
        this.messageService.add('Login attempt complete!')
      }
    )
  }

  setLocalStorage(responseObj: any) {
    const expiresAt = moment().add(responseObj.expiresIn);
    localStorage.setItem('id_token', responseObj.token);
    localStorage.setItem('user_id', responseObj.user_id);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_id');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration: any = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
