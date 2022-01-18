
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { SvgTasksIconsListService } from "../services/svg-tasks-icons-list.service";
// import { getEntityType } from "./entitiesType";
import { TaskOptions } from "./entity-task.class";
import { Entity } from "./entity.class";
import { EntityFactory } from "./factory-entity";
// import { EntitySelector } from "./factory-entity-selector";

export class TaskFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{
  typeTask: string;  

  createEntity(taskOptions:TaskOptions,coordinates:Coordinate|Coordinate[],id?:string ):Entity{
    // if(taskOptions){
    //   this.typeTask = taskOptions.typeTask;
    // }
    // return EntitySelector.getFactory(getEntityType(this.typeTask)).createEntity(taskOptions,coordinates)
    return null
  }
  
  getSVGService():SvgTasksIconsListService{
    return new SvgTasksIconsListService();
  }

}
