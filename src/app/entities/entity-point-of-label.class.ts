import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import { EntityPoint } from "./entity-point.class";

export class EntityPointOfLabel<GeomType extends Geometry = Geometry>  extends EntityPoint{
    private coordinate:Coordinate;
    private offsetX: number;
    private offsetY: number;
    
    constructor(public mapComponent: OlMapComponent,opt_geometryOrProperties?: GeomType | { [key: string]: any }) {
      super(mapComponent,null,opt_geometryOrProperties);
    }
    
}