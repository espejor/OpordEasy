import { Feature, Map, MapBrowserEvent } from "ol";
import Geometry from "ol/geom/Geometry";
import Style from "ol/style/Style";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";

export class Entity<GeomType extends Geometry = Geometry>  extends Feature{
  protected style: Style;
    protected map: Map;
    protected olMap:OlMapComponent
    public entityOptions:EntityOptions;

    constructor(public mapComponent?: OlMapComponent,opt_geometryOrProperties?: GeomType | { [key: string]: any }) {
        super(opt_geometryOrProperties);
        this.olMap = mapComponent;
        if(this.olMap)
          this.map = mapComponent.map;
        // addEventListener('mouseup',(ev:MouseEvent):void => this.onMouseUp(ev));
        // addEventListener('mouseover',(ev:MouseEvent):void => this.onMouseOver(ev))
      }


    public onMouseOver(ev:MapBrowserEvent){
      console.log("Entrando en entidad");
      
    };    
    public onMouseExit(ev):void{};    
    public onMouseDown(ev):void{
      console.log("down en botón de control");};    

      
    public activateStyle(){
      this.setStyle(this.getStyle());
    }

    public getCustomStyle(){
      return this.style;
    }
    
}

export class EntityOptions{
  enemy:boolean

}