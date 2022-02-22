import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Operation } from 'src/app/models/operation';
import { AuthService } from 'src/app/services/auth.service';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  registerForm: FormGroup;
  registerFormData = [
      {type:"text", formControlName:"firstName", placeHolder:"Nombre", required:"required"},
      {type:"text", formControlName:"lastName", placeHolder:"Apellidos", required:"required"},
      {type:"text", formControlName:"userName", placeHolder:"Usuario", required:"required"},
      {type:"email", formControlName:"email", placeHolder:"Email", required:"required"},
      {type:"password", formControlName:"password", placeHolder:"Password", required:"required"},
      {type:"password", formControlName:"repassword", placeHolder:"Repeat the password", required:"required"}  
    ]

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private _snackBar: MatSnackBar,
    private operationService:OperationsService) {
    this.registerForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
      repassword: new FormControl('', Validators.required)
    })

    if(this.isLoggedIn())
      this.fillData()
  }

  fillData() {
    const userId = this.authService.getUserId()
    if (userId){
      this.authService.getUserProfile(userId).subscribe(user => {
        if (user)
          this.registerForm.setValue({
            firstName:user.firstName,
            lastName:user.lastName,
            userName:user.userName,
            email:user.email,
            password:"",
            repassword:""
          })
        // this.registerFormData.forEach(field => {
        //   const key = field.formControlName
        //   const value = user[key]
        //   this.registerForm.patchValue({value:{key:value}})
        // })
      })
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  get email() {
    return this.registerForm.get('email');
  } 

  getValue(field:string){
    return this.registerForm.get(field)
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
        this.showNoticeToNavigate()
          console.error(error.error.err.errors.email.message)
      }
    )
  }

  login(){
      this.router.navigate(['login']);
  }

  logout(){
      this.operationService.selectedOperation = new Operation()
      this.operationService.updateLayout()
      this.authService.doLogout();
  }

  isLoggedIn():boolean{
    return this.authService.isLoggedIn()
  }
    
  showNoticeToNavigate() {
    const snackRef = this._snackBar.open(
      "Ya existe registrado un usuario con ese correo electrónico. ¿Desea hacer un LOGIN?",
      "Ir a LOGIN",
      {
        // duration:5000,
        panelClass: ['warning']
      });
    snackRef.onAction().subscribe(() =>{
      this.router.navigate(['login']);    
    })
  }
}
