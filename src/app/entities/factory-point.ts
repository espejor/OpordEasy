
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import { SvgGeneralIconsListService } from "../services/svg-general-icons-list.service";
import { SvgIconsListService } from "../services/svg-icons-list.service";
import { EntityPoint } from "./entity-point.class";
import { Entity, EntityOptions } from "./entity.class";
import { EntityFactory } from "./factory-entity";

export class PointFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{  

  createEntity(entityOptions:EntityOptions,coordinates:Coordinate,id?:string ):Entity{
    return new EntityPoint(this.getSVGService(),entityOptions, {geometry: new Point(coordinates)},id);
  }
  
  getSVGService():SvgGeneralIconsListService{
    return new SvgGeneralIconsListService();
  }

}
