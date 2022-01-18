import { Component, OnInit,AfterViewInit,Input,ElementRef, ViewChild, Renderer2 } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {getTopLeft} from 'ol/extent'
import * as Proj from 'ol/proj';
// import {register} from 'ol/proj/proj4';
import * as proj4x from 'proj4';

import { Coordinate, toStringHDMS } from 'ol/coordinate';
import {
  defaults as defaultControls,
  ScaleLine,
  ZoomSlider
} from 'ol/control';
import Overlay from 'ol/Overlay'
import {get as getProjection} from 'ol/proj';
import {getWidth} from 'ol/extent';
import { Collection, Feature, MapBrowserEvent, MapEvent } from 'ol';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Modify, { ModifyEvent } from 'ol/interaction/Modify';
import Snap, { Options } from 'ol/interaction/Snap';
import Translate, { TranslateEvent } from 'ol/interaction/Translate';
import Geometry from 'ol/geom/Geometry';
// import { EntityPoint } from 'src/app/entities/entity-point.class';
// import LineString from 'ol/geom/LineString';
// import { EntityArrow } from 'src/app/entities/entity-arrow.class';
import RegularShape from 'ol/style/RegularShape';
// import { EntityAxis } from 'src/app/entities/entity-axis.old.class';
import { Entity } from 'src/app/entities/entity.class';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
// import { GraticuleUTM } from 'src/app/utilities/graticule';
import { UtmService } from 'src/app/services/utm.service';
// import { FloatingMenuComponent } from '../floating-menu/floating-menu.component';
import { OperationsService } from 'src/app/services/operations.service';
// import { OperationsComponent } from '../operations/operations.component';
// import { Pixel } from 'ol/pixel';
// import Point from 'ol/geom/Point';
// import { EntityLine } from 'src/app/entities/entity-line.class';
import { distanceInPixelBetweenCoordinates } from 'src/app/utilities/coordinates-calc';
// import Draw, { DrawEvent } from 'ol/interaction/Draw';
// import GeometryType from 'ol/geom/GeometryType';
// import { getCoordsForArc, getCoordsForArcFrom2Points } from 'src/app/utilities/geometry-calc';
import { Globals } from 'src/app/utilities/globals';
import Graticule from "ol-ext/control/Graticule"
import { GraticuleUTM } from 'src/app/utilities/graticule';
import { HTTPEntitiesService } from 'src/app/services/entities.service';
import { features } from 'process';
import { EntityMultiPoint } from 'src/app/entities/entity-multipoint.class';
import { Condition } from 'selenium-webdriver';
import { never } from 'ol/events/condition';
import GeometryType from 'ol/geom/GeometryType';

export const DEFAULT_HEIGHT = '500px';
export const DEFAULT_WIDTH = '100%';

export const DEFAULT_LAT = 39.025;
export const DEFAULT_LON = -6.895;

@Component({
  selector: 'ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.css']
})


export class OlMapComponent implements OnInit,AfterViewInit {
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;
  @Input() zoom: number = 13;
  @Input() width: string | number = DEFAULT_WIDTH;
  @Input() height: string | number = DEFAULT_HEIGHT;
  // @ViewChild(FloatingMenuComponent)  mainMenu: FloatingMenuComponent;
  // @ViewChild("ghostElement") ghostFeature: ElementRef
  // @ViewChild(OperationsComponent) operationComponent: OperationsComponent;


  public map: Map;
  private mapEl: HTMLElement;


  resolutions = [];
  matrixIds = [];
  proj4326 = getProjection('EPSG:4326');
  maxResolution = getWidth(this.proj4326.getExtent()) / 512;


  // ----------- Entidades de prueba
  // entityCircle: EntityPoint;
  // entityTriangle: EntityPoint;
  // entityFriendly: EntityPoint;
  // entityLine: EntityArrow;
  // entityAxis: EntityAxis;
  
  vertix: Style;
  triangle: Style;
  circle: Style;

  // -------------- SERVICIO PARA RECIBIR LOS DATOS DE LAS ENTIDADES A VER

