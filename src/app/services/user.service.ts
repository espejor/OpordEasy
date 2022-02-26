import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Operation } from '../models/operation';
import { User } from '../models/user';
import { OpsRoles } from '../utilities/globals';
import { OperationsService } from './operations.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL_API: string;


  constructor(public http:HttpClient,
    // public operationService:OperationsService
    ) {
    const URL_BASE = environment.baseUrl;
    this.URL_API = URL_BASE + 'api/users'; 
  }

  getUsers(){
    return this.http.get(this.URL_API);
  }


  addUser(user: User){
    // -------- provisional
    // user.user = "Pepe"
    return this.http.post(this.URL_API,user);
  }

  updateUser(user: User){
    return this.http.put(this.URL_API + `/${user._id}`,user)
  }

  // addOperationOfUser(userId:string,opId:string):User{
  //   const obj:any = {operation:opId,role:OpsRoles.OWNER}
  //   this.getUser(userId).subscribe((user:User) => {
  //     user.operations.push(obj)
  //   })
  //   // const isAdded = this.selectedOperation.users.some((user:any) => {
  //   //   return user._id == userId
  //   // })
  //   // if(!isAdded)
  
  // }

  updateOperationOfUser(operationService:OperationsService,user: User, operationObj: {operation: Operation, role: string}, propagate: boolean = true) {    
    // Actualizamos un usuario de la operación
      var opRole = this.getOpRoleObj(operationObj,user)
      if(opRole)
        // quitamos el elemento
        user.operations = user.operations.filter(op => {
          return op.operation._id !== operationObj.operation._id
        })
        // Si el valor asignado es != NONE
      if (operationObj.role != "NONE"){
        user.operations.push({operation:operationObj.operation,role:operationObj.role})

      }// Si propagate, pedimos la actualización del usuario
      if (propagate){
        operationService.updateUserOfOperation({user:user,role:operationObj.role},operationObj.operation,false)
      }
  }
  
  getOpRoleObj(opObj:{operation: Operation, role: string},user:User) {
    const i = user.operations.findIndex(operation => {
      return opObj.operation._id == operation.operation._id
    })
    return user.operations[i]
  }

  
  updateOperationsOfUsersDB(operationService:OperationsService,user: User, propagate: boolean = true) {
    // Actualizamos la BD
    const minOps = this.minimizeOperations(user.operations)
    this.http.put(this.URL_API + `/operations/${user._id}`,
    {
      // "entities" : this.selectedOperation.phases[this.phaseOrder].timelines[this.timelineActive].entities,
      "action": "updateOperationsDB",
      "operations":minOps,
    }
    ).subscribe((data) => {
      console.log(data);
      if (propagate)
        user.operations.forEach(operation => {
          operationService.updateUsersOfOpDB(null,operation.operation,false)
        })
    })
  }
  
  minimizeOperations(operations: {operation:Operation | string,role:string}[]): {operation:string,role:string}[] {
    const minOps: {operation:string,role:string}[] = []
    operations.forEach(operation => {
      if(operation.role != "NONE"){
        if(typeof operation.operation !== "string")
          minOps.push({operation:(<Operation>operation.operation)._id.toString(),role:operation.role})
        else
          minOps.push({operation:operation.operation,role:operation.role})
      }
    })
    return minOps
  }

  deleteUser(_id: string){
    return this.http.delete(this.URL_API + `/${_id}`).subscribe((data) => {
      console.log(data);
    })
  }

  getUser(_id: string){
    return this.http.get(this.URL_API + `/${_id}`);
  }
}
