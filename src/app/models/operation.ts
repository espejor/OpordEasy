import { Coordinate } from "ol/coordinate";
import { Entity } from "../entities/entity.class";
import { EntitySelector } from "../entities/factory-entity-selector";
import { SVGUnitsIconsListService } from "../services/svg-units-icons-list.service";

export class Operation {
    _id: string;
    name: string;
    updated: number;
    comboEntities: Entity[];
    phases: Phase[]
    // user: string// _id del User

    constructor(private svgService?:SVGUnitsIconsListService, jsonRecovered?){
        // this._id ="";
        this.name = "";
        this.updated = Date.now();
        this.phases = [];
        this.phases.push(new Phase());
        this.comboEntities = [];
        if (jsonRecovered){
            this._id = jsonRecovered._id;
            this.name = jsonRecovered.name;
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

}


function recoverEntity(svgService:SVGUnitsIconsListService,jsonEntity): Entity{
    return EntitySelector.getFactory(jsonEntity.entityType).
    createEntity(svgService,jsonEntity.entityOptions,jsonEntity.location,jsonEntity._id);
}


export class Phase {
    name : string ;
    timelines:Timeline[];
    layout: EntityLocated[];
  private _id: any;

    constructor(private svgService?:SVGUnitsIconsListService, jsonRecovered?){
        this.name = '<Nueva Fase>' ;
        this.timelines = [];
        this.timelines.push(new Timeline())
        this.layout = [];

        if (jsonRecovered){
            this.name = jsonRecovered.name ;
            this.timelines = this.recoverTimelines(jsonRecovered.timelines);
            this.layout = this.recoverLayout(jsonRecovered.layout);
        }
    }

    recoverTimelines(jsonTimelines: any): Timeline[] {
        const timelines:Timeline[] = [];
        for (let i = 0; i < jsonTimelines.length; i++){
            timelines.push(new Timeline(this.svgService,jsonTimelines[i])); 
        }
        return timelines;
    }

    recoverLayout(jsonLayout: any): EntityLocated[] {
        const entitiesLocated: EntityLocated[] = [];
        for (let i = 0; i < jsonLayout.length; i++){
            const entityLocated:EntityLocated = new EntityLocated()
            entityLocated.entity = recoverEntity(this.svgService,jsonLayout[i].entity); 
            entityLocated.location = <Coordinate[]>jsonLayout[i].location; 
            entitiesLocated.push(entityLocated);
        }
        return entitiesLocated;
    }
}

export class Timeline { 
    entities: Entity[] = [];
    constructor(private svgService?:SVGUnitsIconsListService, jsonTimeline?: any){
        if(jsonTimeline){
            this.recoverEntities(jsonTimeline.entities)
        }
    }
    recoverEntities(jsonEntities: any){
        for (let i = 0; i < jsonEntities.length; i++){
            this.entities.push(recoverEntity(this.svgService,jsonEntities[i])); 
        }
    }
}

export class EntityLocated{
    entity:Entity;
    location:Coordinate[] | Coordinate

    constructor(entity?:Entity){
        if (entity){
            this.entity = entity;
            this.location = entity.getCoordinates();
        }
    }
}