  currentLat: Number = DEFAULT_LAT;
  currentLong: Number = DEFAULT_LON;
  lineStyle: Style;
  fromPNG: Style;
  dragFeatures: Collection<Feature<Geometry>> = new Collection<Feature<Geometry>>();
  moveFeatures: Collection<Feature<Geometry>> = new Collection<Feature<Geometry>>();
  snapFeatures: Collection<Feature<Geometry>> = new Collection<Feature<Geometry>>();
  shapesFeatures: Collection<Entity<Geometry>> = new Collection<Entity<Geometry>>();
  public shapesVectorLayer: VectorSource<Geometry> = new VectorSource({features: this.shapesFeatures});
  friendly: Style;
  featureDragging: Overlay;
  isMovingCopyFeature: boolean;
  tileGrid:WMTSTileGrid;
  self: this;
  // svgService: SVGIconsListService;


  drag:Modify = new Modify({
    features:this.dragFeatures
  })
  
  move:Translate = new Translate({
    features: this.moveFeatures
  })


  snap:CustomSnap = new CustomSnap({
    source: this.shapesVectorLayer,
    // features: this.dragFeatures,
    pixelTolerance:40
  })
  callTimes: number;
  dragSource: VectorSource<Geometry>;
  modify: Modify;


  //-------------------------

  constructor(private elementRef: ElementRef, 
    public entitiesDeployedService: EntitiesDeployedService,
    private utmService:UtmService,
    // private renderer: Renderer2,
    public operationsService:OperationsService,
    public entitiesService:HTTPEntitiesService) {
    entitiesDeployedService.setMapComponent(this);
    this.self = this;
    
    // this.svgService = _svgService;
  }
  // attribution = new Attribution({
  //   html: 'Teselas de PNOA cedido por © Instituto Geográfico Nacional de España'
  // });


  ngAfterViewInit(): void {
    // this.setSize;
    this.map.setTarget(this.mapEl);
    this.setCurrentLat(39);
    // this.isMovingCopyFeature = this.ghostElement.isMovingCopyFeature;

    // const graticule = new GraticuleUTM(this.map,this.utmService).graticule;
    const graticule = new GraticuleUTM(this.map,this.utmService);
    // const vectorLines = new VectorSource();
    // vectorLines.addFeatures(graticule);
    // const layerGraticule = new VectorLayer({ source:vectorLines})

    // this.map.addLayer(layerGraticule);
    this.map.getLayers().insertAt(1,graticule.getGraticuleLayer());

    
    // this.drag = new Modify({
    //   features:this.dragFeatures,
    // })
    
    // this.move = new Translate({
    //   features: this.moveFeatures
    // })


    var coordinates: Coordinate[] = new Array();
    coordinates.push(
      Proj.fromLonLat([-6,39]),
      Proj.fromLonLat([-6.5,39.5]));

    var coordinatesShape: Coordinate[] = new Array();
    coordinatesShape.push(
      Proj.fromLonLat([-7,39]),
      Proj.fromLonLat([-6.5,39]));
  



    // const line = new Feature(new LineString([[-6,39],[-6,40]]))
    // const line = new EntityLine(null,new LineString(coordinates))
    // const point = new EntityPoint(null,null,new Point(coordinatesShape[0]))
    // const point = EntitySelector.getFactory(entityType.point).createEntity(null,[0,0]);

    // this.snap = new Snap({
    //   source: this.shapesVectorLayer,
    //   features: this.snapFeatures,
    //   pixelTolerance:30,
    // })

    // this.shapesFeatures.push(line)
    // this.dragFeatures.push(line)
    // this.snap.addFeature(line)

    // this.shapesFeatures.push(point)
    // this.dragFeatures.push(point)
    // this.snap.addFeature(point)

    // this.snap.setActive(true)
    // this.snap.setActive(true)

    // this.activatedOperationsFormOpened = this.mainMenu.activatedOperationsFormOpened

    Globals.MAP = this.map
    Globals.SHAPES_VECTOR_LAYER = this.shapesVectorLayer
    Globals.DRAG_SOURCE = this.dragSource
    Globals.MODIFY = this.modify
    
  }

  onPointerMove():void {
    console.log("Moviendo")
  }

  catchEvent(activatedOperationsFormOpened){
    this.operationsService.activatedOperationsFormOpened = activatedOperationsFormOpened == "activated";
    if(this.operationsService.activatedOperationsFormOpened){
      // deactivate drag
      this.map.removeInteraction(this.drag);
    }else{
      // this.map.addInteraction(this.drag);
    }
  }

