import Geometry from "ol/geom/Geometry";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import { Color } from "ol/color";
import Point from "ol/geom/Point";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { Entity, EntityOptions } from "./entity.class";
import ImageStyle from "ol/style/Image";
import { Coordinate, distance, equals } from "ol/coordinate";
import { entityType } from "./entitiesType";
import Icon from "ol/style/Icon";
import { TaskOptions } from "./entity-task.class";
import { LineString } from "ol/geom";
import { distanceFromPointToLine, getCoordsForArcFrom2Points, getOrientation, getPerpendicularPoint, getPointToVector, middlePoint } from "../utilities/geometry-calc";
import { EntityLine } from "./entity-line.class";
import { Map, Collection } from "ol";
import { ModifyEvent } from "ol/interaction/Modify";
import { HTTPEntitiesService } from "../services/entities.service";
import { OperationsService } from "../services/operations.service";
import { SvgTasksIconsListService } from "../services/svg-tasks-icons-list.service";

export class EntityMultiPoint<GeomType extends Geometry = Geometry> extends EntityLine{
  public image: ImageStyle;
  public lineColor: Color = [0,0,0];
  public lineWidth: number = 2;
  location: Coordinate
  numPoints:number

  // features of text
  public name: string = "";
  public textColor: Color = [255,255,255];
  // private placement = "point";
  public textAlign = "center";
  public textBaseline = "middle";
  public scale = 1.5;
  public rotateWithView = false;
  multiPointOptions: MultiPointOptions;
  points: PointLike[];

  constructor(taskOptions:TaskOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
    super(taskOptions,opt_geometryOrProperties,id);
    this.entityType = entityType.multipoint
    // this.transformToIsosceles()

    this.setStyle()

    if (taskOptions){
      this.multiPointOptions = <MultiPointOptions>taskOptions.options
      this.numPoints = this.multiPointOptions.numPoints
      this.points = this.multiPointOptions.points
      // this.file = this.file.file
    }



    // Dibujamos la task
    var styleFunction = (feature:EntityMultiPoint) => {
      this.applyConstraints()
      
        // Rellenamos las coordenadas
      const coordinates:Coordinate[] = this.getCoordinates()

      coordinates.forEach((coord,index) => {
        this.multiPointOptions.points[index].coordinate = coord
      })

      // Si  hay puntos virtuales los calculamos
      this.multiPointOptions.points.forEach((value,index) => {
        if ((<VirtualPoint>value).reference){
          // this.resolveConstraint((<VirtualPoint>value).constraint)value.order = index
          value.coordinate = this.resolveReferenceToCoordinate((<VirtualPoint>value))
        }
      })
      const styles:Style[] = []
      const points = feature.multiPointOptions.points;

      // //***************   Quitar ***********************/
      // styles.push(this.getMainStyle())
      // Pintamos las líneas
      feature.multiPointOptions.edges.forEach((edge,index) => {
        edge.initAnchor.coordinate = points[edge.initAnchor.order].coordinate
        edge.finalAnchor.coordinate = points[edge.finalAnchor.order].coordinate
        switch (edge.shape.type) {
          case TypeShape.ARC:
            styles.push(...this.arcStyle(edge))            
            break;
          case TypeShape.LINE:
            styles.push(...this.rightLineStyle(edge))            
            break;
          case TypeShape.LLINE:
            styles.push(this.lLineStyle(edge))            
            break;
          case TypeShape.RAY:
            styles.push(...this.rayStyle(edge))            
            break;
          case TypeShape.STICKLINE:
            styles.push(this.stickLineStyle(edge))            
            break;            

          default:
            break;
        }


      });
      // this.fixUbicationRealPoints()
      // this.applyConstraints()
      return styles
    } 

    this.setStyle(styleFunction)
  }
  
  
  getSvgSvcFieldsOfExtraData(){
    return null
  }

  onModifyEnd(evt: ModifyEvent, map: Map, shapesFeatures: Collection<Entity<Geometry>>, operationsService?: OperationsService, entitiesService?: HTTPEntitiesService): void {
    this.setCoordinates(this.getCoordinates())
    super.onModifyEnd(evt,map,shapesFeatures,operationsService,entitiesService)
  }


  getHTMLCodeForIconTimeline(): string {    
    const file = this.file.file
    return '<div style="height: 50px;"><img src="' + file + 
    '" style="vertical-align: top;width: 50px"></div>'
  }

