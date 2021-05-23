
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import { Entity } from "./entity.class";

export class EntityComplex extends Entity{
  protected coordinates: Coordinate[];
    constructor(public mapComponent: OlMapComponent,coordinates: Coordinate[]) {
        super(mapComponent);
        this.map = mapComponent.map;
        this.coordinates = coordinates;
      }

    
}