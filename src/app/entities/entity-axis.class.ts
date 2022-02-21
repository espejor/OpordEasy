import { Collection, Feature, Map } from "ol";
import { Coordinate, distance } from "ol/coordinate";
import BaseEvent from "ol/events/Event";
import { LineString } from "ol/geom";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import { ModifyEvent } from "ol/interaction/Modify";
import { Pixel } from "ol/pixel";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { HTTPEntitiesService } from "../services/entities.service";
import { OperationsService } from "../services/operations.service";
import { getOrientation, getParallelLineWithEndOffset, getPointToVector, LEFT, RIGHT } from "../utilities/geometry-calc";
import { Globals } from "../utilities/globals";
import { entityType } from "./entitiesType";
import { EntityControlPoint } from "./entity-control-point";
import { EntityLine } from "./entity-line.class";
import { TaskOptions } from "./entity-task.class";
import { Entity } from "./entity.class";

export class EntityAxis<GeomType extends Geometry = Geometry> extends EntityLine{
  tipStyle: Style;
  rightLineStyle: Style;
  leftLineStyle: Style;
  widthControlPointStyle: Style;

  public WIDTH = 2000;
  DIVISOR: number = 4;

  tipAngle: number = 2 * Math.atan((this.WIDTH/2 + this.WIDTH/this.DIVISOR) / this.WIDTH)
  lastPointRightLine: Coordinate;
  lastPointLeftLine: Coordinate;
  penultimatePointRightLine: Coordinate;
  penultimatePointLeftLine: Coordinate;
  widthControlPointCoord: Coordinate;
  widthControlPointGeometry: Point;
  widthControlPointEntity: EntityControlPoint
  cpDragging: boolean = false;
  PRECISION: number = 50;
  currentPixel: Pixel;
  controlPointStyle: (feature: any) => Style;
  changingAxisGeometry: boolean;
  cpRelocated: boolean;
  
  constructor(taskOptions:TaskOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?) {
    super(taskOptions,opt_geometryOrProperties,id);

    this.entityType = entityType.axis
    const entity = this
    this.rightLineStyle = this.getRightLineStyle()
    this.leftLineStyle = this.getLeftLineStyle()
    this.tipStyle = this.getTipStyle()
    this.widthControlPointStyle = this.getWidthControlPointStyle()

    this.widthControlPointEntity = new EntityControlPoint(this,new Point([0,0]))
  

    // Gestión del cambio de geometría del eje
    this.on("change",(evt:BaseEvent) => {
      this.changingAxisGeometry = true
      const maxDist = distance(this.getLastCoordinate(),this.getPenultimate())
      if(this.WIDTH > maxDist - maxDist / 10)
        this.WIDTH = maxDist - maxDist / 10
      if(this.widthControlPointCoord){
        if(!this.cpRelocated)
          this.locateControlPoint()
        else
          this.cpRelocated = false
      }        
    })



    // gestión del movimiento del punto de control
    this.widthControlPointEntity.on("change",(evt:BaseEvent) => {
          if (this.widthControlPointEntity.dragging){
            this.cpDragging = true
            const d = this.calculateNewWidth(evt)
            const newWidth = (d * this.DIVISOR * 2) / (this.DIVISOR + 2)
            const maxDist = distance(this.getLastCoordinate(),this.getPenultimate())
            if(newWidth < maxDist - maxDist/10){
              this.WIDTH = newWidth
              taskOptions["axis_options"] = {WIDTH:newWidth}
            }
            if(!this.cpRelocated)
              this.locateControlPoint()
            else
              this.cpRelocated = false
          }else{
            if(!this.cpRelocated)
              this.locateControlPoint()
            else
              this.cpRelocated = false
          }
    })


    var stylesFunction = function(feature:EntityAxis){
  
      const styles: Style[] = []
      styles.push(entity.rightLineStyle)
      styles.push(entity.leftLineStyle)
      styles.push(entity.tipStyle)  // siempre detrás de las líneas paralelas
      if (taskOptions. lineVisible)
        styles.push(entity.lineStyle);
      return styles
    }

    if(taskOptions){
        this.styles = stylesFunction;
        this.setStyle(this.styles);
        try{
          this.WIDTH = taskOptions["axis_options"].WIDTH
        }catch{
          this.WIDTH=2000
        }
    }

    // ubicamos el punto de control
    this.locateControlPoint()
  }

