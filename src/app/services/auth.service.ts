import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  URL_BASE = environment.baseUrl;
  URL_API = this.URL_BASE + 'api/users'; 
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = null;
  private _snackBar: any;

  constructor(private http: HttpClient, public router: Router) {}

  register(user: User): Observable<any>{ 
    const api = this.URL_API + /register/;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      )
  }

  login(user: User){ 
    return this.http.post<any>(this.URL_API + /login/, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token)
        this.getUserProfile(res._id).subscribe((res) => {
          this.currentUser = res;
          this.router.navigate(['/' + res.msg._id]);
        })
      })
  }

  
  getToken(){ 
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean{ 
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null);
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) 
      this.router.navigate(['login']);
  }

    
  getUserProfile(id): Observable<any>{ 
    let api = this.URL_API + "/id";
    return this.http.get(api,  {headers: this.headers} )
    .pipe(
      map((res: Response) =>{} ),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse){ 
    var msg;
    if (error.error instanceof ErrorEvent) 
      msg = error.error.message;
    else if(error.error.code == 11000){
      this.showNoticeToNavigate()
      // msg = error
      return null
    }else
      msg = `Error Code: $error.statusnMessage: $error.message`;
    
      console.log(error)
    return throwError(msg);
  }
  
  showNoticeToNavigate() {
    const snackRef = this._snackBar.open(
      "Ya existe registrado un usuario con ese correo electrónico. ¿Desea hacer un LOGIN?",
      "Ir a LOGIN",
      {
        duration:5000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    snackRef.onAction().subscribe(() =>{
      this.router.navigate(['login']);    
    })
  }



}
