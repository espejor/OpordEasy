
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import { SVGUnitsIconsListService } from "../services/svg-units-icons-list.service";
import { EntityUnit, UnitOptions } from "./entity-unit";
import { Entity } from "./entity.class";
import { EntityFactory } from "./factory-entity";

export class UnitFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{  

  createEntity(svgService:SVGUnitsIconsListService, entityOptions:UnitOptions,coordinates:Coordinate,id?:string ):Entity{
    return new EntityUnit(svgService,entityOptions, {geometry: new Point(coordinates)},id);
  }
}
