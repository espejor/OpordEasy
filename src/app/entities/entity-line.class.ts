import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Style, { StyleFunction } from "ol/style/Style";
import Text from "ol/style/Text";
import { Color } from "ol/color";
import Stroke from "ol/style/Stroke";
import LineString from "ol/geom/LineString";
import { Entity, Pattern } from "./entity.class";
import { entityType } from "./entitiesType";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";
// import { AppInjector } from "../app.module";
import { angleBetweenPixels, distanceBetweenPixels, offsetFromPixel } from "../utilities/pixels-geometry";
import MultiPoint from "ol/geom/MultiPoint";
import { Globals } from "../utilities/globals";
import { LineOptions } from "../models/feature-for-selector";
import { SvgGeneralIconsListService } from "../services/svg-general-icons-list.service";

export class EntityLine<GeomType extends Geometry = Geometry> extends Entity{
  // private style: Style;

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
  // protected centralIconStyle : Style;
  protected purposeEndStyle : Style;
  protected purposeStartStyle: Style;

  protected styles: StyleFunction;
  stroke:Stroke = new Stroke({width:0.7});
  pointStyle: Style;
  trianglePatternStyles: Style;
  lineStyle: Style;
  anchor: number[] = [1,1];

  lineOptions:LineOptions;
  pattern: Pattern;
  purpose: string;
  stroke_dasharray: [number,number] = [0,0];
  order: string;
  coordination: string;
  initialDateTime:string
  finalDateTime:string
  dateTimeEndStyle: Style;
  dateTimeStartStyle: Style;
  echelon: any;
  file: any;
  verbose: string;

  constructor(lineOptions?:LineOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
    super(lineOptions,null,opt_geometryOrProperties,id);
    this.entityType = entityType.line
    this.lineOptions = lineOptions;

    this.updateData()
    this.lineStyle = this.getBasicStyle()
    this.startTextStyle = this.configureStartText();
    this.endTextStyle = this.configureEndText();
    this.purposeEndStyle = this.configureEndPurposeText();
    this.purposeStartStyle = this.configureStartPurposeText();
    this.dateTimeStartStyle = this.configureStartDateTime();
    this.dateTimeEndStyle = this.configureEndDateTime();
    // this.pointStyle = this.getPoint()
    // this.trianglePatternStyles = this.createTrianglePattern();
    const entity = this;

    var stylesFunction = function(feature:Feature){
      const styles: Style[] = []
      if(entity.echelon)
        styles.push(...entity.configureCentralIcon(feature,entity.echelon,lineOptions.svgWidth));
      if (entity.startTextStyle)
        styles.push(entity.startTextStyle);
      if (entity.endTextStyle)
        styles.push(entity.endTextStyle);
      if (lineOptions.lineVisible)
        styles.push(entity.lineStyle);
      if (entity.pointStyle)
        styles.push(entity.pointStyle);
      if(lineOptions.pattern)
        styles.push(...entity.createPattern(feature));
      if(entity.purpose){
        styles.push(entity.purposeEndStyle);
        styles.push(entity.purposeStartStyle);
      }
      if(entity.dateTimeEndStyle){
        styles.push(entity.dateTimeEndStyle);
        styles.push(entity.dateTimeStartStyle);
      }
      return styles
    }

    // this.getGeometry().cspline()

    if(lineOptions){
      this.styles = stylesFunction;
      this.setStyle(this.styles)
    }


  }

  getHTMLCodeForIconTimeline(): string {
    const txt = this.getIdent() == ""?" ":this.getIdent()
    const typeLine = this.type?this.type:" "
    const designationObj = {designation:txt,offset:[0,-50]}
    const typeObj = {type:typeLine,offset:[0,-40]}
    const file = "assets/icons/lines/" + this.file + ".svg"
    const svgService = new SvgGeneralIconsListService()
    return svgService.createSVGForTimeLineFromFile(file,typeObj,designationObj)
  }

  getIdent(): string {
    return this.name != ""?this.name:this.order?this.order:""    
  }

  getVerbose(): string {
    if(this.lineOptions.verbose)
      return this.lineOptions.verbose
    if(this.lineOptions.extraData){
      var verbose = this.lineOptions.extraData.lists.purpose?this.lineOptions.extraData.lists.purpose.value:this.lineOptions.typeLine 
      verbose +=  verbose != ""? " " + this.getIdent():this.getIdent()
      if (verbose != "")
        return verbose
    }
    if(this.lineOptions.typeLine && this.lineOptions.typeLine != "")
      return this.lineOptions.typeLine
    return this.lineOptions.typeEntity
  }
  

