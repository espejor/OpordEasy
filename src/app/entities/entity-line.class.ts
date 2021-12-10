import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Style, { StyleFunction } from "ol/style/Style";
import Text from "ol/style/Text";
import { Color } from "ol/color";
import Stroke from "ol/style/Stroke";
import LineString from "ol/geom/LineString";
import { Entity, EntityOptions } from "./entity.class";
import { entityType } from "./entitiesType";
import Point from "ol/geom/Point";
import { EntitiesDeployedService } from "../services/entities-deployed.service";
import Icon from "ol/style/Icon";
import { AppInjector } from "../app.module";
import { angleBetweenPixels, distanceBetweenPixels, offsetFromPixel } from "../utilities/pixels-geometry";
import MultiPoint from "ol/geom/MultiPoint";
import ol_coordinate_cspline from "ol-ext/render/Cspline";

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
  protected centralIconStyle : Style;
  protected purposeEndStyle : Style;
  protected purposeStartStyle: Style;

  protected styles: StyleFunction;
  // start: Point;
  // end:Point;
  // rotation: number;
  stroke:Stroke = new Stroke({width:0.7});
  pointStyle: Style;
  trianglePatternStyles: Style;
  lineStyle: Style;
  // map: any;  

  // pattern: string = "assets/patterns/triangle.svg";
  pattern: string = "assets/patterns/friendly_present.svg";
  anchor: number[] = [1,1];

  lineOptions:LineOptions;
  smooth: boolean = true;

  constructor(lineOptions?:LineOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
    super(lineOptions,null,opt_geometryOrProperties,id);
    this.entityType = entityType.line
    this.lineOptions = lineOptions;

    if (this.smooth){
      // this.setCoordinates(ol_coordinate_cspline(this.getCoordinates()))
    }

    if(lineOptions){
      this.name = lineOptions.name;
      this.type = lineOptions.typeLine;
    }
    this.lineStyle = this.getStyle()
    // this.centralIconStyle = this.configureCentralIcon(lineOptions.echelon);
    this.startTextStyle = this.configureStartText();
    this.endTextStyle = this.configureEndText();
    this.purposeEndStyle = this.configureEndPurposeText();
    this.purposeStartStyle = this.configureStartPurposeText();
    this.pointStyle = this.getPoint()
    // this.trianglePatternStyles = this.createTrianglePattern();
    const entity = this;

    var stylesFunction = function(feature:Feature){
      const styles: Style[] = []
      if(lineOptions.echelon)
        styles.push(...entity.configureCentralIcon(feature,lineOptions.echelon,lineOptions.svgWidth));
      styles.push(entity.startTextStyle);
      styles.push(entity.endTextStyle);
      if (lineOptions. lineVisible)
        styles.push(entity.lineStyle);
      styles.push(entity.pointStyle);
      if(lineOptions.pattern)
        styles.push(...entity.createPattern(feature));
      if(lineOptions.purpose){
        styles.push(entity.purposeEndStyle);
        styles.push(entity.purposeStartStyle);
      }
      return styles
    }

    // this.getGeometry().cspline()

    if(lineOptions){
      this.styles = stylesFunction;
      this.setStyle(this.styles)
    }
  }

  

  createPattern(feature:Feature):Style[] {
    const entity = this;
    var stylesList:Style[] = [];
    const wide = 20; // pixels
    const gap = 0;  // pixels
    const map = AppInjector.get(EntitiesDeployedService).getMapComponent().map;
    var coords:Coordinate[] = []
    var angle = 0
    var line:LineString = <LineString>feature.getGeometry();

    line.forEachSegment(function(from,to){
      coords = []
      const fromPx = map.getPixelFromCoordinate(from);
      const toPx = map.getPixelFromCoordinate(to);
      const distance = distanceBetweenPixels(fromPx,toPx);
      angle = angleBetweenPixels(fromPx,toPx);
      const nShapes = ((distance + gap)/(wide + gap));  // número de repeticiones
      const mod = nShapes - Math.floor(nShapes);
      const initialGap = mod * wide/2
      for (let i = 0; i < nShapes-1; i++) {
        const coordinate = map.getCoordinateFromPixel(offsetFromPixel(fromPx,((wide + gap ) * i )+ initialGap,angle));
        coords.push(coordinate)
      }
      // const lastCoord = coords.splice(length-1,1)
      const mp = new MultiPoint(coords)
      var mpStyle = new Style({
        geometry: mp,
         
        image: new Icon({
          opacity: 1,
          size:[20,20],
          src: entity.pattern,
          scale: 1,
          anchor:entity.anchor,
          rotation:angle + Math.PI
        })   
      })

      stylesList.push(mpStyle)

    })
    return stylesList;
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

  public configureCentralIcon(feature:Feature,imageSrc:string,svgWidth:number):Style[]{
    var styles:Style[] = [];
    (<LineString>feature.getGeometry()).forEachSegment((from,to) => {
      const centre = [(from[0] + to[0])/2,(from[1] + to[1])/2]
      const rotation = Math.atan2(to[1] - from[1], to[0] - from[0]);
      styles.push(new Style({
        geometry: new Point(centre), 
        image: new Icon({
          opacity: 1,
          // size:[80,80],
          src: "assets/icons/ghost_line.svg",
          // scale: 1,
          anchor:[0.5,0.5],
          rotation: -rotation,
          scale:[svgWidth,1]
        })      
      }))
      styles.push(new Style({
        geometry: new Point(centre), 
        image: new Icon({
          opacity: 1,
          // size:[80,80],
          src: imageSrc,
          scale: 1,
          anchor:[0.5,0.5]
        })      
      }))
    })

    return styles
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

  public configureEndPurposeText():Style{
    if(this.lineOptions.purpose){
      const text: string = this.lineOptions.purpose; 
      const style = new Style({
        geometry: function(feature){
          const start = new Point((<EntityLine>feature).getPenultimate());
          const end = new Point((<EntityLine>feature).getEntityGeometry().getLastCoordinate());
          const rotation = (<EntityLine>feature).getOrientation(end, start);
          (<EntityLine>feature).purposeEndStyle.getText().setRotation(-rotation);
          return new Point((<LineString>feature.getGeometry()).getLastCoordinate());
        } ,
        text:new Text({
          stroke: this.stroke,
          text: text,
          // placement: "point",
          // textAlign: "start",
          // textBaseline: "middle",
          offsetX: text.length * 5,
          offsetY: -7,
          rotateWithView:true,
          // rotation: -rotation, 
          // overflow:true,
          padding:[10,10,10,10],
          scale:this.scale
        })
      });
      return style;
    }
    return null
  }

  public configureStartPurposeText():Style{
    if(this.lineOptions.purpose){
      const text: string = this.lineOptions.purpose; 
      const style = new Style({
        geometry: function(feature){
          const start = new Point((<LineString>feature.getGeometry()).getFirstCoordinate());
          const end = new Point((<EntityLine>feature).getCoordinates()[1]);
          const rotation = (<EntityLine>feature).getOrientation(end, start);
          (<EntityLine>feature).purposeStartStyle.getText().setRotation(-rotation);
          return new Point((<LineString>feature.getGeometry()).getFirstCoordinate())
        } ,
        text:new Text({
          stroke: this.stroke,
          text: text,
          // placement: "point",
          // textAlign: "start",
          // textBaseline: "middle",
          offsetX: text.length * -5,
          offsetY: -7,
          rotateWithView:true,
          // rotation: -rotation, 
          // overflow:true,
          padding:[10,10,10,10],
          scale:this.scale
        })
      });
      return style;
    }
    return null
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

  // public activateStyle(){
  //   this.setStyle(this.getStyle());
  // }
  
  public getType(): string {
    return this.type;
  }
  public setType(value: string) {
    this.type = value;
  }
}

export class LineOptions extends EntityOptions{
  name?:string;   //T field
  typeLine?:string; // LL, PL ...
  purpose?:string;  // RFL...
  pattern?:string;  // 
  coordinationMessures?:string;  // p.e. Controlling HQ
  dateTimeGroupInitial?: string;  //
  dateTimeGroupFinal?: string;  //
  lineVisible?: boolean; // Si la línea se ha de ver ()
  echelon?:string;
  svgWidth?:number
}
