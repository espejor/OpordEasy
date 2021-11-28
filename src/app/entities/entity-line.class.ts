import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import { Color } from "ol/color";
import Stroke from "ol/style/Stroke";
import LineString from "ol/geom/LineString";
import { Entity, EntityOptions } from "./entity.class";
import { entityType } from "./entitiesType";
import Point from "ol/geom/Point";
import { getInterpolationArgsLength } from "@angular/compiler/src/render3/view/util";
import { EntitiesDeployedService } from "../services/entities-deployed.service";
import ImageStyle from "ol/style/Image";
import Icon from "ol/style/Icon";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { IconRegisterService } from "../services/icon-register.service";
import { AppInjector } from "../app.module";
import { angleBetweenPixels, distanceBetweenPixels, offsetFromPixel } from "../utilities/pixels-geometry";
import MultiPoint from "ol/geom/MultiPoint";
import { UrlSegment } from "@angular/router";

export class EntityLine<GeomType extends Geometry = Geometry> extends Entity{
  // private style: Style;

  public lineColor: Color = [0,0,0];
  public lineWidth: number = 2;

  public name: string = "";
  private type: string = "PL";
  public textColor: Color = [255,255,255];
  // features of text
  private placement = "line";
  public textAlign = "center";
  public textBaseline = "hanging";
  public scale = 1.5;
  private lineJoin:CanvasLineJoin = "round";
  public rotateWithView = false;

  protected startTextStyle : Style;
  protected endTextStyle : Style;
  protected centralTextStyle : Style;

  protected styles: Style[] = [];
  // start: Point;
  // end:Point;
  // rotation: number;
  stroke:Stroke = new Stroke({width:0.7});
  pointStyle: Style;
  trianglePatternStyles: Style;
  lineStyle: Style;
  map: any;

  constructor(lineOptions?:LineOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
    super(lineOptions,null,opt_geometryOrProperties,id);
    this.entityType = entityType.line
    // this.entityOptions = lineOptions;

    // this.centralText = new Style({text:new Text({text:"Central"})});
    // this.borderText = new Style({text:new Text({text:"Lateralxxxxxxxxxxxxxxxxxxxxxxxxx"})});

    this.map = AppInjector.get(EntitiesDeployedService).getMapComponent().map;

    if(lineOptions){
      this.name = lineOptions.name;
      this.type = lineOptions.type;
    }
    this.lineStyle = this.getStyle()
    this.centralTextStyle = this.configureCentralText();
    this.startTextStyle = this.configureStartText();
    this.endTextStyle = this.configureEndText();
    this.pointStyle = this.getPoint()
    this.trianglePatternStyles = this.createTrianglePattern();
    this.styles.push(this.centralTextStyle);
    this.styles.push(this.startTextStyle);
    this.styles.push(this.endTextStyle);
    this.styles.push(this.lineStyle);
    this.styles.push(this.pointStyle);
    // if(this.map)
      this.styles.push(this.trianglePatternStyles);
    this.setStyle(this.styles);
  }


  createTrianglePattern():Style {
    var stylesList:Style[] = [];
    const entity = this;
    const wide = 20; // pixels
    const gap = 10;  // pixels
    class PointsInSegment{
      coords: Coordinate[] = []
      angle: number
    }
    var pointsCollection:PointsInSegment[] = [];
    const map = AppInjector.get(EntitiesDeployedService).getMapComponent().map;
    var coords:Coordinate[] = []
    var angle = 0
    const patternStyle:Style = new Style({
      geometry: (feature) => {
        var line = <LineString>feature.getGeometry();
        coords = []
        line.forEachSegment(function(from,to){
          var pointsInSegment:PointsInSegment = new PointsInSegment();
          pointsCollection.push (pointsInSegment); 
          const fromPx = map.getPixelFromCoordinate(from);
          const toPx = map.getPixelFromCoordinate(to);
          const distance = distanceBetweenPixels(fromPx,toPx);
          angle = angleBetweenPixels(fromPx,toPx);
          const nShapes = Math.round((distance + gap)/(wide + gap));  // número de repeticiones
          for (let i = 0; i < nShapes; i++) {
            const coordinate = map.getCoordinateFromPixel(offsetFromPixel(fromPx,(wide + gap ) * i,angle));
            pointsInSegment.coords.push(coordinate);
            coords.push(coordinate)
          }
          pointsInSegment.angle = angle;
        })
        const mp = new MultiPoint(coords);
        patternStyle.getImage().setRotation(angle + Math.PI)
        return mp
      }, 
      image: new Icon({
        opacity: 1,
        size:[20,20],
        src: "assets/patterns/triangle.svg",
        scale: 1,
        anchor:[1,1]
      })   
    })
    return patternStyle;
  }

  getIcon():Icon{
    return new Icon({
      opacity: 1,
      size:[20,20],
      src: "assets/patterns/triangle.svg",
      scale: 1,
      // rotation: pointsCollection[i].angle
    })
  }

  getShape(location:Coordinate,angle:number): Style {
    return new Style({
      geometry: new Point(location), 
      image: new Icon({
        opacity: 1,
        size:[20,20],
        src: "assets/patterns/triangle.svg",
        scale: 1,
        anchor:[0.3,1],
        rotation: angle
      })
    })
  }
  
