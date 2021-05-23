import { Feature, Map } from "ol";
import Geometry from "ol/geom/Geometry";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import * as Proj from 'ol/proj';
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import { Color } from "ol/color";
import Point from "ol/geom/Point";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { Entity, EntityOptions } from "./entity.class";
import ImageStyle from "ol/style/Image";
import { SVGUnitsIconsListService } from "../services/svg-units-icons-list.service";
import { PointOptions } from "../components/point-selector/point-selector.component";

export class EntityPoint<GeomType extends Geometry = Geometry> extends Entity{

  public image: ImageStyle;
  public lineColor: Color = [0,0,0];
  public lineWidth: number = 2;

  public textLine: string = "";
  public textColor: Color = [255,255,255];
  // features of text
  private placement = "point";
  public textAlign = "center";
  public textBaseline = "center";
  public scale = 1.5;
  public rotateWithView = false;

    constructor(public mapComponent: OlMapComponent,entityOptions:EntityOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any }) {
      super(mapComponent,opt_geometryOrProperties);
      this.map = mapComponent.map;
    }

    
    public getStyle(): Style{
      this.style = new Style({
        image: this.image,      
        text: new Text({
          text: this.textLine,
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
    

    public getLocation(){
      return Proj.toLonLat((<Point>this.getGeometry()).getCoordinates());
    }    
    // Métodos handle event no declarados en la Clase padre   
    onMouseUp(ev:MouseEvent):void{};
}