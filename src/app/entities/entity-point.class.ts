import Geometry from "ol/geom/Geometry";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import { Color } from "ol/color";
import Point from "ol/geom/Point";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { Entity, EntityOptions } from "./entity.class";
import ImageStyle from "ol/style/Image";
import { Coordinate } from "ol/coordinate";
import { entityType } from "./entitiesType";
import { SvgIconsListService } from "../services/svg-icons-list.service";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Icon from "ol/style/Icon";
import { FeatureForDeploing, PointOptions } from "../models/feature-for-selector";

export class EntityPoint<GeomType extends Geometry = Geometry> extends Entity{
  public image: ImageStyle;
  public lineColor: Color = [0,0,0];
  public lineWidth: number = 2;
  location: Coordinate

  // features of text
  public name: string = "";
  public textColor: Color = [255,255,255];
  private placement = "point";
  public textAlign = "center";
  public textBaseline = "center";
  public scale = 1.5;
  public rotateWithView = false;
  anchor: number[] = [0.5,0.45];

  constructor(svgService: SvgIconsListService,entityOptions:EntityOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
    super(entityOptions,svgService,opt_geometryOrProperties,id);
    this.entityType = entityType.point
    // this.map = mapComponent.map;
    // this.entityOptions = entityOptions;
    var src = ""
    var scale = 0.5
    if(svgService){
      if ((<PointOptions>entityOptions).file){
        src = (<PointOptions>entityOptions).file.file
        scale = (<PointOptions>entityOptions).file.scale
      }else{
        const svgRogh = svgService.createSVG(entityOptions);
        var svg = encodeURIComponent(svgRogh);
        src = "data:image/svg+xml;charset=utf-8," + svg
      }
      // const svg = (svgService.createSVG(entityOptions));
      
      const icon = new Icon({
        anchor: this.getAnchor(),
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        opacity: 1,
        scale: scale,
        // size: [24,24],
        // color: 'black',
        src: src
      })

      // this.setStyle(null)
      this.style = new Style({image:icon});
    this.setStyle(this.getCustomStyle());
  }  
}

getAnchor(){
  return this.anchor
}

setCoordinates(coordinates: Coordinate): void {
    super.setCoordinates(coordinates)
}

  getEntityGeometry():Point{
      return <Point>super.getGeometry();
  }

  getCoordinates():Coordinate{
    return this.getEntityGeometry().getCoordinates();
  }

  getLocation(): Coordinate{
    return <Coordinate>this.location
  }

  setLocation(coordinates:Coordinate){
    this.location = coordinates;
  }
  
  public getStyle(): Style{
    this.style = new Style({
      image: this.image,      
      text: new Text({
        text: this.name,
        placement: this.placement,
        textAlign: this.textAlign,
        textBaseline: this.textBaseline,
        rotateWithView: this.rotateWithView,
        scale: this.scale,
        stroke: new Stroke({
          color: this.textColor
        })
      }),
      stroke: new Stroke({
        color: this.lineColor,
        width: this.lineWidth
      }),
      fill: new Fill({
        color: [255,0,0]
      })
    });
    return this.style;
  }
  

  // Métodos handle event no declarados en la Clase padre   
  onMouseUp(ev:MouseEvent):void{};
  
}
