import { Collection, Feature, Map, MapBrowserEvent } from "ol";
import { Color } from "ol/color";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { ModifyEvent } from "ol/interaction/Modify";
import Style from "ol/style/Style";
import { HTTPEntitiesService } from "../services/entities.service";
import { OperationsService } from "../services/operations.service";
import { SvgIconsListService } from "../services/svg-icons-list.service";
import { distanceInPixelBetweenCoordinates } from "../utilities/coordinates-calc";
import {EntityStakedOrder, entityType } from "./entitiesType";

export abstract class Entity<GeomType extends Geometry = Geometry>  extends Feature{
  _id: string;
  dateCreation:number;
  favorite: boolean;
  updated: number;
  protected style: Style;
  protected location: Coordinate[] |Coordinate;
  entityType: entityType;
  entityStakedOrder:EntityStakedOrder;
  public entityOptions:EntityOptions;
  smooth: boolean = true;
  
  public lineColor: Color = [0,0,0];
  public lineWidth: number = 2;

  constructor(entityOptions:EntityOptions,public svgService?: SvgIconsListService,public opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
      super(opt_geometryOrProperties);
      this.updated = Date.now();
      this.location = this.getCoordinates();
      this._id = id;
      this.entityOptions = entityOptions;
  }

  onModifyEnd(evt:ModifyEvent, map: Map, shapesFeatures: Collection<Entity<Geometry>>, operationsService?: OperationsService, entitiesService?: HTTPEntitiesService) {
    const range = 40;
    const pointer:Coordinate = map.getCoordinateFromPixel (evt.mapBrowserEvent.pixel)
    // const entityMoving:Entity = <Entity>evt.features.getArray()[0]
    var distance:number = Number.MAX_VALUE;
    var newCoordinate:Coordinate |Coordinate[]
    var closestCoordinate:Coordinate |Coordinate[]
    shapesFeatures.forEach( (entityCandidate:Entity) => {
      try{
        const options = entityCandidate.entityOptions
        if (options.attachable && entityCandidate._id != this._id){
          newCoordinate = entityCandidate.getGeometry().getClosestPoint(pointer);
          const newDistance = distanceInPixelBetweenCoordinates(map,newCoordinate,pointer)
          if (newDistance < range && newDistance < distance){
            distance = newDistance
            closestCoordinate = newCoordinate
          } 
        }
      }catch{
        console.log("Error dragging")
      }
    });
    if (closestCoordinate === undefined){
      closestCoordinate = pointer
    }
    var order = 0;
    try{
      const coords = this.getCoordinates()
      const closestToPointer = this.getGeometry().getClosestPoint(pointer);
      if (Array.isArray(coords)){
        order = this.indexOfCoord(coords,closestToPointer)
        if(order > -1){
            coords [order] = <Coordinate>closestCoordinate
            this.setCoordinates(coords)
        }
      }else{
        this.setCoordinates(closestCoordinate)
      }

      operationsService.updateEntityPositionInOperation(this)
    }catch{
        console.log("Error dragging")
    }  
  }

  indexOfCoord(coords: Coordinate | Coordinate[], pointer: Coordinate): number {
    for (let i = 0; i < coords.length; i++) {
      if (coords[i][0] == pointer[0])
        if(coords[i][1] == pointer[1])
          return i
    }
    return -1
  }

  getStackOrder(){
    return new EntityStakedOrder().getOrder(entityType[this.entityType])
  }

  copy ():Entity <Geometry>{return null};

  updatePointInLocation(coordinate: Coordinate,order = 0) {
    this.location[order] = coordinate;
    console.log('Cambio de ubicación');
  }

  abstract getEntityGeometry();
  abstract getCoordinates():Coordinate[] | Coordinate;
  getLocation(): Coordinate[] |Coordinate{
    return this.location
  }
  // {
  //   return this.getEntityGeometry().getCoordinates();
  // }

  saveCoordinates(httpEntitiesService:HTTPEntitiesService) {
    // const coordinates:Coordinate[] = this.getGeometry().getCoordinates();
    httpEntitiesService.updateCoordinates(this).subscribe(
      data =>{
        console.log(data);
      }
    );
  }

  public onMouseOver(ev:MapBrowserEvent){
    console.log("Entrando en entidad");
    
  };    
  public onMouseExit(ev):void{};    
  public onMouseDown(ev):void{
    console.log("down en entity");
  };    

    
  public onDragEnd(ev):void{
    console.log("Fin drag");
  };    

  public activateStyle(){
    this.setStyle(this.getStyle());
  }

  public getCustomStyle(){
    return this.style;
  }

  // public getSVGTimelineItem(){
  //   return this.svgService.createSVG(this.entityOptions)
  // }

  setCoordinatesOfLocation(coordinates?:Coordinate[]) {
    if(coordinates)
      this.location = coordinates;
    else
      this.location = this.getEntityGeometry().getCoordinates();
    // this.saveCoordinates(entitiesServive);
  }
    
  setFlatCoordinatesfromLocation(coordinates?: Coordinate[] | Coordinate) {
    if(coordinates)
      this.location = coordinates
    this.setCoordinates(this.location);
  }

  setCoordinates(coordinates: Coordinate[] | Coordinate) {
    this.getEntityGeometry().setCoordinates(coordinates);
  }

  setCoordinate(index:number,coordinates: Coordinate[] | Coordinate) {
    const coords = this.getEntityGeometry().getCoordinates();
    coords[index] = coordinates
    this.setCoordinates(coords)
  }


}

export class EntityOptions{
  attachable?:boolean = false;
  // isEnemy:boolean
  constructor(){
    // this.isEnemy= false;
  }
}


export class Pattern{
  pattern:string
  wide:number
  gap:number
  anchor:number[]
}