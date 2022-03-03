import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class JWTAuthService {

  private loginURL: string = 'http://localhost:8080/login';

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private router: Router
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
        this.router.navigate(['/home'])
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
    const expirationArr = responseObj.expiresIn.match(/[a-zA-Z]+|[0-9]+/g);
    const expiresAt = moment().add(+expirationArr[0], expirationArr[1]);
    localStorage.setItem('id_token', responseObj.token);
    localStorage.setItem('user_id', responseObj.user_id);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('full_name', responseObj.full_name);
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_id');
    localStorage.removeItem('full_name');
  }

  getFullName(): string {
    return localStorage.getItem('full_name')!
  }

  getCurrentUserID(): string {
    return localStorage.getItem('user_id')!;
  }

  public isLoggedIn(): boolean {
    // TODO: Figure out why this function is being called so much
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
