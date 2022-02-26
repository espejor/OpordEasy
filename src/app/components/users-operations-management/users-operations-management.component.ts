import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Operation } from 'src/app/models/operation';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { OperationsService } from 'src/app/services/operations.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/utilities/globals';

@Component({
  selector: 'app-users-operations-management',
  templateUrl: './users-operations-management.component.html',
  styleUrls: ['./users-operations-management.component.css']
})
export class UsersOperationsManagementComponent implements OnInit {
  users: User[] = [];
  operations: Operation[];
  usersOfOperation: {user:User,role:string} [] = [];
  // roleSelected
  
  roles = Globals.roles
  operation: Operation;


  constructor(
    private userService:UserService,
    private operationsService:OperationsService, 
    private authService:AuthService,
    private _snackBar: MatSnackBar,
    private operationService:OperationsService) { }

  ngOnInit(): void {
    this.operation = this.operationService.selectedOperation

    if(this.operation.name != "")
      this.userService.getUsers().subscribe( users  =>{
        this.users = <User[]>users
        this.setRolesForOperation()
      })
    
    
    // const user = this.authService.getUserId()
    // this.operationsService.getOperations(user).subscribe( operations  =>{
    //   this.operations = <Operation[]>operations
    // })

    // if(operation._id)
    //   this.operationService.getOperation(operation._id).subscribe((operation:any) =>{
    //     this.usersOfOperation = operation.users
    //   })
  }

  setRolesForOperation() {
    this.users.forEach(user => {
      this.usersOfOperation.push({user:user,role:this.getRoleForOperation(user)})
    })
  }

  getRoleForOperation(user:User): string {
    const opId = this.operationService.selectedOperation._id
    const i = user.operations.findIndex((op:{operation:Operation,role:string}) => {
      return op.operation._id == opId
    })
    if(i > -1)
      return user.operations[i].role
    else
      return "NONE"
  }


  changeRole(user){  
    if (user.role == "OWNER"){
      this._snackBar.open(
        "No se puede modificar el propietario de una operación",
        "Cerrar",
        {duration : 3000}
      )
      return
    }
    var i = this.selectRole(user.role) 
    const index = i == this.roles.length -1? 1 :i + 1
    user.role = this.roles[index].role
    // user.role = this.roleSelected.role
  }

  selectRole(role):number{ 
    const i =  this.roles.findIndex((element) =>{
      return element.role == role
    })

    return i
  }

  getRoleColor(role:string){
    return this.roles[this.selectRole(role)].color
    // return this.roleSelected.color
  }

  update(){
    if(this.usersOfOperation.length > 0){
      this.usersOfOperation.forEach(userObj => {
        this.operationService.updateUserOfOperation(userObj)
      })
      this.operationsService.updateUsersOfOpDB(this.usersOfOperation)
    }
  }
}
