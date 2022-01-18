
import { Coordinate } from "ol/coordinate";
import { LineString } from "ol/geom";
import Geometry from "ol/geom/Geometry";
import { SvgTasksIconsListService } from "../services/svg-tasks-icons-list.service";
import { EntityAxis } from "./entity-axis.class";
import { TaskOptions } from "./entity-task.class";
import { Entity } from "./entity.class";
import { EntityFactory } from "./factory-entity";

export class AxisFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{
  typeTask: string;  

  createEntity(taskOptions:TaskOptions,coordinates:Coordinate|Coordinate[],id?:string ):Entity{
    // taskOptions.axis_options = {WIDTH:2000}
    return new EntityAxis(taskOptions,{geometry: new LineString(coordinates)},id);
  }
  
  getSVGService():SvgTasksIconsListService{
    return new SvgTasksIconsListService();
  }

}