  getType(): string {
    return ("Tarea");
  }

  fixUbicationRealPoints() {
    const newCoord:Coordinate[] = this.getCoordinates()
    var changed = false
    const flatCoordinates = (<LineString>this.getGeometry()).getFlatCoordinates()
    this.getCoordinates().forEach((coord,i) =>{
      const fc:Coordinate = [flatCoordinates[i*2],flatCoordinates[i*2 + 1]]
      if (!equals(coord,fc)){
        newCoord[i] = fc
        changed = true
      }
    })
    if (changed)
      this.setCoordinates(newCoord)
  }

  applyConstraints() {
    if(this.multiPointOptions.mainConstraints){
      this.multiPointOptions.mainConstraints.forEach((constraint:Constraint,i) => {
        if(constraint.constraintType == ConstraintType.ISOSCELES)
          this.transformToIsosceles()
        if(constraint.constraintType == ConstraintType.RIGHT_TRIANGLE)
          this.transformToRightTriangle()
        if(constraint.constraintType == ConstraintType.EQUAL)
          this.transformToEqual(constraint)
        if(constraint.constraintType == ConstraintType.IN_LINE)
          this.transformToInLine()
      })
    }
  }
  
  transformToInLine() {
    const coords : Coordinate[] = this.getCoordinates()
    const or = getOrientation(this.getCoordinates()[0],this.getCoordinates()[1])
    for (let i = 2; i < this.getCoordinates().length; i++) {
      const d = distance(coords[i-1],coords[i])
      coords[i] = getPointToVector(coords[i-1],or,d);
    }

    (<LineString>this.getGeometry()).setFlatCoordinates((<LineString>this.getGeometry()).getLayout(), this.transformToFlatCoordinates(coords))
  }

  transformToEqual(constraint:Constraint) {
    const p0 = this.getCoordinates()[constraint.referencesPoints[0]]
    const p1 = this.getCoordinates()[constraint.referencesPoints[1]]
    const p2 = this.getCoordinates()[constraint.referencesPoints[2]]
    const p3 = this.getCoordinates()[constraint.referencesPoints[3]]

    const d = distance(p0,p1)
    const or = getOrientation(p2,p3)
    const coords = this.getCoordinates()
    coords[constraint.referencesPoints[3]] = getPointToVector(p2,or,d);
    (<LineString>this.getGeometry()).setFlatCoordinates((<LineString>this.getGeometry()).getLayout(), this.transformToFlatCoordinates(coords))
  }

  transformToIsosceles() {
    const centre = this.getCenter(this.getCoordinates()[0],this.getCoordinates()[1])
    const distance = distanceFromPointToLine(this.getCoordinates()[2],this.getCoordinates()[0],this.getCoordinates()[1])
    const rotation = getOrientation(this.getCoordinates()[0],this.getCoordinates()[1]) 
    const coords = [this.getCoordinates()[0],this.getCoordinates()[1],getPerpendicularPoint(centre,rotation,distance)];
    (<LineString>this.getGeometry()).setFlatCoordinates((<LineString>this.getGeometry()).getLayout(), this.transformToFlatCoordinates(coords))
  }

  transformToRightTriangle(){
    const distance = distanceFromPointToLine(this.getCoordinates()[0],this.getCoordinates()[1],this.getCoordinates()[2])
    const rotation = getOrientation(this.getCoordinates()[1],this.getCoordinates()[2]) 
    const coords = [getPerpendicularPoint(this.getCoordinates()[1],rotation,distance),this.getCoordinates()[1],this.getCoordinates()[2]];
    (<LineString>this.getGeometry()).setFlatCoordinates((<LineString>this.getGeometry()).getLayout(), this.transformToFlatCoordinates(coords))    
  }

  transformToFlatCoordinates(coordinates:Coordinate[]):number[]{
    const list:number[] = []
    coordinates.forEach((coord,i) => {
      list.push(coord[0],coord[1])
    })
    return list
  }

  getCenter(c1:Coordinate,c2:Coordinate):Coordinate{
    return [(c1[0] + c2[0])/2,(c1[1] + c2[1])/2]
  }

