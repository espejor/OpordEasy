import { Feature, Map, MapBrowserEvent } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Style from "ol/style/Style";
import { HTTPEntitiesService } from "../services/entities.service";
import { SvgIconsListService } from "../services/svg-icons-list.service";
import { entityType } from "./entitiesType";

export abstract class Entity<GeomType extends Geometry = Geometry>  extends Feature{
  _id: string;
  dateCreation:number;
  favorite: boolean;
  updated: number;
  protected style: Style;
  protected location: Coordinate[] |Coordinate;
  entityType: entityType;
  // protected map: Map;
  // protected olMap:OlMapComponent
  public entityOptions:EntityOptions;

  constructor(public svgService?: SvgIconsListService,public opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
      super(opt_geometryOrProperties);
      this.updated = Date.now();
      this.location = this.getCoordinates();
      this._id = id;
  

      // this.olMap = mapComponent;
      // if(this.olMap)
      //   this.map = mapComponent.map;
      // addEventListener('mouseup',(ev:MouseEvent):void => this.onDragEnd(ev));
      // addEventListener('mousedown',(ev:MouseEvent):void => this.onMouseDown(ev));
      // addEventListener('mouseover',(ev:MouseEvent):void => this.onMouseOver(ev))
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


}

export class EntityOptions{
  // isEnemy:boolean
  constructor(){
    // this.isEnemy= false;
  }

}