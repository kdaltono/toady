import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from '../message.service';
import { JWTAuthService } from '../jwtauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginform', { static: false }) loginForm?: NgForm;

  constructor(
    private messageService: MessageService,
    private jwtAuthService: JWTAuthService
  ) { }

  onLoginSubmit() {
    const username = this.loginForm?.value.username;
    const password = this.loginForm?.value.password;

    this.messageService.add(`User: ${username}, Password: ${username}`)
    this.jwtAuthService.sendLoginRequest(username, password);
  }

  ngOnInit(): void {
  }
}
