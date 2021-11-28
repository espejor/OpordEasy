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

  constructor(svgService: SvgIconsListService,entityOptions:EntityOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
    super(entityOptions,svgService,opt_geometryOrProperties,id);
    this.entityType = entityType.point
    // this.map = mapComponent.map;
    // this.entityOptions = entityOptions;

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
  
  // getCoordinate():Coordinate{
  //   return this.coordinates[0];
  // }

  // public getLocation(){
  //   return Proj.toLonLat((<Point>this.getGeometry()).getCoordinates());
  // }    
  // Métodos handle event no declarados en la Clase padre   
  onMouseUp(ev:MouseEvent):void{};


  
}