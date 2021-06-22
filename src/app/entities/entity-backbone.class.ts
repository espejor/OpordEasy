import { Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import { EntityLine } from "./entity-line.class";

export class EntityBackBone<GeomType extends Geometry = Geometry> extends EntityLine{
    // public features:Feature[]

    constructor(features: Feature[],opt_geometryOrProperties?: GeomType | { [key: string]: any }) {
        super(opt_geometryOrProperties);
        // this.features = features;
      }
}