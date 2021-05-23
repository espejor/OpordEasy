import { Entity } from "../entities/entity.class";

export class Operation {
    _id: string;
    name: string;
    updated: number;
    phases: [Phase]
    // user: string// _id del User

    constructor(){
        // this._id ="";
        this.name = "";
        this.updated = Date.now();
        this.phases = [new Phase];
        // this.user = "";
    }

}

export class Phase {
    name : string ;
    timelines:[{ 
        entities: [{
            entity: Entity
        }]
        }];
    layout: [
        Entity
    ]

    constructor(){
        this.name = '' ;
        this.timelines = [{ 
            entities: [{
                entity: new Entity()
            }]
            }];
        this.layout = [
            new Entity()
        ]
    }
}