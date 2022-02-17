import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router) {
    this.registerForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
      repassword: new FormControl('', Validators.required)

    })
  }

  ngOnInit(): void {
  }

  get email() {
    return this.registerForm.get('email');
} 

  registerUser(){
    if(this.registerForm.get("password").value == "" || this.registerForm.get("repassword").value == ""){
      console.error("El PSW está vacío");
      return
    } 
    if(this.registerForm.get("password").value != this.registerForm.get("repassword").value ){
      console.error("El PSW no coincide")
      return
    }
    this.authService.register(this.registerForm.value).subscribe(
      res =>{ 
        if (res.ok){ 
          this.registerForm.reset()
          this.router.navigate(['login']);    
        }else{
          console.error("REPETIDOS")
        }
      },
      error =>{
            console.error(error)
      }
    )
  }
}
