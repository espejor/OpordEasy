
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { SVGUnitsIconsListService } from "../services/svg-units-icons-list.service";
import { Entity, EntityOptions } from "./entity.class";

export abstract class EntityFactory<GeomType extends Geometry = Geometry> {
  // svgService: SVGUnitsIconsListService;
    
  // método abastracto de creación de subclases
  abstract createEntity(svgService:SVGUnitsIconsListService, entityOptions?:EntityOptions,coordinates?:Coordinate[] | Coordinate, id?:string):Entity;
}