  resolveReferenceToCoordinate(point: VirtualPoint): Coordinate {
    const reference:Reference = point.reference
    var coordinate:Coordinate
    const coords:Coordinate[] = []
    if (reference.referencesPoints){
      reference.referencesPoints.forEach((ref,index) =>{
        coords.push(this.multiPointOptions.points[ref].coordinate)
      })
    }
    switch (reference.referenceType) {
      case ReferenceType.MIDDLE:
        if (coords.length == 2) {
          coordinate = middlePoint(coords[0],coords[1])
        }
        break;

      case ReferenceType.LEFT_PERPENDICULAR:
        if (coords.length == 4) {
          const direction = getOrientation(coords[1],coords[0])
          const distance = distanceFromPointToLine(coords[3],coords[0],coords[1])
          coordinate = getPerpendicularPoint(coords[2],direction,distance) 
        }
        break;
      
      case ReferenceType.RIGHT_PERPENDICULAR:
        if (coords.length == 4) {
          const direction = getOrientation(coords[0],coords[1])
          const distance = distanceFromPointToLine(coords[3],coords[0],coords[1])
          coordinate = getPerpendicularPoint(coords[2],direction,distance) 
        }
        break;

      case ReferenceType.OFFSET:
        if (coords.length == 3) {
          const direction = getOrientation(coords[0],coords[1])
          const applicationPoint = coords[2]
          const offset = reference.offset
          switch (offset.typeOffset) {
            case TypeOffset.POLAR:
              const angle = offset.angle + direction;
              const dist = typeof offset.distance == "number"? offset.distance: this.resolveReferenceToValue(offset.distance)
              coordinate = getPointToVector(applicationPoint,angle,dist)
              break;

            case TypeOffset.CARTESIAN:
            
              break;
            
            default:
              break;
          }
        }
        break;

      case ReferenceType.PROPORTIONAL:
        if (coords.length == 4) {
          const direction = getOrientation(coords[0],coords[1])
          const distance = distanceFromPointToLine(coords[3],coords[0],coords[1])
          coordinate = getPerpendicularPoint(coords[2],direction,distance) 
        }
        break;
                
        default:
        break;
    }
    return coordinate
  }
  resolveReferenceToValue(reference: Reference): number {
    var value:number
    if (reference.referenceType == ReferenceType.PROPORTIONAL){
      var messure
      if (reference.proportion.referencePoints){
        const indexs = [reference.proportion.referencePoints[0],reference.proportion.referencePoints[1]]
        messure = distance(this.multiPointOptions.points[indexs[0]].coordinate ,this.multiPointOptions.points[indexs[1]].coordinate)
      }
      const proportion = reference.proportion.proportion
      const operation = reference.proportion.operation
      switch (operation) {
        case Operation.MULT:
          value = messure * proportion
          break;
        case Operation.SUM:
          value = messure + proportion
          break;
        
      }

    }
    return value
  }

  lLineStyle(edge:Edge)  : Style{
    throw new Error("Method not implemented.");
  }

  stickLineStyle(edge:Edge)  : Style{
    return new Style({
      geometry: (feature) => {
        const coordinates:Coordinate[] = [edge.initAnchor.coordinate,edge.finalAnchor.coordinate]
        const line: LineString = new LineString(coordinates);
        const angle = (<StickLine>edge.shape).angle
        const lineDirection:number = getOrientation(coordinates[0],coordinates[1]) 
        const delta:number = (<StickLine>edge.shape).direction == Direction.LEFT? angle:-angle
        const direction = lineDirection + delta
        const lastPoint:Coordinate = coordinates[1]
        const d:number = distance(edge.initAnchor.coordinate,edge.finalAnchor.coordinate)
        const newPoint:Coordinate = getPointToVector(lastPoint,direction,d/5)
        line.appendCoordinate(newPoint)
        return line
      },
      stroke:new Stroke({
        color:"black",
        width:2
      })
    })
    
  }
  
