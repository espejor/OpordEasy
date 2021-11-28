
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { SvgIconsListService } from "../services/svg-icons-list.service";
import { Entity, EntityOptions } from "./entity.class";

export abstract class EntityFactory<GeomType extends Geometry = Geometry> {
    
  // método abastracto de creación de subclases
  abstract createEntity(entityOptions?:EntityOptions,coordinates?:Coordinate[] | Coordinate, id?:string):Entity;
  abstract getSVGService():SvgIconsListService;
}


