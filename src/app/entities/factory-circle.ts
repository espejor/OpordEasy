
import { Coordinate, distance } from "ol/coordinate";
import { Circle, LineString, MultiPoint, Polygon } from "ol/geom";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import { PointOptions } from "../models/feature-for-selector";
import { SvgGeneralIconsListService } from "../services/svg-general-icons-list.service";
import { SvgIconsListService } from "../services/svg-icons-list.service";
import { CircleOptions, EntityCircle } from "./entity-circle";
import { EntityMultiPoint } from "./entity-multipoint.class";
import { EntityPoint } from "./entity-point.class";
import { TaskOptions } from "./entity-task.class";
import { Entity, EntityOptions } from "./entity.class";
import { EntityFactory } from "./factory-entity";

export class CircleFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{  

  createEntity(circleOptions:TaskOptions,coordinates:Coordinate[],id?:string ):Entity{
    // var center:Coordinate
    // var radius:number
    // if(coordinates){
    //   center = coordinates[0];
    //   radius = distance(center,coordinates[1])
    // }else{
    //   center = (<CircleOptions>circleOptions.options).center.coordinate
    //   radius = (<CircleOptions>circleOptions.options).radius
    // }
    return new EntityCircle(circleOptions, {geometry: new LineString(coordinates)},id);
  }
  
  getSVGService():SvgGeneralIconsListService{
    return new SvgGeneralIconsListService();
  }

}
