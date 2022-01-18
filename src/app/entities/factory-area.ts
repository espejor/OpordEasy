
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Polygon from "ol/geom/Polygon";
import { SvgGeneralIconsListService } from "../services/svg-general-icons-list.service";
import { EntityArea, AreaOptions } from "./entity-area.class";
import { Entity } from "./entity.class";
import { EntityFactory } from "./factory-entity";

export class AreaFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{  

  createEntity(areaOptions:AreaOptions,coordinates:Coordinate|Coordinate[],id?:string ):Entity{
    var coords:Coordinate[][] = [];
    coords[0] = <Coordinate[]>coordinates 
    return new EntityArea(areaOptions,{geometry: new Polygon(coords)},id);
  }
  
  getSVGService():SvgGeneralIconsListService{
    return new SvgGeneralIconsListService();
  }

}
