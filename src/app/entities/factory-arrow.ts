
import { Coordinate } from "ol/coordinate";
import { LineString } from "ol/geom";
import Geometry from "ol/geom/Geometry";
import { SvgTasksIconsListService } from "../services/svg-tasks-icons-list.service";
import { EntityArrow } from "./entity-arrow.class";
import { TaskOptions } from "./entity-task.class";
import { Entity } from "./entity.class";
import { EntityFactory } from "./factory-entity";

export class ArrowFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{
  typeTask: string;  

  createEntity(taskOptions:TaskOptions,coordinates:Coordinate|Coordinate[],id?:string ):Entity{
    return new EntityArrow(taskOptions,{geometry: new LineString(coordinates)},id);
  }
  
  getSVGService():SvgTasksIconsListService{
    return new SvgTasksIconsListService();
  }

}