  override getHTMLCodeForIconTimeline(): string {
    const file = this.file.file
    return '<div style="height: 50px;"><img src="' + file + 
    '" style="vertical-align: top;width: 50px"></div>'
  }

    
  override getType(): string {
    return ("Eje de Progresión");
  }

  override onModifyEnd(evt:ModifyEvent, map: Map, shapesFeatures: Collection<Entity<Geometry>>, operationsService?: OperationsService, entitiesService?: HTTPEntitiesService) {
    super.onModifyEnd(evt,map,shapesFeatures,operationsService,entitiesService);
    this.changingAxisGeometry = false     
  }



  calculateNewWidth(evt:BaseEvent): number {
    const tipPoint = this.getEntityGeometry().getLastCoordinate()
    const controlPointLocation = (<Point>(<Feature<Geometry>>evt.target).getGeometry()).getCoordinates()
    return distance(tipPoint,controlPointLocation) * Math.sin(this.tipAngle / 2)
  }


  locateControlPoint(){
    // this.cpRelocating = true
    if(!this.cpRelocated){
      this.cpRelocated = true
      const lastPoint = this.getCoordinates()[this.getCoordinates().length - 1]
      const angle = getOrientation(this.getCoordinates()[this.getCoordinates().length - 1],this.getCoordinates()[this.getCoordinates().length - 2])
      const rootPoint = getPointToVector(lastPoint,angle,this.WIDTH)
      this.widthControlPointCoord = getPointToVector(rootPoint,angle + Math.PI / 2,this.WIDTH/2 + this.WIDTH / this.DIVISOR) ;
      (<Point>this.widthControlPointEntity.getGeometry()).setCoordinates(this.widthControlPointCoord);

    }
  }


  getWidthControlPointStyle(): Style {
    const entity = this
    return new Style({
      geometry:function(feature){
        entity.widthControlPointGeometry = new Point(entity.widthControlPointCoord);
        return entity.widthControlPointGeometry
      },
      image:new Icon({
        src: "assets/icons/circle-null.svg"
      })
    })
  }

  getRightLineStyle(): Style {
    const entity = this
    var rightlineStyle = new Style({
      geometry:function(feature){
        const line = new LineString(getParallelLineWithEndOffset((<LineString>feature.getGeometry()).getCoordinates(),entity.WIDTH/2,RIGHT,entity.WIDTH))
        entity.lastPointRightLine = line.getLastCoordinate();
        entity.penultimatePointRightLine = line.getCoordinates()[line.getCoordinates().length-2]
        return line
      },
      stroke:new Stroke({
        color:"black",
        width:2
      })
    })
    return rightlineStyle;
  }
  
  getLeftLineStyle(): Style {
    const entity = this
    var rightlineStyle = new Style({
      geometry:function(feature){
        const line = new LineString(getParallelLineWithEndOffset((<LineString>feature.getGeometry()).getCoordinates(),entity.WIDTH/2,LEFT,entity.WIDTH))
        entity.lastPointLeftLine = line.getLastCoordinate();
        entity.penultimatePointLeftLine = line.getCoordinates()[line.getCoordinates().length-2]
        return line
      },
      stroke:new Stroke({
        color:"black",
        width:2
      })
    })
    return rightlineStyle;
  }


  getTipStyle():Style{
    const entity = this

    return new Style({
      geometry: function(feature){
        var tip:Coordinate[] = [];
        tip.push(entity.lastPointRightLine);
        var angle = getOrientation(entity.penultimatePointRightLine,entity.lastPointRightLine);
        tip.push(getPointToVector(entity.lastPointRightLine,angle + Math.PI/2,entity.WIDTH/entity.DIVISOR));
        tip.push((<LineString>feature.getGeometry()).getLastCoordinate());
        entity.widthControlPointCoord = getPointToVector(entity.lastPointLeftLine,angle - Math.PI/2,entity.WIDTH/entity.DIVISOR);
        const vectorSource:VectorSource<Geometry> = Globals.SHAPES_VECTOR_LAYER
        if(!vectorSource.hasFeature(entity.widthControlPointEntity))
          vectorSource.addFeature(entity.widthControlPointEntity);
        tip.push(entity.widthControlPointCoord);
        tip.push(entity.lastPointLeftLine);

        return new LineString(tip);
      },
      stroke:new Stroke({
        color:"black",
        width:2
      })
    })
  }

  

}