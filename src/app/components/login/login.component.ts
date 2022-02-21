import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(public authService: AuthService) {}

  login() {
    console.log(this.email);
    console.log(this.password);
    this.authService.login({email:this.email,password:this.password})
  }

  isLoggedIn(){
    return this.authService.isLoggedIn()
  }

  ngOnInit(): void {
    console.log("--------------LOGIN")
  }

}