  rayStyle(edge:Edge)  : Style[]{
    const offset = 1000
    const styles:Style[] = []
    const finalTip:Tip = (<CPoint>this.points[edge.finalAnchor.order]).tip;
    const offsetAngle = (<Ray>edge.shape).direction == Direction.RIGHT? -0.1 : 0.1
    const orientation = getOrientation(edge.initAnchor.coordinate,edge.finalAnchor.coordinate)
    const from = getPointToVector(edge.initAnchor.coordinate,orientation,offset)
    const rayStyle = new Style({
      geometry:(feature) => {
        const long = distance(from,edge.finalAnchor.coordinate)
        const p1 = getPointToVector(from,orientation - offsetAngle,1.1*long/2)
        const p2 = getPointToVector(from,orientation + offsetAngle,0.9*long/2)
        return new LineString([from,p1,p2,edge.finalAnchor.coordinate])
      },
      stroke:new Stroke({
        color:"black",
        width:2
      })
    })
    styles.push(rayStyle)
    
    if(finalTip){
      styles.push(this.tipStyle(edge,finalTip))       
    }
    if(edge.text){
      // const from:Coordinate = edge.initAnchor.coordinate
      const to:Coordinate = edge.finalAnchor.coordinate
      const ubication = edge.text.position == CPosition.START? from: edge.text.position == CPosition.END? to:this.getCenter(from,to)
      const rotation = Math.atan2(to[1] - from[1], to[0] - from[0]);
      styles.push(new Style({
        geometry: new Point(ubication), 
        text: new Text({
          text:edge.text.text,
          scale: 2,
          rotation: (<Ray>edge.shape).direction == Direction.RIGHT? -rotation: -rotation + Math.PI,
          backgroundFill:new Fill({
            color:"#E8E8CE"
          })
        })      
      }))
    }

    return styles

  }

  rightLineStyle(edge:Edge) : Style[] {
    // (<CPoint>edge.finalAnchor).tip = (<CPoint>this.points[edge.finalAnchor.order]).tip
    const finalTip:Tip = (<CPoint>this.points[edge.finalAnchor.order]).tip;
    const initTip:Tip = (<CPoint>this.points[edge.initAnchor.order]).tip;
    var text:CText = edge.text
    const styles :Style[] = []
    const lineStyles = new Style({
      geometry: (feature:EntityMultiPoint) => {
        const coordinates:Coordinate[] = [edge.initAnchor.coordinate,edge.finalAnchor.coordinate]
        const line: LineString = new LineString(coordinates);
        return line
      },
      stroke:new Stroke({
        color:"black",
        width:2
      })
    })

    if(text){
      const from:Coordinate = edge.initAnchor.coordinate
      const to:Coordinate = edge.finalAnchor.coordinate
      const centre = this.getCenter(from,to)
      const delta = text.rotation? text.rotation:0
      const rotation = Math.atan2(to[1] - from[1], to[0] - from[0]) + delta;
      styles.push(new Style({
        geometry: new Point(centre), 
        text: new Text({
          text:edge.text.text,
          scale: 2,
          rotation: -rotation,
          backgroundFill:new Fill({
            color:"#E8E8CE"
          })
        })      
      }))
    }
  

    if(finalTip){
      styles.push(this.tipStyle(edge,finalTip))       
    }
    if(initTip){
      styles.push(this.tipStyle(edge,initTip))       
    }

    styles.push(lineStyles)

    return styles
  }

  tipStyle(edge:Edge,tip:Tip,rotation?):Style{
    const ubication = tip.ubication
    const tipStyle:Style = new Style({
      geometry:(feature) => {
        const location = ubication == CPosition.END? edge.finalAnchor.coordinate:edge.initAnchor.coordinate
        const point = new Point(location)
        const end = edge.finalAnchor.coordinate;
        const start = edge.initAnchor.coordinate;
        if(!rotation)
          rotation = ubication == CPosition.END? getOrientation( start,end):getOrientation(end, start)
        tipStyle.getImage().setRotation(-(rotation - Math.PI/2));
        return point;
      },
      image: new Icon({
        src:tip.src,
        anchor: tip.anchor? tip.anchor: [0.5,0.5]
      })
    })   
    return tipStyle
  }
  
  arcStyle(edge:Edge) : Style[]{
    const styles:Style[] = []
    const text = edge.text
    const finalTip:Tip = (<CPoint>this.points[edge.finalAnchor.order]).tip;
    const initTip:Tip = (<CPoint>this.points[edge.initAnchor.order]).tip;
    const from = (<Arc>edge.shape).direction == Direction.LEFT? edge.initAnchor.coordinate:edge.finalAnchor.coordinate
    const to = (<Arc>edge.shape).direction == Direction.LEFT? edge.finalAnchor.coordinate:edge.initAnchor.coordinate
    const line = new LineString(getCoordsForArcFrom2Points(from,to,(<Arc>edge.shape).angle))
    const centerLine = line.getCoordinateAt(0.5)
    const basicStyle = new Style({
      geometry: line,
      stroke: new Stroke({
        color: this.lineColor,
        width: this.lineWidth
      }),      
    })
    styles.push(basicStyle)

    if(text){
      styles.push(new Style({
        geometry: new Point(centerLine), 
        text: new Text({
          text:edge.text.text,
          scale: 2,
          backgroundFill:new Fill({
            color:"#E8E8CE"
          })
        })      
      }))
    }

    if(finalTip){
      const ubication = finalTip.ubication
      const l = line.getCoordinates().length
      const from = ubication == CPosition.END? line.getCoordinates()[l - 2]: line.getLastCoordinate() 
      const to = ubication == CPosition.END? line.getLastCoordinate() : line.getCoordinates()[l - 2]
      const or = getOrientation(from,to)
      const tipStl = this.tipStyle(edge,finalTip,or+ Math.PI/2)
      styles.push(tipStl)       
    }
    if(initTip){
      styles.push(this.tipStyle(edge,initTip))       
    }

    return styles
  }

