import { Coordinate } from "ol/coordinate";
import { Entity } from "../entities/entity.class";
import { EntitySelector } from "../entities/factory-entity-selector";
import { SvgIconsListService } from "../services/svg-icons-list.service";

export class Operation {
    _id: string;
    name: string;
    order:number
    updated: number;
    comboEntities: Entity[];
    phases: Phase[]
    situation:string
    enemy:string
    ourForces:string
    aggregationsAndSegregations:string
    mission:string
    coordination:string
    apolog:string
    command:string
    communications:string


    // user: string// _id del User

    constructor(private svgService?:SvgIconsListService, jsonRecovered?){
        // this._id ="";
        this.name = "";
        this.updated = Date.now();
        this.phases = [];
        this.phases.push(new Phase());
        this.comboEntities = [];
        if (jsonRecovered){
            this._id = jsonRecovered._id;
            this.name = jsonRecovered.name;
            this.situation = jsonRecovered.situation;
            this.enemy = jsonRecovered.enemy;
            this.aggregationsAndSegregations = jsonRecovered.aggregationsAndSegregations;
            this.ourForces = jsonRecovered.ourForces;
            this.mission = jsonRecovered.mission;
            this.coordination = jsonRecovered.coordination;
            this.apolog = jsonRecovered.apolog;
            this.command = jsonRecovered.command;
            this.communications = jsonRecovered.communications;
            this.order = jsonRecovered.order;
            this.updated = jsonRecovered.updated;
            this.phases = this.recoverPhases(jsonRecovered.phases);
            this.comboEntities = this.recoverCombo(jsonRecovered.comboEntities);
        }
        // this.user = "";
    }

    recoverPhases(jsonRecovered): Phase[]{
        const phases: Phase[] = [];
        for (let i = 0; i < jsonRecovered.length; i++){
            phases.push(new Phase(this.svgService,jsonRecovered[i])); 
        }
        return phases;
    }
    
    recoverCombo(jsonRecovered): Entity[]{
        const combo: Entity[] = [];
        for (let i = 0; i < jsonRecovered.length; i++){
            combo.push(recoverEntity(this.svgService,jsonRecovered[i])); 
        }
        return combo;
    }

    deletePhase(i: number) {
        this.phases.splice(i,1);
    }

}


function recoverEntity(svgService:SvgIconsListService,jsonEntity): Entity{
    return EntitySelector.getFactory(jsonEntity.entityType).
    createEntity(jsonEntity.entityOptions,jsonEntity.location,jsonEntity._id);
}


export class Phase {
    name : string ;
    timelines:Timeline[];
    layout: EntityLocated[];
   _id: any;

    constructor(private svgService?:SvgIconsListService, jsonRecovered?){
        this.name = '' ;
        this.timelines = [];
        this.layout = [];

        if (jsonRecovered){
            this.name = jsonRecovered.name ;
            this.timelines = this.recoverTimelines(jsonRecovered.timelines);
            this.layout = this.recoverLayout(jsonRecovered.layout);
        }
    }

    setLayout(layout: EntityLocated[]) {
        layout.forEach(entityLocated => {
            const entityL:EntityLocated = new EntityLocated(entityLocated.entity);
            entityL.location = entityLocated.location
            this.layout.push(entityL)
        });
    }

    recoverTimelines(jsonTimelines: any): Timeline[] {
        const timelines:Timeline[] = [];
        for (let i = 0; i < jsonTimelines.length; i++){
            timelines.push(new Timeline(this.svgService,jsonTimelines[i])); 
        }
        return timelines;
    }

    isEmpty() {
        return (this.timelines.length == 0 && this.layout.length == 0);
    }

    recoverLayout(jsonLayout: any): EntityLocated[] {
        const entitiesLocated: EntityLocated[] = [];
        for (let i = 0; i < jsonLayout.length; i++){
            const entityLocated:EntityLocated = new EntityLocated(recoverEntity(this.svgService,jsonLayout[i].entity),<Coordinate[]>jsonLayout[i].location)
            // entityLocated.entity = recoverEntity(this.svgService,jsonLayout[i].entity); 
            // entityLocated.location = <Coordinate[]>jsonLayout[i].location; 
            entitiesLocated.push(entityLocated);
        }
        return entitiesLocated;
    }

    newTimeline(){
        this.timelines.push(new Timeline())
    }

    deleteTimeline(i: number) {
        this.timelines.splice(i,1);
    }
}

export class Timeline {
    entities: Entity[] = [];
    constructor(private svgService?:SvgIconsListService, jsonTimeline?: any){
        if(jsonTimeline){
            this.recoverEntities(jsonTimeline.entities)
        }
    }
    recoverEntities(jsonEntities: any){
        for (let i = 0; i < jsonEntities.length; i++){
            this.entities.push(recoverEntity(this.svgService,jsonEntities[i])); 
        }
    }

    deleteEntity(entity: Entity<import("ol/geom").Geometry>) {
        this.entities =
        this.entities.filter(item => {
          return item._id != entity._id
        })
    }

    isEmpty():boolean {
      return this.entities.length == 0;
    } 
}

export class EntityLocated{
    entity:Entity;
    location:Coordinate[] | Coordinate

    constructor(entity?:Entity,coordinate?:Coordinate | Coordinate[]){
        if (entity){
            this.entity = entity;
            // this.location = entity.getCoordinates();
        }
        if (coordinate)
            this.location = coordinate;
    }
}

