import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('loginform', { static: false }) loginForm?: NgForm;

  constructor(
    private restService: RestService
  ) { }

  onRegisterSubmit(): void {
    const username = this.loginForm?.value.username;
    const firstname = this.loginForm?.value.firstname;
    const lastname = this.loginForm?.value.lastname;
    const password1 = this.loginForm?.value.password1;
    const password2 = this.loginForm?.value.password2;

    if (password1 === password2) {
      this.restService.insertNewUser(username, firstname, lastname, password1);
    } else {
      // Make the user aware that the passwords are not equal

    }
  }

  ngOnInit(): void {
  }

}
