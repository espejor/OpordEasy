import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import { Color } from "ol/color";
import Stroke from "ol/style/Stroke";
import LineString from "ol/geom/LineString";
import { Entity } from "./entity.class";
import { entityType } from "./entitiesType";

export class EntityLine<GeomType extends Geometry = Geometry> extends Entity{
    // private style: Style;

    public lineColor: Color = [0,0,0];
    public lineWidth: number = 2;

    public textLine: string = "";
    public textColor: Color = [255,255,255];
    // features of text
    private placement = "line";
    public textAlign = "center";
    public textBaseline = "hanging";
    public scale = 1.5;
    private lineJoin:CanvasLineJoin = "round";
    public rotateWithView = false;

    constructor(opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
      super(null,opt_geometryOrProperties,id);
      this.entityType = entityType.line
    }

    public getStyle(): Style{
      this.style = new Style({      
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
          width: this.lineWidth,
          lineJoin: this.lineJoin
        })
      });
      return this.style;
    }

    
  getCoordinates():Coordinate[]{
    return this.getEntityGeometry().getCoordinates();
  }

    getEntityGeometry():LineString{
      return <LineString>super.getGeometry();
    }


    public getCoordinate(index:number):Coordinate{
      var coordinates:Coordinate[] = (<LineString>this.getGeometry()).getCoordinates();
      return coordinates[index];
    }

    
    public getEnd():Coordinate{
        var coordinates: Coordinate[] = (<LineString>this.getGeometry()).getCoordinates();
        var dim = coordinates.length;
        return coordinates[dim - 1];
    }
    public getPenultimate():Coordinate{
        var coordinates: Coordinate[] = (<LineString>this.getGeometry()).getCoordinates();
        var dim = coordinates.length;
        return coordinates[dim - 2];
    }
    public getStart():Coordinate{
        var coordinates: Coordinate[] = (<LineString>this.getGeometry()).getCoordinates();
        return coordinates[0];
    }
    public getTextLine(): string {
      return this.textLine;
    }
    public setTextLine(value: string) {
      this.textLine = value;
    }

    public activateStyle(){
      this.setStyle(this.getStyle());
    }
}