  updateData() {
    const lineOptions = this.lineOptions;
    if(lineOptions){
      if(lineOptions.extraData){
        if(lineOptions.extraData.textFields){
          this.name = lineOptions.extraData.textFields.name?lineOptions.extraData.textFields.name.value:undefined;
          this.coordination = lineOptions.extraData.textFields.coordination?lineOptions.extraData.textFields.coordination.value:undefined;
          this.initialDateTime = lineOptions.extraData.textFields.initDateTime?lineOptions.extraData.textFields.initDateTime.value:undefined;
          this.finalDateTime = lineOptions.extraData.textFields.finalDateTime?lineOptions.extraData.textFields.finalDateTime.value:undefined;
        }
        if(lineOptions.extraData.lists){
          this.purpose = lineOptions.extraData.lists.purpose?lineOptions.extraData.lists.purpose.value:undefined;
          this.echelon = lineOptions.extraData.lists.echelon?lineOptions.extraData.lists.echelon.value:undefined;
        }
      }
      this.type = this.purpose?this.purpose:lineOptions.typeLine;
      this.pattern = lineOptions.pattern;
      this.stroke_dasharray = lineOptions.stroke_dasharray
      this.file = lineOptions.file
      this.verbose = lineOptions.verbose
    }
  }

  createPattern(feature:Feature,shapes?:number):Style[] {
    const entity = this;
    var stylesList:Style[] = [];
    const map = Globals.MAP;
    var coords:Coordinate[] = []
    var angle = 0
    var line:LineString = <LineString>feature.getGeometry();

    line.forEachSegment(function(from,to){
      coords = []
      const fromPx = map.getPixelFromCoordinate(from);
      const toPx = map.getPixelFromCoordinate(to);
      const distance = distanceBetweenPixels(fromPx,toPx);
      angle = angleBetweenPixels(fromPx,toPx);
      const nShapes = shapes?shapes:((distance + entity.pattern.gap)/(entity.pattern.wide + entity.pattern.gap));  // número de repeticiones
      const mod = nShapes - Math.floor(nShapes);
      const initialGap = mod * entity.pattern.wide/2
      for (let i = 0; i < nShapes-1; i++) {
        const coordinate = map.getCoordinateFromPixel(offsetFromPixel(fromPx,((entity.pattern.wide + entity.pattern.gap ) * i )+ initialGap,angle));
        coords.push(coordinate)
      }
      const mp = new MultiPoint(coords)
      var mpStyle = new Style({
        geometry: mp,
         
        image: new Icon({
          opacity: 1,
          size:[20,20],
          src: entity.pattern.pattern,
          scale: 1,
          anchor:entity.pattern.anchor,
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
  
  // getPoint(): Style {
  //   return new Style({
  //     geometry: function(feature){
  //       const location = (<LineString>feature.getGeometry()).getFirstCoordinate()
  //       const point = new Point(location)
  //       const start = new Point((<LineString>feature.getGeometry()).getFirstCoordinate());
  //       const end = new Point((<EntityLine>feature).getCoordinates()[1]);
  //       const rotation = (<EntityLine>feature).getOrientation(end, start);
  //       (<EntityLine>feature).pointStyle.getImage().setRotation(-rotation);
  //       return point;
  //     }, 
  //     image: new Icon({
  //       opacity: 1,
  //       size:[80,80],
  //       src: "assets/icons/points/command/contact_point.svg",
  //       scale: 0.5,
  //       anchor:[0.3,1]
  //     })      
  //   })
  // }

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
          rotation: -rotation,
          anchor:[0.5,0.5],
          scale:[svgWidth,1]
        })      
      }))
      styles.push(new Style({
        geometry: new Point(centre), 
        image: new Icon({
          opacity: 1,
          // size:[80,80],
          src: "assets/icons/echelons/" + imageSrc + "-item.svg",
          scale: 1,
          rotation: -rotation,
          anchor:[0.5,0.5]
        })      
      }))
    })