  private setSize() {
    if (this.mapEl) {
      const styles = this.mapEl.style;
      styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
      styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
    }
  }

  public getLatLonCenter():Coordinate{
    return Proj.toLonLat(this.map.getView().getCenter());
  }
  
  public setCurrentLat(lat:Number){
    const proj4 = (proj4x as any).default;

    const centerLatLon = this.getLatLonCenter()
    var zone = 1 + Math.floor((centerLatLon[0]+180)/6);
    proj4.defs("UTM",`+proj=utm +zone=${zone} +ellps=WGS84 +datum=WGS84 +units=m +no_defs `);
    const converter = proj4(
      this.proj4326.getCode(),
      "UTM"
    );
    const centerUTM = converter.forward(centerLatLon);
  }

  ngOnInit(): void {
    for (var z = 0; z < 18; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      this.resolutions[z] = this.maxResolution / Math.pow(2, z);
      this.matrixIds[z] = "EPSG:4326:" + z;
    }
    this.tileGrid = new WMTSTileGrid({
      origin: getTopLeft(this.proj4326.getExtent()),
      resolutions: this.resolutions,
      matrixIds: this.matrixIds,
    });


    // this.entityTriangle = new EntityPoint(this,{
    //   geometry: new Point(Proj.fromLonLat([this.lon, this.lat])),
      
    //   name: 'Base General menacho',
    //   population: 4000,
    //   rainfall: 500
    // })


    // this.entityCircle = new EntityPoint(this,{
    //   geometry: new Point(Proj.fromLonLat([this.lon, this.lat])),
      
    //   // name: 'Base General menacho',
    //   // population: 4000,
    //   // rainfall: 500
    // })


    // this.entityFriendly = new EntityPoint(this,{
    //   geometry: new Point(Proj.fromLonLat([this.lon, this.lat])),
      
    //   // name: 'Base General menacho',
    //   // population: 4000,
    //   // rainfall: 500
    // })

    //  const line = new Feature({
    //   geometry: new LineString(coordinates)
    // })

    // const point = new Feature(new Point(coordinatesShape[0]))

    // this.drag = new Modify({
    //   features: new Collection([this.entityTriangle,this.entityLine]),
    //   style: null
    // })
    
    // this.dragFeatures.push(this.entityCircle);
    // this.dragFeatures.push(this.entityTriangle);
    // this.dragFeatures.push(this.entityFriendly);
    // this.dragFeatures.push(line);
    
    // this.drag = new Modify({
    //   features:this.dragFeatures
    // });


    // this.lineStyle = new Style({
    //   image: new LineString
    // })

    this.vertix = new Style({
      image: new Circle({
        radius: 7,
        fill: new Fill({color: 'red'}),
        stroke: new Stroke({
          color: 'black', width: 2
        })
      })
    })

    this.circle = new Style({
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

    const svg = encodeURIComponent("<svg width='80' height='60' version='1.1' xmlns='http://www.w3.org/2000/svg'> <path d='m0,0h80v60h-80z' stroke-width = '2' stroke = 'black' fill = '#88E0FF' /></svg>");

    this.friendly = new Style({
      image: new Icon({
        anchor: [0.5,0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        opacity: 1,
        scale: 0.5,
        // size: [24,24],
        // color: 'black',
        src: "data:image/svg+xml;charset=utf-8," + svg
      })
    })


    this.triangle = new Style({
      image: new RegularShape({
        fill: new Fill({color: 'red'}),
        stroke: new Stroke({color: 'black', width: 2}),
        points: 3,
        radius: 10,
        rotation: 0,
        angle: 0,
      })
    })


    this.fromPNG = new Style({
      image: new Icon({
        anchor: [0.5,0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        opacity: 1,
        // size: [24,24],
        color: 'blue',
        src: 'assets/icons/up-arrow.png'
      })
    })


    var entitiesLayer = new VectorLayer({
      source: this.shapesVectorLayer,
      renderOrder:(a:Entity,b:Entity) => {
        try{
          return a.getStackOrder() >= b.getStackOrder() ? 1 : -1
        }catch{
          return 1
        }
      }
    });

    // const c = ol_coordinate_cspline([[0, 0], [10, 10]])
    // console.log(ol_coordinate_cspline(c));

    this.mapEl = this.elementRef.nativeElement.querySelector('#map');
    // this.setSize();
    
    this.map = new Map({
      target: 'map',
      layers: [    
        new TileLayer({
        source: new XYZ({
          // url:'http://www.ign.es/wmts/mapa-raster?Layer=MTN&Style=default&TileMatrixSet=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=EPSG:4326:{z}&TileCol={x}&TileRow={y}',
          url:'http://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=bb5346dadb604ab0b91120d54245887b	',
          attributions: 'de tunder'
        }),
        opacity: 1
      }),
        entitiesLayer
      ],
      
      view: new View({
        // projection: 'EPSG:4326',
        center: Proj.fromLonLat([this.lon, this.lat]),
        zoom: this.zoom
      }),

      controls: defaultControls().extend([
        new ScaleLine({text:false}),
        new ZoomSlider,
        // new Graticule({ projection: "EPSG:4326" })
      ])
    });


    // const arc:Draw = new Draw({
    //   source:this.shapesVectorLayer,
    //   type: GeometryType.LINE_STRING,
    //   // style:new Style({
    //   //   stroke: new Stroke({
    //   //     color: "#00000001"
    //   //   })
    //   // }),
    //   maxPoints:2
    // }) 

    // this.map.addInteraction(arc);

    // arc.on("drawend", (evt:DrawEvent) => {
    //   const p1 = (<LineString>evt.feature.getGeometry()).getCoordinates()[0];
    //   const p2 = (<LineString>evt.feature.getGeometry()).getCoordinates()[1];
      
    //   const ls = new Feature(new LineString(getCoordsForArcFrom2Points(p1,p2,Math.PI/2)))
    //   evt.feature.setStyle(new Style({
    //     stroke: new Stroke({
    //       color: "#00000001"
    //     })
    //   }))

        
    //   // const center = (<Point>(evt.feature.getGeometry())).getCoordinates();
    //   // const ls = new Feature(new LineString(getCoordsForArc(center,500,Math.PI,Math.PI/2,20)))
    //   this.shapesVectorLayer.addFeature(ls);
    //   // evt.feature = null
    // })
    // // this.map.setPerspective(30)

    this.map.on("change", (evt:MapEvent) => {
      // evt..forEach(feature => {
      //   // // Guardar las nuevas coordenadas en la BD
      //   // this.httpEntitiesService.updateCoordinates(<EntityPoint>feature).subscribe(
      //   //   data => {
      //   //     console.log(data);
      //   //   }
      //   // );
      //   this.operationsService.updateEntityPositionInOperation(<Entity>feature)
      //   // (<EntityPoint>feature).setCoordinates(this.httpEntitiesService,(<EntityPoint>feature).getCoordinates())
      // })

            console.log("moviendo");
    })

    this.move.on("translateend",(evt:TranslateEvent)=> {
      evt.features.forEach(feature => {
        this.operationsService.updateEntityPositionInOperation(<Entity>feature)
      })
    })


    this.map.addInteraction(this.snap);


    this.dragSource = new VectorSource();

    this.modify = new Modify({
      source:this.dragSource,
      insertVertexCondition:((ev) => {
        if(this.dragSource.getFeatures()[0] instanceof EntityMultiPoint)
          return false
        return true
      })
    })

    this.map.addInteraction(this.modify);


    this.map.on("pointermove", (e) => {
      if (e.dragging) {
        this.modify;
        return;
      }
      var features = this.map.getFeaturesAtPixel(e.pixel, {
        layerFilter: function(l) {
          return l == entitiesLayer;
        }
      });
      if (features.length > 0 && features[0] != this.dragSource.getFeatures()[0]) {
        this.dragSource.clear();
        const feature = <Feature>features[0]
        this.dragSource.addFeature(feature);          
      }
    });


    this.drag.on("modifystart",(evt:ModifyEvent) => {
      console.log("")
      const features: Feature[] = evt.features.getArray()
      features.splice(0,features.length - 1)
    })

    this.modify.on("modifystart", function (evt:ModifyEvent) {
      console.log("arrastrando")
    })
    
    this.modify.on("modifyend",(evt:ModifyEvent) => {
      if(evt.features.getLength() > 0)
        (<Entity>evt.features.getArray()[0]).onModifyEnd(evt,this.map,this.shapesFeatures,this.operationsService,this.entitiesService)
    })


var self = this;
this.map.on("pointermove", function (evt:MapBrowserEvent) {
  if(this.locatingEntity){

  }else{
    var entity:Entity;
    var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature:Entity, layer) {
      // feature.onMouseOver(evt);
      entity = feature;
      return true;
    }); 
    if (hit) {
      this.getTargetElement().style.cursor = 'pointer';
      try{
        entity.onMouseOver(evt);
      }catch{
        console.log("Feature predefinida");
      }
    } else {
      this.getTargetElement().style.cursor = '';
      // self.onMouseExit(evt);
      // self.shapesVectorLayer.getFeatures().forEach((feature) => {
      //   (<Entity>feature).onMouseExit(evt);
      // })        
    }
  }
}); // Fin pointermove

    var container = document.getElementById ("popup");
    var content = document.getElementById ("popup-content");
    var closer = document.getElementById ("popup-closer");
    self.featureDragging = new Overlay({
      element:content,
      autoPan:true,
      autoPanAnimation:{duration:250}
    })

    this.map.addOverlay(this.featureDragging);

    // this.map.on("pointermove",(evt:MapBrowserEvent) => {
      
    //   if (this.isMovingCopyFeature){
    //     featureDragging.setPosition(evt.coordinate);
    //   }
    // })

    this.map.addEventListener("mousedown",(ev:Event):boolean => {
      return false
    });


    this.map.on("mousedown",(evt:MapBrowserEvent)=> {
      console.log("PINCHANDOOOOOOOOOOOOOOOOOOO");
    });

    // this.map.addEventListener("pointermove",(ev:Event):boolean => {
    //   return false
    // });

    this.map.on("singleclick", (evt:MapBrowserEvent) =>{
      var entity:Entity;
      var hit = this.map.forEachFeatureAtPixel(evt.pixel, function(feature:Entity, layer) {
        // feature.onMouseOver(evt);
        entity = feature;
        return true;
      }); 
      if (hit) {
        // if(!this.isMovingCopyFeature){
          // this.isMovingCopyFeature = true;
          if(this.operationsService.activatedOperationsFormOpened){
            // var coordinate = evt.pixel;
            // var hdms = toStringHDMS(Proj.toLonLat(coordinate));
            // console.log("Pinchando en :" + hdms + entity)
            // var svgService = this.svgService;
            // this.ghostElement.update(evt.pixel,entity)
            this.operationsService.addEntityToTimeline(entity);
            // this.ghostFeature.nativeElement.left = evt.pixel[0];
            // this.ghostFeature.nativeElement.top = evt.pixel[1];
            // this.featureDragging.setPosition(coordinate);
            evt.stopPropagation()
          }
        // }else{
          // this.isMovingCopyFeature = false;
        // }
        // return true;
      } else {
        this.featureDragging.setPosition(undefined);
          this.isMovingCopyFeature = false;
        // closer.blur();
        // return false;    
      }
      
    })

    this.map.on("dblclick",function (evt:MapBrowserEvent){
        var coordinate = evt.coordinate;
        var hdms = toStringHDMS(Proj.toLonLat(coordinate));
        console.log("doble click en :" + hdms)
        
        evt.stopPropagation()
        
        // return true;
    })
  } // NgOnInit



  // on(type: 'mousedown', listener: (evt: BaseEvent) => void): void{

  // }

} // class OlMapComponent

  const cssUnitsPattern = /([A-Za-z%]+)$/;

function coerceCssPixelValue(value: any): string {
  if (value == null) {
    return '';
  }

  return cssUnitsPattern.test(value) ? value : `${value}px`;
}


export class CustomSnap extends Snap{
  features:Feature<Geometry>[] = [];

  constructor(opt_options?: Options){
    super(opt_options)
  }
  addFeature(feature:Feature<Geometry>, opt_listen?: boolean):void{
    super.addFeature(feature,opt_listen);
    if(!this.features.includes(feature))
      this.features.push (feature)
  }
  removeFeature(feature:Feature<Geometry>, opt_listen?: boolean):void{
    super.removeFeature(feature,opt_listen);
    if(this.features.includes(feature))
      this.features = this.features.filter(item => item != feature);
  }
  clearFeatures(){
    this.features.forEach(feature => {
      this.removeFeature(feature)
    });
  }    
}