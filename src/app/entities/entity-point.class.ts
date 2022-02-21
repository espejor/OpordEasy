import Geometry from "ol/geom/Geometry";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import { Color } from "ol/color";
import Point from "ol/geom/Point";
import Stroke from "ol/style/Stroke";
import { Entity, EntityOptions } from "./entity.class";
import ImageStyle from "ol/style/Image";
import { Coordinate } from "ol/coordinate";
import { entityType } from "./entitiesType";
import { SvgIconsListService } from "../services/svg-icons-list.service";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Icon from "ol/style/Icon";
import { PointOptions } from "../models/feature-for-selector";

export class EntityPoint<GeomType extends Geometry = Geometry> extends Entity{
  public image: ImageStyle;
  public override lineColor: Color = [0,0,0];
  public override lineWidth: number = 2;
  override location: Coordinate

  // features of text
  public name: string = "";
  public textColor: Color = [255,255,255];
  private placement = "point";
  public textAlign = "center";
  public textBaseline = "center";
  public scale = 1.5;
  public rotateWithView = false;
  anchor: number[] = [0.5,0.45];
  stroke: Stroke;
  num:string
  typePoint: string;
  unit: string;
  info: string;
  dateTime: string;
  styles:Style[] = []
  offset: [number,number];
  numberStyle: Style;
  typePointStyle: Style;
  src: string;
  iconScale: number;
  typeDeploy: string;

  constructor(public override svgService: SvgIconsListService,entityOptions:EntityOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
    super(entityOptions,svgService,opt_geometryOrProperties,id);
    this.entityType = entityType.point
    this.src = ""
    this.iconScale = 0.5
    this.stroke = new Stroke({
      color: [0,0,0],
      width: 1
    })


    this.updateOptions()

    if(svgService){
      this.encodeSVG(svgService)
      

      const offsetX = this.offset? this.offset[0]:0 
      const offsetY = this.offset? this.offset[1]:0 

      this.numberStyle =  new Style({
        geometry:(feature:EntityPoint) => {
          // feature.updateOptions()
          feature.numberStyle.getText().setText(feature.num)
          return feature.getGeometry()
        },
        text:new Text({
          stroke: this.stroke,
          text: this.num,
          scale:this.scale * 0.7,
          offsetX:offsetX,
          offsetY:offsetY
        })
      });

      const icon = this.createIcon()
      
      this.typePointStyle = new Style({
        geometry:(feature:EntityPoint) => {
          // feature.updateOptions()
          feature.typePointStyle.getText().setText(feature.typePoint)
          return feature.getGeometry()
        },
        image:this.createIcon(),
        text:new Text({
          text:this.typePoint,
          scale:this.scale *0.5,
          stroke:this.stroke,
          offsetY:-20,
        })
      }) 


      var stylesFunction = (feature:EntityPoint) => {
        const styles: Style[] = []
        feature.updateOptions()

        styles.push(this.numberStyle);
        styles.push(this.typePointStyle)
        return styles
      }
      this.setStyle(stylesFunction);
    }  
  }

  createIcon():Icon{
    return new Icon({
      anchor: this.getAnchor(),
      anchorXUnits: IconAnchorUnits.FRACTION,
      anchorYUnits: IconAnchorUnits.FRACTION,
      opacity: 1,
      scale: this.iconScale,
      src: this.src
    })
  }

  override getVerbose(): string {
      return this.entityOptions.verbose?this.entityOptions.verbose:this.entityOptions.typeEntity
  }

  override getSvgSvcFieldsOfExtraData(){
    return null
  }

  getHTMLCodeForIconTimeline(): string {
    const txt = this.num?this.num:" "
    const typePoint = this.typePoint?this.typePoint:" "
    const designationObj = {designation:txt,offset:[0,-50]}
    const typeObj = {type:typePoint,offset:[0,-40]}
    if(this.typeDeploy == "file"){
      return this.svgService.createSVGForTimeLineFromFile(this.entityOptions.file.file,typeObj,designationObj)
    }
    if(this.typeDeploy == "path")
      return this.svgService.createSVGForTimeline(this,0.5)
    
    return ""

  }
  
  getIdent(): string {
      return this.num?this.num + "":""
  }

  encodeSVG(svgService: SvgIconsListService) {
    if ((<PointOptions>this.entityOptions).file){
      this.src = (<PointOptions>this.entityOptions).file.file
      this.iconScale = (<PointOptions>this.entityOptions).file.scale
      this.anchor = (<PointOptions>this.entityOptions).file.anchor? (<PointOptions>this.entityOptions).file.anchor: this.anchor
    }else{
      const svgRogh = svgService.createSVG(this.entityOptions);
      var svg = encodeURIComponent(svgRogh);
      this.src = "data:image/svg+xml;charset=utf-8," + svg
    }
  }

updateOptions() {    
  const entityOptions = this.entityOptions 
  if(entityOptions){
    this.typeDeploy = entityOptions.type
    if ((<PointOptions>entityOptions).extraData){
      if ((<PointOptions>entityOptions).extraData.numbers){
        this.num = "" + (<PointOptions>entityOptions).extraData.numbers.num.value
        this.offset = (<PointOptions>entityOptions).extraData.numbers.num.offset
      }
      if ((<PointOptions>entityOptions).extraData.lists)
        this.typePoint = (<PointOptions>entityOptions).extraData.lists.type.value
      if ((<PointOptions>entityOptions).extraData.textFields){
        this.unit = (<PointOptions>entityOptions).extraData.textFields.unit.value
        this.info = (<PointOptions>entityOptions).extraData.textFields.info.value
        this.dateTime = (<PointOptions>entityOptions).extraData.textFields.dateTime.value
      }
    }
  }

}

getType(): string {
  return ("Punto");
}
getAnchor(){
  return this.anchor
}

  override setCoordinates(coordinates: Coordinate): void {
    super.setCoordinates(coordinates)
}

  getEntityGeometry():Point{
      return <Point>super.getGeometry();
  }

  getCoordinates():Coordinate{
    return this.getEntityGeometry().getCoordinates();
  }

  override getLocation(): Coordinate{
    return <Coordinate>this.location
  }

  setLocation(coordinates:Coordinate){
    this.location = coordinates;
  }
  
  // public getBasicStyle(): Style{
  //   this.style = new Style({
  //     image: this.image,      
  //     text: new Text({
  //       text: this.name,
  //       placement: this.placement,
  //       textAlign: this.textAlign,
  //       textBaseline: this.textBaseline,
  //       rotateWithView: this.rotateWithView,
  //       scale: this.scale,
  //       stroke: new Stroke({
  //         color: this.textColor
  //       })
  //     }),
  //     stroke: new Stroke({
  //       color: this.lineColor,
  //       width: this.lineWidth
  //     }),
  //     fill: new Fill({
  //       color: [255,0,0]
  //     })
  //   });
  //   return this.style;
  // }
  

  // Métodos handle event no declarados en la Clase padre   
  
  onMouseUp(ev:MouseEvent):void{};
  
}
