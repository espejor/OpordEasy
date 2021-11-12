
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Line from "ol/geom/LineString";
import { SvgGeneralIconsListService } from "../services/svg-general-icons-list.service";
import { SvgIconsListService } from "../services/svg-icons-list.service";
import { EntityLine } from "./entity-line.class";
import { Entity, EntityOptions } from "./entity.class";
import { EntityFactory } from "./factory-entity";

export class LineFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{  

  createEntity(entityOptions:EntityOptions,coordinates:Coordinate|Coordinate[],id?:string ):Entity{
    return new EntityLine({geometry: new Line(coordinates)},id);
  }
  
  getSVGService():SvgGeneralIconsListService{
    return new SvgGeneralIconsListService();
  }

}
