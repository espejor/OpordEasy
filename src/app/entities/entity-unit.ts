import Geometry from "ol/geom/Geometry";
import Icon from "ol/style/Icon";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Style from "ol/style/Style";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import { UnitOptions } from "../components/unit-selector/unit-selector.component";
import { SVGUnitsIconsListService } from "../services/svg-units-icons-list.service";
import { EntityPoint } from "./entity-point.class";
import { EntityOptions } from "./entity.class";

export class EntityUnit<GeomType extends Geometry = Geometry>  extends EntityPoint{
    // entityOptions: UnitOptions
    

    constructor(svgService: SVGUnitsIconsListService,public mapComponent: OlMapComponent,entityOptions:EntityOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any }) {
        super(mapComponent,entityOptions,opt_geometryOrProperties);
        // this.map = mapComponent.map;
        this.entityOptions = entityOptions;

        const svgRogh = svgService.createSVG(entityOptions);
        var svg = encodeURIComponent(svgRogh);
        // const svg = (svgService.createSVG(entityOptions));

        const icon = new Icon({
            anchor: [0.5,0.5],
            anchorXUnits: IconAnchorUnits.FRACTION,
            anchorYUnits: IconAnchorUnits.FRACTION,
            opacity: 1,
            scale: 0.5,
            // size: [24,24],
            // color: 'black',
            src: "data:image/svg+xml;charset=utf-8," + svg
          })

          this.setStyle(null)
        this.style = new Style({image:icon});

        // this.olMap.shapesFeatures.push(this);

        //   this.setStyle(this.style);
    }


  
}