    return styles
  }

  public configureStartText():Style{
    const text: string = this.lineOptions.typeLine + " " + this.name;
    const txt = new Text({
        stroke: this.stroke,
        text: text,
        offsetX: 10,
        textAlign:"start",
        rotateWithView:true,
        padding:[10,10,10,10],
        scale:this.scale
      })

    return new Style({
      geometry: function(feature:EntityLine){
        feature.updateData()
        const text: string = feature.lineOptions.typeLine + " " + feature.name;
        const start = new Point((<LineString>feature.getGeometry()).getFirstCoordinate());
        const end = new Point(feature.getCoordinates()[1]);
        const rotation = feature.getOrientation(end, start);
        feature.startTextStyle.getText().setRotation(-rotation);
        feature.startTextStyle.getText().setText(text)
        // feature.startTextStyle.getText().setOffsetX(text.length * 5)
        return start
      } ,
      text: txt
    });
  }  

  public configureEndText():Style{
    const text: string = this.lineOptions.typeLine + " " + this.name;
    const txt = new Text({
        stroke: this.stroke,
        text: text,
        offsetX: -10,
        rotateWithView:true,
        textAlign:"end",
        padding:[10,10,10,10],
        scale:this.scale
      })

    return new Style({
      geometry: function(feature:EntityLine){
        feature.updateData()
        const text: string = feature.lineOptions.typeLine + " " + feature.name;
        const start = new Point(feature.getPenultimate());
        const end = new Point(feature.getEntityGeometry().getLastCoordinate());
        const rotation = feature.getOrientation(end, start);
        feature.endTextStyle.getText().setRotation(-rotation);
        feature.endTextStyle.getText().setText(text)
        // feature.endTextStyle.getText().setOffsetX(text.length * -5)
        return end
      } ,
      text: txt
    });
  }

  public configureEndPurposeText():Style{
    if(this.purpose){
      const txt = new Text({
        stroke: this.stroke,
        offsetY: -7,
        offsetX: 10,
        rotateWithView:true,
        textAlign:"start",
        padding:[10,10,10,10],
        scale:this.scale
      })
  
      return new Style({
        geometry: function(feature:EntityLine){
          feature.updateData()
          const text: string = feature.purpose + " " + feature.coordination;
          const start = new Point(feature.getPenultimate());
          const end = new Point(feature.getEntityGeometry().getLastCoordinate());
          const rotation = feature.getOrientation(end, start);
          feature.purposeEndStyle.getText().setRotation(-rotation);
          feature.purposeEndStyle.getText().setText(text)
          return end
        } ,
        text: txt
      });
    }
    return null
  }

  public configureStartPurposeText():Style{
    if(this.purpose){
      const txt = new Text({
        stroke: this.stroke,
        offsetY: -7,
        offsetX: -10,
        rotateWithView:true,
        textAlign:"end",
        padding:[10,10,10,10],
        scale:this.scale
      })
  
      return new Style({
        geometry: function(feature:EntityLine){
          feature.updateData()
          const text: string = feature.purpose + " " + feature.coordination;
          const start = new Point((<LineString>feature.getGeometry()).getFirstCoordinate());
          const end = new Point(feature.getCoordinates()[1]);
          const rotation = feature.getOrientation(end, start);
          feature.purposeStartStyle.getText().setRotation(-rotation);
          feature.purposeStartStyle.getText().setText(text)
          return start
        } ,
        text: txt
      });
    }
    return null    
  }


  public configureEndDateTime():Style{
    if(this.initialDateTime || this.finalDateTime ){
      const txt = new Text({
        stroke: this.stroke,
        offsetY: 7,
        offsetX: 10,
        rotateWithView:true,
        textAlign:"start",
        padding:[10,10,10,10],
        scale:this.scale * 0.7
      })
  
      return new Style({
        geometry: function(feature:EntityLine){
          feature.updateData()
          const text: string = feature.initialDateTime + " " + feature.finalDateTime;
          const start = new Point(feature.getPenultimate());
          const end = new Point(feature.getEntityGeometry().getLastCoordinate());
          const rotation = feature.getOrientation(end, start);
          feature.dateTimeEndStyle.getText().setRotation(-rotation);
          feature.dateTimeEndStyle.getText().setText(text)
          return end
        } ,
        text: txt
      });
    }
    return null
  }

  public configureStartDateTime():Style{
    if(this.initialDateTime || this.finalDateTime ){
      const txt = new Text({
        stroke: this.stroke,
        offsetY: 7,
        offsetX: -10,
        rotateWithView:true,
        textAlign:"end",
        padding:[10,10,10,10],
        scale:this.scale * 0.7
      })
  
      return new Style({
        geometry: function(feature:EntityLine){
          feature.updateData()
          const text: string = feature.initialDateTime + " " + feature.finalDateTime;
          const start = new Point((<LineString>feature.getGeometry()).getFirstCoordinate());
          const end = new Point(feature.getCoordinates()[1]);
          const rotation = feature.getOrientation(end, start);
          feature.dateTimeStartStyle.getText().setRotation(-rotation);
          feature.dateTimeStartStyle.getText().setText(text)
          return start
        } ,
        text: txt
      });
    }
    return null
  }

 public getPattern(): Style{
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

  public getBasicStyle(): Style{
    this.style = new Style({      
      // text: new Text({
      //   text: this.name,
      //   placement: this.placement,
      //   textAlign: this.textAlign,
      //   textBaseline: this.textBaseline,
      //   rotateWithView: this.rotateWithView,
      //   scale: this.scale,
      //   stroke: new Stroke({
      //     color: this.textColor
      //   })
      // }),
      stroke: new Stroke({
        color: this.lineColor,
        width: this.lineWidth,
        lineJoin: this.lineJoin,
        lineDash:this.stroke_dasharray
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

  
  public getLastCoordinate():Coordinate{
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
    return "Línea";
  }
  // public setType(value: string) {
  //   this.type = value;
  // }
}
