import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { EntityLocated, Operation,Phase, Timeline } from '../models/operation';
import Geometry from 'ol/geom/Geometry';
import { Entity, EntityOptions } from '../entities/entity.class';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntitiesDeployedService } from './entities-deployed.service';
import { SVGUnitsIconsListService } from './svg-units-icons-list.service';
import { EntitySelector } from '../entities/factory-entity-selector';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  readonly PREVIOUS = 0;
  readonly NEXT = 1;
  
  activatedOperations:boolean = false;
  selectedOperation: Operation = new Operation();
  operations: Operation[]
  phaseOrder: number = 0;
  timelineActive = 0;
  URL_API: string;

  // layout: Entity[] = []

  constructor(private http:HttpClient, 
    private _snackBar: MatSnackBar, 
    private  entitiesDeployed:EntitiesDeployedService,
    private svgService: SVGUnitsIconsListService) {    
    const URL_BASE = environment.baseUrl;
    this.URL_API = URL_BASE + '/api/operations'; 
  }

  isOperationLoaded():boolean {
    return this.selectedOperation._id != undefined;
  }

  loadUnit(unit: Entity<Geometry>):boolean {
    if(this.isOperationLoaded()){
      this.addEntityToLayout(unit);
      return true;
    }else{
      const snackRef = this._snackBar.open(
        'No es posible cargar una Unidad sin antes haber cargado una OPERACIÓN',
        'Abrir Operación', {
        duration: 5000,
        verticalPosition: "top",
        panelClass: ['style-error']
      });
      snackRef.onAction().subscribe(() => {
        this.activatedOperations = true;   
      })
      return false;     
    }
  }

  addEntityToTimeline(entity: Entity<Geometry>) {
    // const id = entity._id;
    if(this.selectedOperation.phases[this.phaseOrder].timelines.length == 0)
      this.selectedOperation.phases[this.phaseOrder].timelines.push(new Timeline())
    this.selectedOperation.phases[this.phaseOrder].timelines[this.timelineActive].entities.push(entity);
    // const entities = this.selectedOperation.phases[this.phaseOrder].timelines[this.timelineActive].entities;
    this.http.put(this.URL_API + `/${this.selectedOperation._id}`,
    {
      // "entities" : this.selectedOperation.phases[this.phaseOrder].timelines[this.timelineActive].entities,
      "action": "updateTimeline",
      "entity":entity,
      "timeline": this.timelineActive,
      "phase":this.phaseOrder,
      "phaseName":this.selectedOperation.phases[this.phaseOrder].name
    }
    ).subscribe((data) => {
      console.log(data);
    })
  }

  

  addEntityToLayout(entity: Entity<Geometry>) {
    // Solo se incluye si no está incluido ya
    // const coordinates = entity.getCoordinates();
    const id = entity._id;
    if ((this.selectedOperation.phases[this.phaseOrder].layout.find((item) =>{
      return item.entity._id === id
    })) == undefined){
      const entityLocated:EntityLocated = new EntityLocated()
      entityLocated.entity = entity;
      entityLocated.location = entity.getCoordinates();
        this.selectedOperation.phases[this.phaseOrder].layout.push(entityLocated);
      this.http.put(this.URL_API + `/${this.selectedOperation._id}`,
      {
        // "entities" : this.selectedOperation.phases[this.phaseOrder].timelines[this.timelineActive].entities,
        "action": "updateLayout",
        "entity":entity,
        "phase":this.phaseOrder,
        "location": entityLocated.location
      }
      ).subscribe((data) => {
        console.log(data);
        this.updateLayout();
      })
    }
    if ((this.selectedOperation.comboEntities.find((item) =>{
      return item._id === id
    })) == undefined){
      this.selectedOperation.comboEntities.push(entity);
      this.http.put(this.URL_API + `/${this.selectedOperation._id}`,
      {
        // "entities" : this.selectedOperation.phases[this.phaseOrder].timelines[this.timelineActive].entities,
        "action": "updateCombo",
        "entity":entity
      }
      ).subscribe((data) => {
        console.log(data);
      })
    }

    // // const operationToDDBB = this.prepareOperationToDDBB();
    // this.updateOperation(this.selectedOperation).subscribe(data => {
    //   this.updateLayout();
    //   console.log(data);
    // });
    // this.entitiesDeployed.entities = this.selectedOperation.phases[this.phaseOrder].layout
  }

  previousPhase(){
    if (this.selectedOperation.phases[this.phaseOrder].name != '')
      if (this.phaseOrder == 0)
        this.addNewEmptyPhase(this.phaseOrder,this.PREVIOUS);
      else
        this.phaseOrder--;
    this.updateLayout();
  }

  nextPhase(){
    if (this.selectedOperation.phases[this.phaseOrder].name != ''){  // ya existe la fase
      if (this.phaseOrder == this.selectedOperation.phases.length - 1)  // es la última
        this.addNewEmptyPhase(this.phaseOrder,this.NEXT);   // agregar una nueva fase vacía
      this.phaseOrder++;
      this.updateLayout();  
    }
  }


  public addNewEmptyPhase(index:number,direction:number){
    if (index == 0 && direction == this.PREVIOUS) 
        this.selectedOperation.phases.unshift(new Phase())
      else
        this.selectedOperation.phases.push(new Phase())
  }

  updateEntityPositionInOperation(operation: Operation, entity: Entity) {
    return this.http.put(this.URL_API + `/${operation._id}`,operation);
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

  changeOperation(){
    this.phaseOrder = 0
    this.updateLayout();
  }

  updateLayout() {
    this.entitiesDeployed.resetEntitiesDeployed();
    for (let entityInlayout of this.selectedOperation.phases[this.phaseOrder].layout){  
      // const entity = EntitySelector.getFactory(entityInlayout.entityType).
      //   createEntity(this.svgService,entityInlayout.entityOptions,entityInlayout.location);      
      this.entitiesDeployed.addNewEntity(entityInlayout)
    }
  }


}
