
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import LineString from "ol/geom/LineString";
import { LineOptions } from "../models/feature-for-selector";
import { SvgGeneralIconsListService } from "../services/svg-general-icons-list.service";
import { EntityLine } from "./entity-line.class";
import { Entity } from "./entity.class";
import { EntityFactory } from "./factory-entity";

export class LineFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{  

  createEntity(lineOptions:LineOptions,coordinates:Coordinate|Coordinate[],id?:string ):Entity{
    return new EntityLine(lineOptions,{geometry: new LineString(coordinates)},id);
  }
  
  getSVGService():SvgGeneralIconsListService{
    return new SvgGeneralIconsListService();
  }

}
