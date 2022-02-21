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

  login(user: any){ 
    return this.http.post<any>(this.URL_API + /login/, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token)
        localStorage.setItem('userId', res.user._id)
        console.log("TOKEN GUARDADO")
        this.getUserProfile(res.user._id).subscribe((res) => {
        console.log("USUARIO RECARGADO")
          this.currentUser = res;
          // this.router.navigate(['/' + res.msg._id]);
          this.router.navigate(['']);
        })
      })
  }

  
  getToken(){ 
    return localStorage.getItem('access_token');
  }

  getUserId(){ 
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean{ 
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null);
  }

  doLogout() {
    const removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      localStorage.removeItem('userId');
      this.router.navigate(['login']);
    }
  }

    
  getUserProfile(id): Observable<any>{ 
    const api = this.URL_API + "/" + id;
    return this.http.get(api,  {headers: this.headers} )
    // .pipe(
    //   map((res: Response) =>{} ),
    //   catchError(this.handleError)
    // )
  }

  handleError(error: HttpErrorResponse){ 
    var msg;
    if (error.error instanceof ErrorEvent) 
      msg = error.error.message;
    else if(error.error.code == 11000){
      // this.showNoticeToNavigate()
      msg = error
      return null
    }else
      msg = `Error Code: $error.statusnMessage: $error.message`;
    
      console.log(error)
    return throwError(error);
  }




}
