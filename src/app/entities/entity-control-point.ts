import { Feature, MapBrowserEvent } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Icon from "ol/style/Icon";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Style from "ol/style/Style";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import { entityType } from "./entitiesType";
import { EntityComplex } from "./entity-complex.class";
import { EntityPoint } from "./entity-point.class";

export class EntityControlPoint<GeomType extends Geometry = Geometry>  extends EntityPoint{
  private coordinate:Coordinate;
  private entityComplex:EntityComplex;
  private styleOver:Style;
  private styleExited:Style;

  
  constructor(entityComplex:EntityComplex,opt_geometryOrProperties?: GeomType | { [key: string]: any }) {
    super(null,null,opt_geometryOrProperties);
    this.entityType = entityType.controlPoint
    this.entityComplex = entityComplex;
    this.createStyles();
    this.setStyle(this.styleExited);
  }
  createStyles() {
    this.styleOver = new Style({
      image: new Icon({
        anchor: [0.5,0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        opacity: 1,
        scale: 0.5,
        // size: [24,24],
        color: 'white',
        src: 'assets/icons/circle24.svg'
      })
    })

    this.styleExited = new Style({
      image: new Icon({
        anchor: [0.5,0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        opacity: 1,
        scale: 1,
        src: 'assets/icons/circle-null.svg'
      })
    })
  }

    // ----------- Listeners
    onMouseOver(ev:MapBrowserEvent):void{
      this.setStyle(this.styleOver);      
    };

    onMouseExit(ev):void{
      this.setStyle(this.styleExited)
    }
    
    public onMouseDown(ev){
      console.log("down en botón de control");
    };
    
}