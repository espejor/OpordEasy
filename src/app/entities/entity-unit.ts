import Geometry from "ol/geom/Geometry";
import { Style, Text } from "ol/style";
import { StyleFunction, StyleLike } from "ol/style/Style";
import { CombatFunction, FeatureForDeploing } from "../models/feature-for-selector";
import { SVGUnitsIconsListService, UnitExtraOptions } from "../services/svg-units-icons-list.service";
import { entityType } from "./entitiesType";
import { EntityPoint } from "./entity-point.class";
import { EntityOptions } from "./entity.class";

export class EntityUnit<GeomType extends Geometry = Geometry>  extends EntityPoint{
  designation: string;
  heighterunit: string;
  typeEquipment: string;
  reinforced: string;
  designationStyle:StyleLike;
  
  combatFunction: CombatFunction
    // entityOptions: UnitOptions

  constructor(svgService: SVGUnitsIconsListService,entityOptions:UnitOptions,public opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
      super(<SVGUnitsIconsListService>svgService,entityOptions,opt_geometryOrProperties,id);
      this.entityType = entityType.unit
      // if (!this.entityOptions.extraData)
        // this.initExtraData()
      const designationStyle = (feature:EntityUnit) =>{
        const styles:Style[] = []
        
        if(feature.entityOptions.extraData && feature.entityOptions.extraData.fields.textFields.designation){
          styles.push(new Style({
            text : new Text({
              text:    feature.entityOptions.extraData.fields.textFields.designation.value,
              offsetX: this.getOffsetX(feature.entityOptions.extraData.fields.textFields.designation.offset),
              offsetY: this.getOffsetY(feature.entityOptions.extraData.fields.textFields.designation.offset),
              scale:   0.9,
              textAlign:feature.entityOptions.extraData.fields.textFields.designation.indent})
          }))
        }
        
        if(feature.entityOptions.extraData && feature.entityOptions.extraData.fields.check){
          styles.push(new Style({
            text : new Text({
              text:    feature.entityOptions.extraData.fields.check.reinforced.value,
              offsetX: this.getOffsetX(feature.entityOptions.extraData.fields.check.reinforced.offset),
              offsetY: this.getOffsetY(feature.entityOptions.extraData.fields.check.reinforced.offset),
              scale:   0.9,
              textAlign:feature.entityOptions.extraData.fields.check.reinforced.indent})
          }))
        }
        styles.push(this.typePointStyle)
        return styles
      }

      this.setStyle(designationStyle)
  }
  initExtraData() {
    this.entityOptions.extraData = {}
  }

  getCombatFunction():string{
    const features = (<UnitOptions>this.entityOptions).main
    for(let i = 0;i < features.length; i++){
      const feature =  features[i]
      if (feature.value.combatFunction == "support")
        return "support"
    }
    return "combat"
  }

  getVerbose():string{
    var verbose = ""
    const unitOptions = (<UnitOptions>this.entityOptions)
    verbose += this.checkVAlternateVerbose("level") + " de "
    
    for(let i = 0; i < unitOptions.main.length; i++){
      const feature = unitOptions.main[i]
      verbose += feature.value.selectorText + " "
    }
    verbose += this.getIdent()

    return verbose
  }

  private checkVAlternateVerbose(group:string){
    const unitOptions = (<UnitOptions>this.entityOptions)
    // const option = unitOptions[group].key
    var value:string = ""
    if(unitOptions[group].value.alternatesVerbose){
      for (let i = 0; i< unitOptions[group].value.alternatesVerbose.length; i++){
        const alternative = unitOptions[group].value.alternatesVerbose[i]
        if (unitOptions [alternative.group]){
          const exist = unitOptions [alternative.group].some(option =>{
            return option.key == alternative.option
          }) 
          if (exist){
            return value != ""? value : alternative.value
          }
        }
      };
    }
    return value != ""? value:unitOptions[group].value.selectorText
  }
  getHTMLCodeForIconTimeline(): string {
    return this.svgService.createSVGForTimeline(this,0.5)
  }

  
  getOffsetX(offset:number[]): number {
    if(this.isCG())
      return offset[0] + 18 
    return offset[0]
  }
  getOffsetY(offset:number[]): number {
    if(this.isCG())
      return offset[1] - 34 
    return offset[1]
  }

  getIdent():string {
      return this.designation?this.designation:""
  }

  getType(): string {
    return ("Unidad");
  }
  
  getAnchor(): number[] {
    if (this.isCG())
      return [0.37,1]
    return super.getAnchor()
  }

  isCG():boolean {
    if ((<UnitOptions>this.entityOptions).extraFeature)
      return (<UnitOptions>this.entityOptions).extraFeature.some(f => f.key == "cgSymbol");
    return false
  }
  
  copy(): EntityUnit{
    var copyEntity = new EntityUnit(<SVGUnitsIconsListService>this.svgService,<UnitOptions>this.entityOptions,this.opt_geometryOrProperties)
    copyEntity._id = this._id;
    return copyEntity;
  }

  updateOptions() {    
    const entityOptions:UnitOptions = <UnitOptions>this.entityOptions 
    if(entityOptions){
      if (entityOptions.extraData){
        if (entityOptions.extraData.fields.numbers){
          this.num = "" + entityOptions.extraData.fields.numbers.num.value
          this.offset = entityOptions.extraData.fields.numbers.num.offset
        }
        if (entityOptions.extraData.fields.lists)
          this.typePoint = entityOptions.extraData.fields.lists.type?entityOptions.extraData.fields.lists.type.value:null
        
        if (entityOptions.extraData.fields.check)
          this.reinforced = entityOptions.extraData.fields.check.reinforced?entityOptions.extraData.fields.check.reinforced.value:null
  
        if (entityOptions.extraData.fields.textFields){
          this.designation = entityOptions.extraData.fields.textFields.designation?entityOptions.extraData.fields.textFields.designation.value:null
          this.heighterunit = entityOptions.extraData.fields.textFields.heighterunit?entityOptions.extraData.fields.textFields.heighterunit.value:null
          this.dateTime = entityOptions.extraData.fields.textFields.dateTime?entityOptions.extraData.fields.textFields.dateTime.value:null
          this.typeEquipment = entityOptions.extraData.fields.textFields.typeEquipment?entityOptions.extraData.fields.textFields.typeEquipment.value:null
        }
        this.encodeSVG(this.svgService)
      }
    }
  
  }

}



export class UnitOptions extends EntityOptions{
    frame:FeatureForDeploing;
    main:FeatureForDeploing[];
    sector1:FeatureForDeploing;
    sector2:FeatureForDeploing;
    level:FeatureForDeploing;

    extraFeature?:FeatureForDeploing[];

    extraData:UnitExtraOptions  

    constructor(){
      super();
      this.attachable = true;
      this.frame = null;
      this.main = [];
      this.sector1 = null;
      this.sector2 = null;
      this.level = null;
      this.extraData = null;
      this.extraFeature = []
    }
  }
  