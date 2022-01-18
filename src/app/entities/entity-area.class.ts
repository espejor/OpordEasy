import { Feature } from "ol";
import { Color } from "ol/color";
import { ColorLike } from "ol/colorlike";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import Geometry from "ol/geom/Geometry";
import MultiPoint from "ol/geom/MultiPoint";
import Polygon from "ol/geom/Polygon";
import { Size } from "ol/size";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
// import { AppInjector } from "../app.module";
// import { EntitiesDeployedService } from "../services/entities-deployed.service";
import { Globals } from "../utilities/globals";
import { angleBetweenPixels, distanceBetweenPixels, offsetFromPixel } from "../utilities/pixels-geometry";
import { entityType } from "./entitiesType";
import { Entity, EntityOptions, Pattern } from "./entity.class";

export class EntityArea<GeomType extends Geometry = Geometry> extends Entity {
    areaOptions: AreaOptions;
    type: string;
    name: string;
    areaStyle: Style;
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

    constructor(areaOptions?:AreaOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?:string) {
        super(areaOptions,null,opt_geometryOrProperties,id);
        this.entityType = entityType.area
        this.areaOptions = areaOptions;

        if(areaOptions){
            this.name = areaOptions.name;
            this.type = areaOptions.typeArea;
            this.pattern = areaOptions.pattern;
            
        }
        this.areaStyle = this.getStyle()
        // this.centralIconStyle = this.configureEchelonIcon(feature,areaOptions.echelon,areaOptions.svgWidth);
        // this.startTextStyle = this.configureStartText();
        // this.endTextStyle = this.configureEndText();
        // this.purposeEndStyle = this.configureEndPurposeText();
        this.purposeStyle = this.configurePurposeText();
        // this.pointStyle = this.getPoint()
        // this.trianglePatternStyles = this.createTrianglePattern();
        const entity = this;
        var stylesFunction = function(feature:Feature){
            const styles: Style[] = []
            if(areaOptions.typeArea)
                styles.push(entity.configureTypeArea(areaOptions.typeArea));
            // styles.push(entity.startTextStyle);
            // styles.push(entity.endTextStyle);
            if (areaOptions.lineVisible)
                styles.push(entity.areaStyle);
            // styles.push(entity.pointStyle);
            if(areaOptions.pattern)
                styles.push(...entity.createPattern(feature));
            if(areaOptions.echelon)
                styles.push(...entity.configureEchelonIcon(feature,areaOptions.echelon,areaOptions.svgWidth));
            if(areaOptions.purpose){
                styles.push(entity.purposeStyle);
            }
            return styles
        }

        if(areaOptions){
            this.styles = stylesFunction;
            this.setStyle(this.styles)
        }
    }
    configureTypeArea(typeArea: string): Style {
        const text: string = typeArea; 
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

        
  setFlatCoordinatesfromLocation(coordinates?: Coordinate[] | Coordinate) {
    if(coordinates)
      this.location = coordinates
    this.setCoordinates(this.location);
  }

  
  setCoordinates(coordinates: Coordinate[] | Coordinate) {
    var newCoords:Coordinate[][] = [];
    newCoords[0] = <Coordinate[]>coordinates;
    this.getEntityGeometry().setCoordinates(newCoords);
  }

    
  createPattern(feature:Feature):Style[] {
    const entity = this;
    var stylesList:Style[] = [];
    // const wide = 20; // pixels
    // const gap = 0;  // pixels
    const map = Globals.MAP
    // const map = AppInjector.get(EntitiesDeployedService).getMapComponent().map;
    // var coords:Coordinate[] = []
    var angle = 0
    // var area = <Polygon>feature.getGeometry();

    const coords = this.getCoordinates()
    for (let i = 0; i < coords.length - 1; i++) {
        const coordinates = []
        const from = coords[i];
        const to = coords[i + 1];

        const fromPx = map.getPixelFromCoordinate(from);
        const toPx = map.getPixelFromCoordinate(to);
        const distance = distanceBetweenPixels(fromPx,toPx);
        angle = angleBetweenPixels(fromPx,toPx);
        const nShapes = ((distance + entity.pattern.gap)/(entity.pattern.wide + entity.pattern.gap));  // número de repeticiones
        const mod = nShapes - Math.floor(nShapes);
        const initialGap = mod * entity.pattern.wide/2
        for (let i = 0; i < nShapes-1; i++) {
            const coordinate = map.getCoordinateFromPixel(offsetFromPixel(fromPx,((entity.pattern.wide + entity.pattern.gap ) * i )+ initialGap,angle));
            coordinates.push(coordinate)
        }
        // const lastCoord = coords.splice(length-1,1)
        const mp = new MultiPoint(coordinates)
        var mpStyle = new Style({
            geometry: mp,
            
            image: new Icon({
            opacity: 1,
            size:[20,20],
            src: entity.pattern.pattern,
            scale: 1,
            anchor:entity.pattern.anchor,
            // color:"black",
            rotation:angle + Math.PI
            })   
        })

      stylesList.push(mpStyle)

    }
    return stylesList;
  }


    public getStyle(): Style{
        this.style = new Style({      
          text: new Text({
            text: this.name,
            placement: this.placement,
            textAlign: this.textAlign,
            textBaseline: this.textBaseline,
            rotateWithView: this.rotateWithView,
            scale: this.scale,
            stroke: new Stroke({
              color: this.textColor
            })
          }),
          stroke: new Stroke({
            color: this.lineColor,
            width: this.lineWidth,
            lineJoin: this.lineJoin
          })
        });
        return this.style;
    }
        
    public configureEchelonIcon(feature:Feature,imageSrc:string,svgWidth:number):Style[]{
        var styles:Style[] = [];
        const from = (<Polygon>feature.getGeometry()).getFirstCoordinate()
        const to = (<Polygon>feature.getGeometry()).getCoordinates()[0][1]
        
        const centre = [(from[0] + to[0])/2,(from[1] + to[1])/2]
        const rotation = Math.atan2(to[1] - from[1], to[0] - from[0]);
        styles.push(new Style({
            geometry: new Point(centre), 
            image: new Icon({
                opacity: 1,
                // size:[80,80],
                src: "assets/icons/ghost_line.svg",
                // scale: 1,
                anchor:[0.5,0.5],
                rotation: -rotation,
                scale:[svgWidth,5]
            })      
        }))
        styles.push(new Style({
            geometry: new Point(centre), 
            image: new Icon({
                opacity: 1,
                // size:[80,80],
                src: imageSrc,
                scale: 1,
                anchor:[0.5,0.5],
                rotation: -rotation
            })      
        }))
        
    
        return styles
    }
        
    public configurePurposeText():Style{
        if(this.areaOptions.purpose){
        const text: string = this.areaOptions.purpose; 
        const style = new Style({
            geometry: function(feature){
                return (<Polygon>feature.getGeometry()).getInteriorPoint()
                // const start = new Point((<Polygon>feature.getGeometry()).getFirstCoordinate());
                // const end = new Point((<Polygon>feature).getCoordinates()[0][1]);
                // const rotation = (<EntityLine>feature).getOrientation(end, start);
                // (<EntityLine>feature).purposeStartStyle.getText().setRotation(-rotation);
                // return new Point((<LineString>feature.getGeometry()).getFirstCoordinate())
            } ,
            text:new Text({
            stroke: this.stroke,
            text: text,
            // placement: "point",
            // textAlign: "start",
            // textBaseline: "middle",
            offsetX: text.length * -5,
            offsetY: -7,
            rotateWithView:true,
            // rotation: -rotation, 
            // overflow:true,
            padding:[10,10,10,10],
            scale:this.scale
            })
        });
        return style;
        }
        return null
    }


        
    getEntityGeometry():Polygon{
        return <Polygon>super.getGeometry();
    }

    public getCoordinate(index:number):Coordinate{
        var coordinates:Coordinate[][] = (<Polygon>this.getGeometry()).getCoordinates();
        return coordinates[0][index];
    }

    getCoordinates():Coordinate[]{
        return this.getEntityGeometry().getCoordinates()[0];
    }


}


export class AreaOptions extends EntityOptions{
    name?:string;   //T field
    typeArea?:string; // LL, PL ...
    purpose?:string;  // RFL...
    pattern?:Pattern;  // 
    coordinationMessures?:string;  // p.e. Controlling HQ
    dateTimeGroupInitial?: string;  //
    dateTimeGroupFinal?: string;  //
    lineVisible?: boolean; // Si la línea se ha de ver ()
    echelon?:string;
    svgWidth?:number
  }
