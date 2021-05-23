import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Operation,Phase } from '../models/operation';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  readonly PREVIOUS = 0;
  readonly NEXT = 1;

  readonly URL_API = 'http://localhost:3000/api/operations';
  selectedOperation: Operation = new Operation();
  operations: Operation[]
  phaseOrder: number = 0;


  constructor(private http:HttpClient) { }

  previousPhase(){
    if (this.selectedOperation.phases[this.phaseOrder].name != '')
      if (this.phaseOrder == 0)
        this.addNewEmptyPhase(this.phaseOrder,this.PREVIOUS);
      else
        this.phaseOrder--;
  }

  nextPhase(){
    if (this.selectedOperation.phases[this.phaseOrder].name != '')
      if (this.phaseOrder == this.selectedOperation.phases.length - 1)
        this.addNewEmptyPhase(this.phaseOrder,this.NEXT);
      this.phaseOrder++;
  }


  public addNewEmptyPhase(index:number,direction:number){
    if (index == 0 && direction == this.PREVIOUS) 
        this.selectedOperation.phases.unshift(new Phase())
      else
        this.selectedOperation.phases.push(new Phase())
  }

  getOperations(){
    return this.http.get(this.URL_API);
  }

  addOperation(operation: Operation){
    // -------- provisional
    // operation.user = "Pepe"
    return this.http.post(this.URL_API,operation);
  }

  updateOperation(operation: Operation){
    return this.http.put(this.URL_API + `/${operation._id}`,operation);
  }

  deleteOperation(_id: string){
    return this.http.delete(this.URL_API + `/${_id}`);
  }

  getOperation(_id: string){
    return this.http.get(this.URL_API + `/${_id}`);
  }


}

