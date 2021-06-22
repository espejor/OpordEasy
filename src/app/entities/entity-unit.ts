import Geometry from "ol/geom/Geometry";
import Icon from "ol/style/Icon";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Style from "ol/style/Style";
import { FeatureForSelector } from "../models/feature-for-selector";
import { SVGUnitsIconsListService } from "../services/svg-units-icons-list.service";
import { entityType } from "./entitiesType";
import { EntityPoint } from "./entity-point.class";
import { EntityOptions } from "./entity.class";

export class EntityUnit<GeomType extends Geometry = Geometry>  extends EntityPoint{
    // entityOptions: UnitOptions

  constructor(svgService: SVGUnitsIconsListService,entityOptions:UnitOptions,public opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
      super(svgService,entityOptions,opt_geometryOrProperties,id);
      this.entityType = entityType.unit
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

      // this.setStyle(null)
      this.style = new Style({image:icon});
      this.setStyle(this.getCustomStyle());
  }
  
  copy(): EntityUnit{
    var copyEntity = new EntityUnit(this.svgService,<UnitOptions>this.entityOptions,this.opt_geometryOrProperties)
    copyEntity._id = this._id;
    return copyEntity;
  }
}



export class UnitOptions extends EntityOptions{
    frame:FeatureForSelector;
    main:FeatureForSelector[];
    sector1:FeatureForSelector;
    sector2:FeatureForSelector;
    level:FeatureForSelector;
  
    constructor(){
      super();
      this.frame = null;
      this.main = [];
      this.sector1 = null;
      this.sector2 = null;
      this.level = null;
    }
  }
  