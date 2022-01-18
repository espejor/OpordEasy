
import { Coordinate } from "ol/coordinate";
import { LineString, MultiPoint, Polygon } from "ol/geom";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import { PointOptions } from "../models/feature-for-selector";
import { SvgGeneralIconsListService } from "../services/svg-general-icons-list.service";
import { SvgIconsListService } from "../services/svg-icons-list.service";
import { EntityMultiPoint } from "./entity-multipoint.class";
import { EntityPoint } from "./entity-point.class";
import { Entity, EntityOptions } from "./entity.class";
import { EntityFactory } from "./factory-entity";

export class MultiPointFactory<GeomType extends Geometry = Geometry>  extends EntityFactory{  

  createEntity(multiPointOptions:PointOptions,coordinates:Coordinate[],id?:string ):Entity{
    // var coords:Coordinate[][] = [];
    // coords[0] = <Coordinate[]>coordinates;
    return new EntityMultiPoint(multiPointOptions, {geometry: new LineString(coordinates)},id);
  }
  
  getSVGService():SvgGeneralIconsListService{
    return new SvgGeneralIconsListService();
  }

}
