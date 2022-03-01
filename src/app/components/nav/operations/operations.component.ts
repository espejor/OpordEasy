import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Operation } from 'src/app/models/operation';
import { OperationsService } from 'src/app/services/operations.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SvgIconsListService } from 'src/app/services/svg-icons-list.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Globals, Roles } from 'src/app/utilities/globals';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit,AfterViewInit {
  selectedOperation: Operation = new Operation();
  operations;
  timelines = [];
  user:User
  rolesMap:{
    "OWNER":"PROPIETARIO",
    "PARTNER":"AUTORIZADO",
    "VIEWER": "OBSERVADOR"
  }
  roles: any;

  constructor(
    public operationsService: OperationsService,
    private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer, 
    private _snackBar: MatSnackBar,
    private svgService: SvgIconsListService,
    private authService:AuthService,
    private userService:UserService,
    private router:Router,
    // private cdref: ChangeDetectorRef
    ) {
      iconRegistry.addSvgIcon('circle', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/circle24.svg'));
      this.getCurrentUser(authService.getUserId())
    }

  addOperation(form:NgForm){
    this.operationsService.updateOperation(this.operationsService.selectedOperation)
    .subscribe(res => {
      console.log(res);
      this.operationsService.selectedOperation = new Operation(this.svgService,res);

      this.userService.getUser(this.authService.getUserId()).subscribe((user:User) => {
        this.operationsService.updateUserOfOperation({user:user,role:"OWNER"})
        this.operationsService.updateUsersOfOpDB(null)
      })

      // this.resetForm(form);
      if(res){      
        this.getOperations();  
        this._snackBar.open('Operación guardada', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  getUserRole():string{
    const roleObj = this.operationsService.getUserRoleObj(this.user)
    if (roleObj) 
      return this.operationsService.getUserRoleObj(this.user).role
    return ""
  }

  roleTraslator(role: string): string {
    return this.rolesMap[role]
  }

  resetForm(form:NgForm){
    form.reset();
    this.operationsService.selectedOperation = new Operation();
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId()
    this.getCurrentUser(userId)
    this.getOperations(userId);
    this.rolesMap = {
      "OWNER":"PROPIETARIO",
      "PARTNER":"AUTORIZADO",
      "VIEWER": "OBSERVADOR"
    }
    
    this.roles = Roles;
  
  }

  getCurrentUser(userId) {
    this.userService.getUser(userId).subscribe((user:User) => {
      this.user = user 
    })
  }

  ngAfterViewInit():void{
    // this.user = this.authService.currentUser
  }

  openUsersManagement(){
    this.router.navigate(['usersOperations'])
  }

  selectRole(role):number{ 
    const i =  this.roles.findIndex((element) =>{
      return element.role == role
    })

    return i
  }

  getRoleColor(role:string){
    role = role == ""?"NONE":role
    return this.roles[this.selectRole(role)].color
    // return this.roleSelected.color
  }


  getOperations(userId?: string): any {
    this.operationsService.getOperations(userId)
    .subscribe(res => {
      console.log(res);
      this.operationsService.operations = this.recoverOperations(res);
      return res;
    });
  }

  deleteOperation(form:NgForm){
    const snackRef = this._snackBar.open(
      "¿Está seguro que quiere eliminar la Operación activa?",
      "Eliminar",
      {
        duration:5000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    snackRef.onAction().subscribe(() =>{
        this.operationsService.deleteOperation(this.operationsService.selectedOperation._id)
        .subscribe(result =>{
          this._snackBar.open(`Se ha eliminado Operación activa`,"",{duration:3000})
          console.log(result);
          this.resetForm(form)
          this.ngOnInit()
          // this.operationsService.operations = this.recoverOperations(result);
          return result;
        })
    })
  }

  recoverOperations(jsonOperations): Operation[] {
    const operations:Operation[] = [] 
    for(let i = 0; i < jsonOperations.length; i++){
      operations.push(new Operation(this.svgService,jsonOperations[i]))
    }
    return operations
  }

  canAccess():boolean{
    if (this.user)
      return this.user.operations.some(operation => {
        return operation.operation._id == this.operationsService.selectedOperation._id && operation.role != "VIEWER" 
      })
    return false
  }


}