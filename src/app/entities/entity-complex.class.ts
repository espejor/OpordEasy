
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Style from "ol/style/Style";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import { Entity } from "./entity.class";

export abstract class EntityComplex extends Entity{
  constructor(coordinates: Coordinate[]) {
    super(null);
    // this.map = mapComponent.map;
    // this.coordinates = coordinates;
  }

  stiles:Style[] = []

}