  getPoint(): Style {
    // const svg = '<svg width="80" height="80" version="1.1" xmlns="http://www.w3.org/2000/svg">  <path fill="transparent" stroke="black" stroke-width="2" d=" m40,15 a20,20 0 1 0 1,0z m-13,6l28,28m-28,0l28,-28"/></svg>'  
    // const end = this.getEntityGeometry().getLastCoordinate();
    // var base64Svg = btoa(unescape(encodeURIComponent("assets/icons/points/command/control_point.svg")));
    return new Style({
      geometry: function(feature){
        const location = (<LineString>feature.getGeometry()).getFirstCoordinate()
        const point = new Point(location)
        const start = new Point((<LineString>feature.getGeometry()).getFirstCoordinate());
        const end = new Point((<EntityLine>feature).getCoordinates()[1]);
        const rotation = (<EntityLine>feature).getOrientation(end, start);
        (<EntityLine>feature).pointStyle.getImage().setRotation(-rotation);
        return point;
      }, 
      image: new Icon({
        opacity: 1,
        size:[80,80],
        src: "assets/icons/points/command/contact_point.svg",
        scale: 0.5,
        anchor:[0.3,1]
      })      
    })
  }

  getOrientation(start:Point,end:Point): number{
    const dx = end.getCoordinates()[0] - start.getCoordinates()[0];
    const dy = end.getCoordinates()[1] - start.getCoordinates()[1];
    return Math.atan2(dy, dx);
  }

  public configureCentralText():Style{
    return new Style({
      text:new Text({
        text:"BAZR",
        placement: this.placement,
        textAlign: "center",
        textBaseline: this.textBaseline,
        offsetY:7,
        scale:this.scale
      })
    });
  }

  
  public configureStartText():Style{
    // const start = new Point(this.getEntityGeometry().getFirstCoordinate());
    // const end = new Point(this.getEntityGeometry().getCoordinates()[1]);
    // const rotation = this.getOrientation(end , start);
    const text: string = this.type + " " + this.name; 
    return new Style({
      geometry: function(feature){
        const start = new Point((<LineString>feature.getGeometry()).getFirstCoordinate());
        const end = new Point((<EntityLine>feature).getCoordinates()[1]);
        const rotation = (<EntityLine>feature).getOrientation(end, start);
        (<EntityLine>feature).startTextStyle.getText().setRotation(-rotation);
        return new Point((<LineString>feature.getGeometry()).getFirstCoordinate())
      } ,
      text:new Text({
        stroke: this.stroke,
        text: this.type + " " + this.name,
        // placement: "point",
        // textAlign: "start",
        // textBaseline: "middle",
        offsetX: text.length * 5,
        // offsetY: 50,
        rotateWithView:true,
        // rotation: -rotation, 
        // overflow:true,
        padding:[10,10,10,10],
        scale:this.scale
      })
    });
  }  

  public configureEndText():Style{

    const text: string = this.type + " " + this.name; 
    const style = new Style({
      geometry: function(feature){
        const start = new Point((<EntityLine>feature).getPenultimate());
        const end = new Point((<EntityLine>feature).getEntityGeometry().getLastCoordinate());
        const rotation = (<EntityLine>feature).getOrientation(end, start);
        (<EntityLine>feature).endTextStyle.getText().setRotation(-rotation);
        return new Point((<LineString>feature.getGeometry()).getLastCoordinate());
      } ,
      text:new Text({
        stroke: this.stroke,
        text: text,
        // placement: "point",
        // textAlign: "start",
        // textBaseline: "middle",
        offsetX: text.length * -5,
        // offsetY: 50,
        rotateWithView:true,
        // rotation: -rotation, 
        // overflow:true,
        padding:[10,10,10,10],
        scale:this.scale
      })
    });
    return style;
  }

 public getPattern(): Style{
  // const iconRegistry:MatIconRegistry = AppInjector.get(MatIconRegistry);
  // const sanitizer:DomSanitizer = AppInjector.get(DomSanitizer);
  // iconRegistry.addSvgIcon("contact_point", sanitizer.bypassSecurityTrustResourceUrl("assets/icons/points/command/contact_point.svg"))

  const pattern:Style = new Style({
    geometry: function(feature) {
      var line = <LineString>feature.getGeometry();
      const longInPx = 40; // 40 pixels
      var coords = [];
      line.forEachSegment(function(from, to) {
          // for each segment calculate a parallel segment with a
          // distance of 4 pixels
          var angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
          var dist = longInPx;
          var newFrom = [
              Math.sin(angle) * dist + from[0],
              -Math.cos(angle) * dist + from[1]
          ];
          var newTo = [
              Math.sin(angle) * dist + to[0],
              -Math.cos(angle) * dist + to[1]
          ];
          coords.push(newFrom);
          coords.push(newTo);
      });
      return new LineString(coords);
    },
    stroke: new Stroke({
      color: 'red',
      width:10,
      lineDash: [3, 7],
      lineCap:"butt"
    })
  })
  return pattern;
}

  public getStyle(): Style{
    this.style = new Style({      
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
  public getName(): string {
    return this.name;
  }
  public setName(value: string) {
    this.name = value;
  }

  public activateStyle(){
    this.setStyle(this.getStyle());
  }
  
  public getType(): string {
    return this.type;
  }
  public setType(value: string) {
    this.type = value;
  }
}

export class LineOptions extends EntityOptions{
  name:string;
  type:string;
}