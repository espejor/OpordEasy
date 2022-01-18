import Geometry from "ol/geom/Geometry";
import { FeatureForDeploing } from "../models/feature-for-selector";
import { SVGUnitsIconsListService } from "../services/svg-units-icons-list.service";
import { entityType } from "./entitiesType";
import { EntityPoint } from "./entity-point.class";
import { EntityOptions } from "./entity.class";

export class EntityUnit<GeomType extends Geometry = Geometry>  extends EntityPoint{
    // entityOptions: UnitOptions

  constructor(svgService: SVGUnitsIconsListService,entityOptions:UnitOptions,public opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
      super(<SVGUnitsIconsListService>svgService,entityOptions,opt_geometryOrProperties,id);
      this.entityType = entityType.unit
  }

  getAnchor(): number[] {
    if (this.isCG())
      return [0.37,1]
    return super.getAnchor()
  }

  isCG():boolean {
    if ((<UnitOptions>this.entityOptions).extraData)
      return (<UnitOptions>this.entityOptions).extraData.some(f => f.key == "cgSymbol");
    return false
  }
  
  copy(): EntityUnit{
    var copyEntity = new EntityUnit(<SVGUnitsIconsListService>this.svgService,<UnitOptions>this.entityOptions,this.opt_geometryOrProperties)
    copyEntity._id = this._id;
    return copyEntity;
  }
}



export class UnitOptions extends EntityOptions{
    frame:FeatureForDeploing;
    main:FeatureForDeploing[];
    sector1:FeatureForDeploing;
    sector2:FeatureForDeploing;
    level:FeatureForDeploing;

    extraData:FeatureForDeploing[]
    // {designation?:TextInUnitOptions,heighterUnit?:TextInUnitOptions,designation?:TextInUnitOptions,designation?:TextInUnitOptions}
  
    constructor(){
      super();
      this.attachable = true;
      this.frame = null;
      this.main = [];
      this.sector1 = null;
      this.sector2 = null;
      this.level = null;
      this.extraData = [];
    }
  }
  