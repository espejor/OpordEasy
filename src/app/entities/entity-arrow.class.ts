import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Style from "ol/style/Style";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import { entityType } from "./entitiesType";
import { EntityLine } from "./entity-line.class";

export class EntityArrow<GeomType extends Geometry = Geometry> extends EntityLine{
    constructor(opt_geometryOrProperties?: GeomType | { [key: string]: any }) {
        super(opt_geometryOrProperties);
        this.entityType = entityType.arrow
    }
    
    public rotationOfTip(): Number{
        var dx = this.getEnd[0] - this.getPenultimate[0];
        var dy = this.getEnd[1] - this.getPenultimate[1];
        return Math.atan2(dy, dx);
    }

    public getArrowStile():Style{    
        var arrowStyle = new Style({
            geometry: new Point(this.getEnd()),
            image: new Icon({
            anchor: [0.75,0.5],
            anchorXUnits: IconAnchorUnits.FRACTION,
            anchorYUnits: IconAnchorUnits.FRACTION,
            opacity: 1,
            // size: [24,24],
            color: 'red',
            src: 'assets/icons/up-arrow.png',
            rotateWithView: true,
            rotation: -this.rotationOfTip()
            })
        })
        return arrowStyle;
    }
}