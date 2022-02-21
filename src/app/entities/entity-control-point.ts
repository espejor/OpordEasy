import { Collection, Map, MapBrowserEvent } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Modify, { ModifyEvent } from "ol/interaction/Modify";
import { Pixel } from "ol/pixel";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke } from "ol/style";
import Icon from "ol/style/Icon";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Style from "ol/style/Style";
import { HTTPEntitiesService } from "../services/entities.service";
import { OperationsService } from "../services/operations.service";
import { Globals } from "../utilities/globals";
import { entityType } from "./entitiesType";
import { EntityPoint } from "./entity-point.class";
import { Entity } from "./entity.class";

export class EntityControlPoint<GeomType extends Geometry = Geometry>  extends EntityPoint{
  private styleOver:Style;
  private styleExited:Style;
  dragging: boolean = false;
  hostId: string;
    
  constructor(host:Entity, opt_geometryOrProperties?: GeomType | { [key: string]: any }) {
    super(null,null,opt_geometryOrProperties);
    this.hostId = host._id

    this.entityType = entityType.controlPoint
    const map:Map = Globals.MAP
    const dragSource:VectorSource<Geometry> = Globals.DRAG_SOURCE;  
    var modify:Modify = Globals.MODIFY;
    
    this.createStyles()
    this.setStyle(this.styleOver)    
    // const style = this.getStyle()
    // style.setStroke(new Stroke({
    //     color: [255,255,255,0]
    //   }))

    

    if(!dragSource.hasFeature(this))
      dragSource.addFeature(this);

    
    // var modify = new Modify({
    //   source:dragSource
    // })

    const inters = map.getInteractions().getArray()
  

    
    if(!inters.includes(modify))
        map.addInteraction(modify)

    modify.on("modifystart",(evt:ModifyEvent) => {
      if(evt.mapBrowserEvent.dragging){
        this.dragging = true
      }    
    })

    modify.on("modifyend",(evt:ModifyEvent) => {
      if(!evt.mapBrowserEvent.dragging)
        this.dragging = false
    }) 
  }

  override onModifyEnd(evt:ModifyEvent, map: Map, shapesFeatures: Collection<Entity<Geometry>>, operationsService?: OperationsService, entitiesService?: HTTPEntitiesService): void {
    const entity:Entity = shapesFeatures.getArray().filter(e => e._id == this.hostId)[0]
    entitiesService.updateEntity(entity).subscribe(data => 
      console.log(data)
    )
  }

  override setCoordinates(coordinates: Coordinate): void {
    if (!this.dragging)
      super.setCoordinates(coordinates)
  }

  setListeners() {
    const map:Map = Globals.MAP
    map.on("pointerdrag",(evt: MapBrowserEvent<UIEvent>) => {
      const pixel:Pixel = evt.pixel
      // map. .forEach(element => {
        
      // });
      console.log("------------------Arrastrnado punto de control")
    })
  }

  createStyles() {
    this.styleOver = new Style({
      // stroke:new Stroke({color:[100,100,100]}),
      // fill:new Fill({color:[100,100,100]})
      image: new Icon({
        anchor: [0.5,0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        opacity: 0.01,
        scale: 1,
        size: [24,24],
        color: 'white',
        src: 'assets/icons/point.svg'
      })
    })

    this.styleExited = new Style({
      image: new Icon({
        anchor: [0.5,0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        opacity: 1,
        size: [24,24],
        scale: 0.5,
        src: 'assets/icons/circle-null.svg'
      })
    })
  }


    // ----------- Listeners
    override onMouseOver(ev):void{
      this.setStyle(this.styleOver);      
    };

    override onMouseExit(ev):void{
      this.setStyle(this.styleExited)
    }
    
    override onMouseDown(ev){
      console.log("down en botón de control");
    };
    
}