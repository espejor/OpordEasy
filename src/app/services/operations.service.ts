import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { EntityLocated, Operation,Phase, Timeline } from '../models/operation';
import Geometry from 'ol/geom/Geometry';
import { Entity } from '../entities/entity.class';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntitiesDeployedService } from './entities-deployed.service';
import { Coordinate } from 'ol/coordinate';
import { MatDialog } from '@angular/material/dialog';
import { NewPhaseDialogComponent } from '../components/nav/ol-map/new-phase-dialog/new-phase-dialog.component';
// import { Globals } from '../utilities/globals';
import { findElement } from '../utilities/miscelanea';
import { Globals, OpsRoles } from '../utilities/globals';
import { User } from '../models/user';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  readonly PREVIOUS = 0;
  readonly NEXT = 1;
  
  activatedOperationsFormOpened:boolean = false;
  opordFormOpened:boolean = false;
  selectedOperation: Operation = new Operation();
  operations: Operation[]
  phaseOrder: number = 0;
  timelineActive = 0;
  URL_API: string;
  currentUser: User;

  // layout: Entity[] = []

  constructor(
    private http:HttpClient, 
    private _snackBar: MatSnackBar, 
    private  entitiesDeployedService:EntitiesDeployedService,
    public dialog: MatDialog,
    public userService:UserService,
    public authService:AuthService
    ) {    
    const URL_BASE = environment.baseUrl;
    this.URL_API = URL_BASE + 'api/operations'; 
    // Globals.OPERATION_SVC = this
  }

  isOperationLoaded():boolean {
    return this.selectedOperation._id != undefined;
  }

  loadEntityInLayout(unit: Entity<Geometry>,coordinates:Coordinate | Coordinate[]):boolean {
    if(this.isOperationLoaded()){
      this.addEntityToLayout(unit,coordinates);
      return true;
    }else{
      const snackRef = this._snackBar.open(
        'No es posible cargar una Unidad sin antes haber cargado una OPERACIÓN',
        'Abrir Operación', {
        duration: 5000,
        verticalPosition: "top",
        panelClass: ['warning']
      });
      snackRef.onAction().subscribe(() => {
        this.activatedOperationsFormOpened = true;   
      })
      return false;     
    }
  }

  addEntityToTimeline(entity: Entity<Geometry>) {
    if(this.currentUser && this.getUserRoleObj(this.currentUser).role == "VIEWER")
      return
    const timelines = this.selectedOperation.phases[this.phaseOrder].timelines
    // Si no hay timelines se agrega uno
    if(timelines.length == 0)
      timelines.push(new Timeline())
    // Agregamos la entidad al timeline
    // Si es la primera entidad ésta debe ser una Unidad
    if (timelines[this.timelineActive].isEmpty() && entity.getType() != "Unidad"){  
      this._snackBar.open(
        "No es posible agregar algo distinto a una Unidad como primer elemento de una Línea tiempo",
        "",
        {
          duration:5000
        }
      )
      return
    }
        // const entities = this.selectedOperation.phases[this.phaseOrder].timelines[this.timelineActive].entities;
    
    timelines[this.timelineActive].entities.push(entity);
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

  
  addUserOfOperation(userId: string) {
    const obj:any = {user:userId,role:OpsRoles.OWNER}
    const isAdded = this.selectedOperation.users.some((user:any) => {
      return user._id == userId
    })
    if(!isAdded)
      this.selectedOperation.users.push(obj)
  }

  
  updateUserOfOperation(userOfOperationObj: { user: User, role: string, },operation:Operation = this.selectedOperation,  propagate:boolean = true) {
    
    // Actualizamos un usuario de la operación
      var userRole = this.getUserRoleObj(userOfOperationObj.user,operation)
      if(userRole)
        // quitamos el elemento
        operation.users = operation.users.filter(user => {
          return user._id !== userOfOperationObj.user._id
        })
        // Si el valor asignado es != NONE
      if(userOfOperationObj.role != "NONE")
        operation.users.push(userOfOperationObj)
      if (propagate){
        this.userService.updateOperationOfUser(this,userOfOperationObj.user,{operation:operation,role:userOfOperationObj.role},false)
      }
  }

  updateUsersOfOpDB(usersOfOperations:{user:User,role:string} [],operation = this.selectedOperation, propagate = true){
    // Actualizamos la BD
    usersOfOperations = usersOfOperations?usersOfOperations:operation.users
    const minUsers = this.minimizeUsers(usersOfOperations)
    this.http.put(this.URL_API + `/${operation._id}`,
    {
      // "entities" : this.selectedOperation.phases[this.phaseOrder].timelines[this.timelineActive].entities,
      "action": "updateUsersDB",
      "users":minUsers,
    }
    ).subscribe((data) => {
      console.log(data);
      if (propagate)
        usersOfOperations.forEach(user => {
          this.userService.updateOperationsOfUsersDB(this,user.user,false)
        })
    })
  }

  minimizeUsers(users: {user:User,role:string}[]): {user:string,role:string}[] {
    const minUsers: {user:string,role:string}[] = []
    users.forEach(user => {
      if(user.role != "NONE")
        minUsers.push({user:user.user._id.toString(),role:user.role})
    })
    return minUsers
  }

  getUserRoleObj(usr: User,operation = this.selectedOperation) {
    if(!usr)
      return null
    const i = operation.users.findIndex(user => {
      return usr._id == user.user._id
    })
    return operation.users[i]
  }

  
  reorderEntitiesInTimeline() {        
    this.updateOperation(this.selectedOperation).subscribe(result =>{
      console.log(result)
    })
  }

  
  newTimeline() {
    const phase = this.selectedOperation.phases[this.phaseOrder];
    if(phase.timelines.length > 0){
      if (!phase.timelines[this.timelineActive].isEmpty()){
        phase.newTimeline();
        this.updateOperation(this.selectedOperation).subscribe(result =>{
          this._snackBar.open(`Se ha creado una nueva Linea de Tiempo`,"",{duration:3000})
        })
        this.updateTimelineActive();
      }else{
        this._snackBar.open(
          "No es posible abrir una nueva Linea de Tiempo si la actual está vacía",
          "",
          {
            duration:3000
          })
      }
    }else{
        phase.newTimeline();
        this.updateOperation(this.selectedOperation).subscribe(result =>{
          this._snackBar.open(`Se ha creado una nueva Linea de Tiempo`,"",{duration:3000})
        })
        this.updateTimelineActive();
    }
  }

  deleteTimeline(i: number) {
    const phase = this.selectedOperation.phases[this.phaseOrder];
    if(phase.timelines.length > 0){
      if (!phase.timelines[i].isEmpty()){
        const snackRef = this._snackBar.open(
          "¿Está seguro que quiere eliminar la Línea de Tiempo?",
          "Eliminar",
          {
            duration:5000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        snackRef.onAction().subscribe(() =>{
            phase.deleteTimeline(i);
            this.updateOperation(this.selectedOperation).subscribe(result =>{
              this._snackBar.open(`Se ha eliminado una Linea de Tiempo`,"",{duration:3000})
            })
            this.updateTimelineActive(i);
        })
      }else{
        phase.deleteTimeline(i);
        this.updateOperation(this.selectedOperation).subscribe(result =>{
          this._snackBar.open(`Se ha eliminado una Linea de Tiempo`,"",{duration:3000})
        })
        this.updateTimelineActive(i);
      }
    }
  }

  deletePhase(i: number) {
    const operation = this.selectedOperation;
    if(operation){
      const phases = operation.phases;
      if(phases.length > 0){    // Si hay más de una fase
        const name = phases[i].name
        if(name != ""){
          if (!phases[i].isEmpty()){
            const snackRef = this._snackBar.open(
              `¿Está seguro de que quiere eliminar la Fase: ${name}?`,
              "Eliminar Fase",
              {
                duration:5000,
                panelClass: ['mat-toolbar', 'mat-warn']
              });
            snackRef.onAction().subscribe(() =>{
              operation.deletePhase(i);
              this.updateOperation(this.selectedOperation).subscribe(result =>{
                this._snackBar.open(`Se ha eliminado la Fase ${name}`,"",{duration:3000})
              })
              this.updatePhaseActive();
            })
          }else{
            operation.deletePhase(i);
            this.updateOperation(this.selectedOperation).subscribe(result =>{
              this._snackBar.open(`Se ha eliminado la Fase ${name}`,"",{duration:3000})
            })
            this.updatePhaseActive();
          }
        }
      }
    }
  }

  updateTimelineActive(i?:number){
    if(i != undefined){
      if(i <= this.timelineActive)
        this.timelineActive --;

    }else{  // lo ponemos al último
      this.timelineActive = this.selectedOperation.phases[this.phaseOrder].timelines.length - 1;
    }
  }

  updatePhaseActive(){
    if(this.phaseOrder > 0)
      this.goPreviousPhase();
  }

  addEntityToLayout(entity: Entity<Geometry>,coordinates:Coordinate | Coordinate[]) {
    // Solo se incluye si no está incluido ya
    // const coordinates = entity.getCoordinates();
    const id = entity._id;
    if ((this.selectedOperation.phases[this.phaseOrder].layout.find((item) =>{
      return item.entity._id === id
    })) == undefined){
      const entityLocated:EntityLocated = new EntityLocated(entity,coordinates);
      // entityLocated.entity = entity;
      // entityLocated.location = coordinates;
      this.selectedOperation.phases[this.phaseOrder].layout.push(entityLocated);
      this.http.put(this.URL_API + `/${this.selectedOperation._id}`,
      {
        // "entities" : this.selectedOperation.phases[this.phaseOrder].timelines[this.timelineActive].entities,
        "action": "updateLayout",
        "entity":entity,
        "location": entityLocated.location,
        "phase":this.phaseOrder
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
    // this.entitiesDeployedService.entities = this.selectedOperation.phases[this.phaseOrder].layout
  }

  prepareOperationForDDBB():any{
    var operationForDDBB:any = new Operation();
    operationForDDBB._id = this.selectedOperation._id;
    operationForDDBB.name = this.selectedOperation.name;
    operationForDDBB.updated = this.selectedOperation.updated;
    operationForDDBB.comboEntities = this.preparelistOfEntities(this.selectedOperation.comboEntities);
    operationForDDBB.phases = this.preparePhases(this.selectedOperation.phases);
    operationForDDBB.situation = this.selectedOperation.situation
    operationForDDBB.enemy = this.selectedOperation.enemy
    operationForDDBB.ourForces = this.selectedOperation.ourForces
    operationForDDBB.order = this.selectedOperation.order
    operationForDDBB.aggregationsAndSegregations = this.selectedOperation.aggregationsAndSegregations
    operationForDDBB.mission = this.selectedOperation.mission
    operationForDDBB.coordination = this.selectedOperation.coordination
    operationForDDBB.apolog = this.selectedOperation.apolog
    operationForDDBB.command = this.selectedOperation.command
    operationForDDBB.communications = this.selectedOperation.communications
    operationForDDBB.users = this.selectedOperation.users
    return operationForDDBB;
  }

  preparePhases(phases: Phase[]): Phase[] {
    const phasesForDB:Phase[] = [];
    phases.forEach(phase => {
      var phaseForDB:Phase = new Phase();
      // phaseForDB._id = phase._id
      phaseForDB.name = phase.name;
      phaseForDB.layout = this.prepareListOfDeployedEntities(phase.layout);
      phaseForDB.timelines = this.prepareTimelinesForDB(phase.timelines);
      phasesForDB.push(phaseForDB);
    });
    return phasesForDB;
  }

  prepareTimelinesForDB(timelines: Timeline[]): Timeline[] {
    const timelinesForDB:Timeline[] = [];
    timelines.forEach(timeline => {
      var timelineForDB:Timeline = new Timeline();
      timelineForDB.entities = this.preparelistOfEntities(timeline.entities);
      timelinesForDB.push(timelineForDB);
    });
    return timelinesForDB;
  }

  private prepareListOfDeployedEntities(layout: EntityLocated[]): EntityLocated[] {
    const entities:EntityLocated[] = [];
    layout.forEach(entityDeployed => {
      var entityForDB:any = new Object(); 
      entityForDB._id = entityDeployed.entity._id;
      var entityDeployedForDB:EntityLocated = new EntityLocated(entityForDB,entityDeployed.location);
      // entityDeployedForDB.entity = entityForDB;
      // entityDeployedForDB.location = entityDeployed.location;
      entities.push(entityDeployedForDB);
    });
    return entities;
  }

  preparelistOfEntities(comboEntities: Entity[]): Entity[] {
    const entities:Entity[] = [];
    comboEntities.forEach(entity => {
      const entityForDB:any = new Object();
      entityForDB._id = entity._id
      entities.push(entityForDB);
    });
    return entities;
  }

  previousPhase(canAccess:boolean){
    if (this.isOperationLoaded()){
      if (this.selectedOperation.phases[this.phaseOrder].name != ''){
        if (this.phaseOrder == 0){
          if(canAccess)
            this.addNewEmptyPhase(this.phaseOrder,this.PREVIOUS);
        }else{
          this.phaseOrder--;
        }
        this.timelineActive = 0;
      }
      this.updateLayout();
    }  
  }

  goPreviousPhase(){
    this.phaseOrder--;
    this.updateLayout();
  }

  nextPhase(canAccess:boolean){
    if (this.isOperationLoaded()){
      if (this.selectedOperation.phases[this.phaseOrder].name != ''){  // ya existe la fase
        if (this.phaseOrder == this.selectedOperation.phases.length - 1) { // es la última
          if(canAccess)
            this.addNewEmptyPhase(this.phaseOrder,this.NEXT);   // agregar una nueva fase vacía
        }else{
          this.phaseOrder++;
        }
        this.timelineActive = 0;
      }
      this.updateLayout();  
    }
  }


  public addNewEmptyPhase(index:number,direction:number){
    // Solicitar mantener el Layout
    const dialogRef = this.dialog.open(NewPhaseDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

    if (result.action == "newPhase"){
        const phase = new Phase();
        phase.name = result.name;
        if (result.keepLayout){
          phase.setLayout(this.selectedOperation.phases[this.phaseOrder].layout)
        }

        if (index == 0 && direction == this.PREVIOUS) {
          this.selectedOperation.phases.unshift(phase)
        }else{
          this.selectedOperation.phases.push(phase)
          this.phaseOrder++;
        }
        this.updateOperation(this.selectedOperation).subscribe(result =>{
          this._snackBar.open(`Se ha creado la fase: ${phase.name}`,"",{duration:3000})
        })
        
        this.updateLayout();  
      }
    });
  }

  updateEntityPositionInOperation(entity: Entity) {
    const operation = this.selectedOperation
    const location = entity.getCoordinates();
    const entityFound = this.selectedOperation.phases[this.phaseOrder].layout.find((item) =>{
      return item.entity._id === entity._id
    })
    if(entityFound)
      entityFound.location = location

    const object = {
      "action" : "updatePosition",
      "location" : location, 
      "phase": this.phaseOrder,
      "entity": entity
    }
    return this.http.put(this.URL_API + `/${operation._id}`,object)
    .subscribe(data => {
      console.log(data);
    });
  }


  updateEntityInOperation(entity: Entity) {
    this.updateEntityInCombo(entity)
    this.updateEntityInTimelines(entity)
    // this.updateEntityInCombo(entity)
    const operation = this.selectedOperation
    const object = {
      "action" : "updateEntity",
      "phase": this.phaseOrder,
      "entity": entity
    }
    return this.http.put(this.URL_API + `/${operation._id}`,object)
    .subscribe(data => {
      console.log(data);
    });
  }

  updateEntityInCombo(entity: Entity<Geometry>) {
    const indexElement = findElement(this.selectedOperation.comboEntities,entity,{key:"_id",value:entity._id})
    if (indexElement != -1){
      this.selectedOperation.comboEntities[indexElement] = entity
    }
    return indexElement
  }

  updateEntityInTimelines(entity: Entity<Geometry>) {
    const phases = this.selectedOperation.phases
    phases.forEach(phase => {
      const timelines = phase.timelines
      timelines.forEach(timeline => {
        const indexElement = findElement(timeline.entities,entity,{key:"_id",value:entity._id})
        if (indexElement != -1){
          timeline.entities[indexElement] = entity
        }
      })
    })
  }

  
  deleteEntityFromOperation(entity: Entity<Geometry>) {
    this.deleteEntityFromLayout(entity)
  }

  checkIfEntityIsInLayout(entity:Entity):boolean{
    return this.selectedOperation.phases[this.phaseOrder].layout.some(entityLocated => {
      return entityLocated.entity._id == entity._id
    })
  }

  deleteEntityFromLayout(entity: Entity<Geometry>) {
    // Borrar entidad del layout
    var entityLocated
    this.selectedOperation.phases[this.phaseOrder].layout = 
    this.selectedOperation.phases[this.phaseOrder].layout.filter(item => {
      if(item.entity._id != entity._id)
        return true
      else{
        entityLocated = item
        return false
      }
    })

    // Si lo quitamos del Layout también lo quitamos de los Timelines
    // this.deleteEntityFromTimelines(entity)
    this.deleteEntityFromAllTimelines(entity,true)
    // Si lo quitamos del layout desaparece del Combo
    // this.deleteEntityFromCombo(entity)    
    this.deleteEntityFromCombo(entity)

    // Eliminar del Vector de entidades desplegadas
    this.entitiesDeployedService.removeEntityFromMap(entityLocated)

    // Modificar la DB
    const object = {
      "action" : "deleteEntityLyt",
      "phase": this.phaseOrder,
      "entity": entityLocated
    }
    return this.http.put(this.URL_API + `/${this.selectedOperation._id}`,object)
      .subscribe(data => {
        console.log(data);
    });

  }

  deleteEntityFromCombo(entity: Entity<Geometry>) {
    // Borrar entidad del Combo
    this.selectedOperation.comboEntities =
    this.selectedOperation.comboEntities.filter(item => {
      return item._id != entity._id
    })
  }

  deleteEntityFromAllTimelines(entity: Entity<Geometry>,silent = false) {
    // Borrar entidad de los TimeLines
    this.selectedOperation.phases[this.phaseOrder].timelines.forEach(timeline => {
        this.deleteEntityFromTimeline(entity,timeline,silent)
    })
  }

  deleteEntityFromTimeline(entity: Entity<Geometry>, timeline: Timeline,silent= false) {
      if (silent)      
        timeline.deleteEntity(entity)
      else{
        if (!timeline.isEmpty()){
          const snackRef = this._snackBar.open(
            "¿Está seguro de que quiere eliminar el símbolo?",
            "Eliminar",
            {
              duration:5000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          snackRef.onAction().subscribe(() =>{
              timeline.deleteEntity(entity)
              this.updateOperation(this.selectedOperation).subscribe(result =>{
                this._snackBar.open(`Se ha eliminado un símbolo`,"",{duration:3000})
              })
          })
        }
      }
  }
  
  
  // getUserOfOperation(operation?: Operation) {
  //   operation = operation ? operation : this.selectedOperation
  //   var users: User[] = []  
  //   if(operation._id){
  //     this.getOperation(operation._id).subscribe((operation:any) => {
  //       return users = operation.users
  //     })
  //   }else{
  //     return users
  //   }
  // }
  
  getOperations(userId?:string){
    if (userId)
      return this.http.get(this.URL_API + "/all/" + userId);
    else
      return this.http.get(this.URL_API + "/all");
  }

  addOperation(operation: Operation){
    // -------- provisional
    // operation.user = "Pepe"
    return this.http.post(this.URL_API,operation);
  }

  updateOperation(operation?: Operation){
    if(!operation)
      operation = this.selectedOperation
    return this.http.put(this.URL_API + `/${operation._id}`,
    {
      "action":"updateOperation",
      "operation": this.prepareOperationForDDBB()
    });
  }

  deleteOperation(_id: string){
    // Eliminamos las referencias a la operacion en los usuarios
    this.getOperation(_id).subscribe((operation:Operation) => {
      operation.users.forEach((user) => {
        user.user.operations = user.user.operations.filter(op => {
          return op.operation != _id
        })
        this.userService.updateOperationsOfUsersDB(this,user.user,false)
      })
    })
    return this.http.delete(this.URL_API + `/${_id}`);
    // eliminar las referencias en otras colecciones
  }

  getOperation(_id: string){
    return this.http.get(this.URL_API + `/${_id}`);
  }

  changeOperation(){
    this.phaseOrder = 0
    this.updateLayout();
    this.getCurrentUser()
  }

  getCurrentUser() {
    this.userService.getUser(this.authService.getUserId()).subscribe((user:User) => {
      this.currentUser = user
    })
  }

  updateLayout() {
    this.entitiesDeployedService.resetEntitiesDeployed();
    if(this.selectedOperation.phases.length > 0){
      for (let entityInlayout of this.selectedOperation.phases[this.phaseOrder].layout){  
        // const entity = EntitySelector.getFactory(entityInlayout.entityType).
        //   createEntity(this.svgService,entityInlayout.entityOptions,entityInlayout.location);      
        this.entitiesDeployedService.addNewEntityToMap(entityInlayout)
      }
    }
  }


}
