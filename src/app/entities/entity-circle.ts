import Geometry from "ol/geom/Geometry";
import Style from "ol/style/Style";
import { Coordinate, distance } from "ol/coordinate";
import { entityType } from "./entitiesType";
import { TaskOptions } from "./entity-task.class";
import { EntityLine } from "./entity-line.class";
import { Constraint, CPosition, CText, MainPoint, PointLike, Tip, VirtualPoint } from "./entity-multipoint.class";
import { LineString, Point } from "ol/geom";
import { Fill, Icon, Stroke, Text } from "ol/style";
import { getCoordsForArc, getOrientation } from "../utilities/geometry-calc";
import { Feature } from "ol";

export class EntityCircle<GeomType extends Geometry = Geometry> extends EntityLine{
  circleOptions: CircleOptions;
  center: Coordinate;
  radius: number;
  angle: number;
  override pattern: any;
  arc: number;
  rotation:number;
  segments:number = 20;
  text: CText;
  arcCoordinates: Coordinate[]
  tips: Tip[] = [];

  constructor(taskOptions:TaskOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
    super(taskOptions,opt_geometryOrProperties,id);
    this.entityType = entityType.circle
    this.center = this.getCenter()
    this.radius = this.getRadius()
    this.rotation = this.getRotation()
    // this.transformToIsosceles()

    // this.setStyle()

    if (taskOptions){
      this.circleOptions = <CircleOptions>taskOptions.options
      // this.numPoints = this.multiPointOptions.numPoints
      this.center = this.circleOptions.center.coordinate? this.circleOptions.center.coordinate:this.center
      this.radius = this.circleOptions.radius?this.circleOptions.radius:this.radius
      this.arc = this.circleOptions.arc?this.circleOptions.arc:this.arc
      this.rotation = this.circleOptions.rotation?this.circleOptions.rotation:this.rotation
      this.text = this.circleOptions.text
      this.tips = this.circleOptions.tips

      this.updateOptions(this)
      this.pattern = taskOptions.pattern
    }
    


    // Dibujamos la task
    var styleFunction = (feature:EntityCircle) => {
      // this.applyConstraints()
      const styles:Style[] = []
      styles.push(...this.basicStyle(feature))

      //Detrás de la línea básica
      if (this.text)
        styles.push(this.getTextStyle(feature))

      if(this.tips)
        styles.push(...this.getTipStyles(feature))

      // styles.push(this.getStyle())

      return styles
    } 

    this.setStyle(styleFunction)
  }


  override getHTMLCodeForIconTimeline(): string {    
    const file = this.file.file
    return '<div style="height: 50px;"><img src="' + file + 
    '" style="vertical-align: top;width: 50px"></div>'
  }


  getTipStyles(feature: EntityCircle<Geometry>):Style[] {
    const styles:Style[] = []
    var ubication:Coordinate
    const initPoint = feature.arcCoordinates[0]
    const finalPoint = feature.arcCoordinates[feature.arcCoordinates.length -1]
    var rotation
    this.tips.forEach((tip,index) =>{
      if(tip.ubication == CPosition.START){
        ubication = initPoint
        rotation = getOrientation(feature.arcCoordinates[1],initPoint)
      }
      if(tip.ubication == CPosition.END){
        ubication = finalPoint
        rotation = getOrientation(feature.arcCoordinates[feature.arcCoordinates.length -2],finalPoint)
      }
      styles.push(new Style({
        geometry:new Point(ubication),
        image: new Icon({
          src:tip.src,
          anchor: tip.anchor,
          rotation:-rotation + Math.PI/2
        })
      }))
    })
    return styles
  }

  getTextStyle(feature:EntityCircle): Style {
    var ubication:Coordinate
    const initPoint = feature.arcCoordinates[0]
    const finalPoint = feature.arcCoordinates[feature.arcCoordinates.length -1]
    const centralPoint = feature.arcCoordinates[Math.floor(feature.arcCoordinates.length/2)]
    const rotation = 0
    
    if(this.text.position == CPosition.START)
      ubication = initPoint
    if(this.text.position == CPosition.END)
      ubication = finalPoint
    if(this.text.position == CPosition.CENTER)
      ubication = centralPoint
    return new Style({
      geometry:new Point(ubication),
      text:new Text({
        text:this.text.text,
        scale: 2,
        rotation: -rotation,
        backgroundFill:new Fill({
          color:"#E8E8CE"
        })
      })
    })
  }

  getRotation(): number {
    return getOrientation(this.getCenter(),this.getLastCoordinate())
  }

  updateOptions(feature:EntityCircle) {    
    feature.circleOptions.center.coordinate = feature.getCenter()
    feature.circleOptions.radius = feature.getRadius()
    feature.circleOptions.rotation = feature.getRotation()
  }

  getRadius(): number {
    return distance(this.getCenter(),this.getCoordinate(1))
  }


  basicStyle(feature:EntityCircle): Style[] {
    const styles:Style[] = []
    this.arcCoordinates = getCoordsForArc(feature.getCenter(),feature.getRadius(),feature.arc,feature.getRotation(),this.segments)
    const geometry = new LineString(this.arcCoordinates)
    this.updateOptions(feature)
    const style = new Style({
      geometry: geometry,
      stroke: new Stroke({
        color: this.lineColor,
        width: this.lineWidth
      }),
      // fill: new Fill({
      //   color: [255,0,0]
      // })
    });
    if (feature.pattern){
      styles.push(...this.createPattern(new Feature(geometry),2))
    }
    styles.push(style)
    return styles;
  }


  getCenter(): Coordinate {
    return this.getEntityGeometry().getFirstCoordinate();
  }


  
}

export interface CircleOptions extends TaskOptions{
  mainConstraints?:Constraint[],
  center?:TempPoint,
  radius?:number,
  arc?: number,
  tips?:Tip[],
  rotation?:number,
  points?:VirtualPoint[],
  text?:CText
}

export interface TempPoint{
  coordinate?:Coordinate
}
