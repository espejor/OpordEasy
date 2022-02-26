import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { OperationsService } from './operations.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleService implements CanActivate{

  constructor(private operationsService:OperationsService,private authService:AuthService,
  private userService:UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const operation = this.operationsService.selectedOperation
    var currentUser = this.authService.currentUser
    
    return new Observable<boolean> (observer => {
      if(currentUser){
        const operationRoled = currentUser.operations.find(op => {
          return op.operation._id == operation._id 
        })
        if (operationRoled && (operationRoled.role == "OWNER" || operationRoled.role == "PARTNER"))
          observer.next(true)
        else
          observer.next(false)
      }else{
        this.userService.getUser(this.authService.getUserId()).subscribe((user) =>{
          currentUser = user
          const operationRoled = currentUser.operations.find(op => {
            return op.operation._id == operation._id 
          })
          if (operationRoled && (operationRoled.role == "OWNER" || operationRoled.role == "PARTNER"))
            observer.next(true)
          else
            observer.next(false)
        })
      }
    })
  }
}