  getLocation(): Coordinate{
    return <Coordinate>this.location
  }

  setLocation(coordinates:Coordinate){
    this.location = coordinates;
  }
  
  public getMainStyle(): Style{
    this.style = new Style({
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


export enum ConstraintType {
  ISOSCELES = 'isosceles',
  MIDDLE = "middle",
  RIGHT_TRIANGLE = "rightTriangle",
  IN_LINE = "inLine",
  EQUAL = "equal"
}


export enum ReferenceType {
  MIDDLE = "middle",
  RIGHT_PERPENDICULAR = "rightPerpendicular",
  LEFT_PERPENDICULAR = "lefttPerpendicular",
  INITIAL = "initial",
  FINAL = "final",
  OFFSET = "offset",
  PROPORTIONAL = "PROPORTIONAL"
}


export interface MultiPointOptions extends EntityOptions{
  numPoints:number,
  mainConstraints?:Constraint[]
  edges:Edge[],
  points: PointLike[]
}

export type PointLike = VirtualPoint | CPoint

export interface MainPoint{
  coordinate?: Coordinate,
  order:number,
  constraint?:Constraint,
  tip?: Tip
}


export interface Constraint{
  constraintType: ConstraintType, // parallel, perpendicular, isosceles
  referencesPoints?:number[],
  referenceEdge?: number[]
}

export interface VirtualPoint extends MainPoint{
  reference: Reference
}

export interface Reference{
  referenceType: ReferenceType   // middle, perpendicular
  referencesPoints?:number[],
  offset?: Offset,
  proportion?:Proportion
}

export enum Operation { SUM, MULT, DIV, REST} 

export interface Proportion{
  operation: Operation,
  referenceShape?: number,
  referencePoints?: [number,number],
  proportion?:number
}



export type Offset = Polar | Cartesian

export interface Cartesian{
  typeOffset: TypeOffset.CARTESIAN,
  offsetX:number,
  offsetY:number
}

export interface Polar{
  typeOffset: TypeOffset.POLAR,
  angle:number,
  distance: number | Reference
}

export enum TypeOffset{
  POLAR = "polar",
  CARTESIAN = "cartesian"
}

export interface CPoint extends MainPoint{
}

// export enum CPosition{
//   START = "start",
//   END = "end"
// }

export interface Tip{
  src: string,
  ubication: CPosition,
  anchor?:number[]
}

export interface Edge {
  order?: number,
  shape: Shape,
  initAnchor: PointLike,
  finalAnchor: PointLike,
  text?:CText,
  pattern?:string,
  parallelLeft?: ParallelEdge,
  parallelRight?: ParallelEdge,
  constraint?: Constraint
}

export interface ParallelEdge{
  edge:Edge,
  anchor?: Coordinate,
  distance?:number
}

export interface CText {
  text:string,
  position:CPosition,
  rotation?:number
}

export enum CPosition{
  CENTER = "center",
  START = "start",
  END = "end"
}

export type Shape = Arc | Line | Ray | Lline | StickLine

export enum TypeShape {
  ARC,
  LINE,
  RAY,
  LLINE,
  STICKLINE
}

export enum Direction {
  RIGHT,
  LEFT
}

export interface Arc {
  type: TypeShape.ARC
  angle: number,
  direction: Direction
}

export interface Line{
  type: TypeShape.LINE
}

export interface Ray{
  type: TypeShape.RAY,
  direction: Direction
}


export interface Lline{
  type: TypeShape.LLINE
  direction: Direction
}

export interface StickLine{
  type: TypeShape.STICKLINE
  angle:number,
  direction: Direction
}