import { Feature } from "ol";
import { Color } from "ol/color";
import { ColorLike } from "ol/colorlike";
import { Coordinate } from "ol/coordinate";
import { Circle, LineString, MultiPoint, Point } from "ol/geom";
import Geometry from "ol/geom/Geometry";
import GeometryType from "ol/geom/GeometryType";
import Polygon from "ol/geom/Polygon";
import { Size } from "ol/size";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
// import { AppInjector } from "../app.module";
import { LineOptions, PointOptions } from "../models/feature-for-selector";
import { getEntityType } from "./entitiesType";
import { AreaOptions } from "./entity-area.class";
import { CircleOptions } from "./entity-circle";
import { MultiPointOptions } from "./entity-multipoint.class";
import { Entity, EntityOptions, Pattern } from "./entity.class";
import { EntitySelector } from "./factory-entity-selector";

export class EntityTask<GeomType extends Geometry = Geometry>{
    taskOptions: TaskOptions;
    type: string;
    name: string;
    taskStyle: Style;
    purposeStyle: Style;
    styles: (feature: Feature) => Style[];
    pattern: Pattern;
    anchor: number[];
    lineColor: any;
    lineWidth: any;
    lineJoin: any;
    placement: string;
    textAlign: string;
    textBaseline: string;
    rotateWithView: boolean;
    scale: number | Size;
    textColor: Color | ColorLike;
    stroke: Stroke = new Stroke({width:1});
    typeTask: string;

    entity:Entity;

    constructor(taskOptions?:TaskOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
        if(taskOptions){
            // this.name = taskOptions.name;
            this.typeTask = taskOptions.typeTask;
            this.entity = EntitySelector.getFactory(getEntityType(this.typeTask)).createEntity(taskOptions.options)
            
        }
    }

    configureTypeTask(typeTask: string): Style {
        const text: string = typeTask; 
        return new Style({
          geometry: function(feature:any){
            return (<Polygon>feature.getGeometry()).getInteriorPoint();
          } ,
          text:new Text({
            stroke: this.stroke,
            text: text,
            // placement: "point",
            // textAlign: "start",
            // textBaseline: "middle",
            // offsetX: text.length * 5,
            offsetY: -10,
            rotateWithView:false,
            // rotation: -rotation, 
            // overflow:true,
            padding:[10,10,10,10],
            scale:this.scale
          })
        });
    }
}


export class TaskOptions extends EntityOptions{
  options?:PointOptions | LineOptions | MultiPointOptions | CircleOptions |AreaOptions
  name?:string;   //T field
  typeTask?:string; // point, axis, arrow ...
  purpose?:string;  // RFL...
  pattern?:Pattern;  // 
  coordinationMessures?:string;  // p.e. Controlling HQ
  dateTimeGroupInitial?: string;  //
  dateTimeGroupFinal?: string;  //
  lineVisible?: boolean; // Si la línea se ha de ver ()
  echelon?:string;
  svgWidth?:number;
  tailSource?: string;
  tipSource?: string;
  stroke_dasharray?:[number,number];
  axis_options?:{
    WIDTH:number
  }

  static getCoordinatesByType(type: string,feature:Feature): Coordinate | Coordinate[] {
    switch (type){
      case "point": return (<Point>feature.getGeometry()).getCoordinates()
      case "arrow": return (<LineString>feature.getGeometry()).getCoordinates()
      case "axis": return (<LineString>feature.getGeometry()).getCoordinates()
      case "multipoint": return (<LineString>feature.getGeometry()).getCoordinates()
      case "circle": return [(<Circle>feature.getGeometry()).getFirstCoordinate(),(<Circle>feature.getGeometry()).getLastCoordinate()]
    }
    return (<Point>feature.getGeometry()).getCoordinates()
  }

  static getTypeTask(type:string):GeometryType{
    switch (type){
      case "point": return GeometryType.POINT
      case "arrow": return GeometryType.LINE_STRING
      case "axis": return GeometryType.LINE_STRING
      case "multipoint": return GeometryType.LINE_STRING
      case "circle": return GeometryType.CIRCLE
    }
    return GeometryType.POINT
  }
}


  
