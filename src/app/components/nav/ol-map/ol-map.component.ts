import { Component, OnInit,AfterViewInit,Input,ElementRef, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {getTopLeft} from 'ol/extent'
import { OSM, Vector} from 'ol/source';
import { Tile} from 'ol/layer';
import * as Proj from 'ol/proj';
// import {register} from 'ol/proj/proj4';
import * as proj4x from 'proj4';

import { Coordinate, toStringHDMS } from 'ol/coordinate';
import {
  defaults as defaultControls,
  Control,
  ScaleLine,
  ZoomSlider
} from 'ol/control';
import Overlay from 'ol/Overlay'
import {fromLonLat, get as getProjection} from 'ol/proj';
import {getWidth} from 'ol/extent';
import { Collection, Feature, Graticule, MapBrowserEvent, MapBrowserEventHandler } from 'ol';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import Circle from 'ol/style/Circle';
import Polygon from 'ol/geom/Polygon';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';
import Modify from 'ol/interaction/Modify';
import Translate from 'ol/interaction/Translate';
import Geometry from 'ol/geom/Geometry';
import BaseEvent from 'ol/events/Event';
import { EventsKey, Listener, ListenerFunction } from 'ol/events';
import { EntityPoint } from 'src/app/entities/entity-point.class';
import LineString from 'ol/geom/LineString';
import { EntityLine } from 'src/app/entities/entity-line.class';
import { EntityArrow } from 'src/app/entities/entity-arrow.class';
import RegularShape from 'ol/style/RegularShape';
import { EntityAxe } from 'src/app/entities/entity-axe.class';
import { EntityControlPoint } from 'src/app/entities/entity-control-point';
import { Entity } from 'src/app/entities/entity.class';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { element } from 'protractor';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';
import { GraticuleUTM } from 'src/app/utilities/graticule';
import { UtmService } from 'src/app/services/utm.service';
import { FloatingMenuComponent } from '../floating-menu/floating-menu.component';

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
  @ViewChild(FloatingMenuComponent)  mainMenu: FloatingMenuComponent;

  public map: Map;
  private mapEl: HTMLElement;
  activatedOperations:boolean = false;

  resolutions = [];
  matrixIds = [];
  proj4326 = getProjection('EPSG:4326');
  maxResolution = getWidth(this.proj4326.getExtent()) / 512;


  // ----------- Entidades de prueba
  entityCircle: EntityPoint;
  entityTriangle: EntityPoint;
  entityFriendly: EntityPoint;
  entityLine: EntityArrow;
  entityAxe: EntityAxe;
  
  vertix: Style;
  triangle: Style;
  circle: Style;

  // -------------- SERVICIO PARA RECIBIR LOS DATOS DE LAS ENTIDADES A VER




  currentLat: Number = DEFAULT_LAT;
  currentLong: Number = DEFAULT_LON;
  lineStyle: Style;
  fromPNG: Style;
  dragFeatures: Collection<Entity<Geometry>> = new Collection<Entity<Geometry>>();
  moveFeatures: Collection<Feature<Geometry>> = new Collection<Feature<Geometry>>();
  shapesFeatures: Collection<Feature<Geometry>> = new Collection<Feature<Geometry>>();
  public shapes: Vector<Geometry> = new VectorSource({features: this.shapesFeatures});
  friendly: Style;
  // svgService: SVGIconsListService;
  
  //-------------------------

  constructor(private elementRef: ElementRef, public entitiesDeployed: EntitiesDeployedService,
    private svgService:SVGUnitsIconsListService,
    private utmService:UtmService) {
    entitiesDeployed.setMapComponent(this);
    // this.svgService = _svgService;
  }
  // attribution = new Attribution({
  //   html: 'Teselas de PNOA cedido por © Instituto Geográfico Nacional de España'
  // });

  tileGrid:WMTSTileGrid;

  ngAfterViewInit(): void {
    // this.setSize;
    this.map.setTarget(this.mapEl);
    this.setCurrentLat(39);

    // const graticule = new GraticuleUTM(this.map,this.utmService).graticule;
    const graticule = new GraticuleUTM(this.map,this.utmService);
    // const vectorLines = new VectorSource();
    // vectorLines.addFeatures(graticule);
    // const layerGraticule = new VectorLayer({ source:vectorLines})

    // this.map.addLayer(layerGraticule);
    this.map.addLayer(graticule.getGraticuleLayer());

    // this.activatedOperations = this.mainMenu.activatedOperations
  }

  catchEvent(activatedOperations){
    this.activatedOperations = activatedOperations == "activated"? true:false;
  }

  private setSize() {
    if (this.mapEl) {
      const styles = this.mapEl.style;
      styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
      styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
    }
  }

  public getCentre():Coordinate{
    return Proj.toLonLat(this.map.getView().getCenter());
  }
  
  public setCurrentLat(lat:Number){
    const proj4 = (proj4x as any).default;

    const centerLatLon = this.getCentre()
    var zone = 1 + Math.floor((centerLatLon[0]+180)/6);
    proj4.defs("UTM",`+proj=utm +zone=${zone} +ellps=WGS84 +datum=WGS84 +units=m +no_defs `);
    const converter = proj4(
      this.proj4326.getCode(),
      "UTM"
    );
    const centerUTM = converter.forward(centerLatLon);
    // console.log("------------- SRC Projection: " + srcProj + "\n")
    // register(src);
    
    // console.log("------------- coordenadas: " + center)
    // this.currentLat = lat;

  }

  drag:Modify = new Modify({
    features:this.dragFeatures,
    style: null
  })
  
  move:Translate = new Translate({
    features: this.moveFeatures
  })
  
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

    var coordinates: Coordinate[] = new Array();
    coordinates.push(
      Proj.fromLonLat([-6,39]),
      Proj.fromLonLat([-6.5,39.5]));

    var coordinatesShape: Coordinate[] = new Array();
    coordinatesShape.push(
      Proj.fromLonLat([-7,39]),
      Proj.fromLonLat([-6.5,39]));
  

    this.entityLine = new EntityArrow(this,{
      geometry: new LineString(coordinates)
    })


    // this.drag = new Modify({
    //   features: new Collection([this.entityTriangle,this.entityLine]),
    //   style: null
    // })
    
    // this.dragFeatures.push(this.entityCircle);
    // this.dragFeatures.push(this.entityTriangle);
    // this.dragFeatures.push(this.entityFriendly);
    // this.dragFeatures.push(this.entityLine);
    
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

    

    this.entityLine.setTextLine("BAZR");
    this.lineStyle = this.entityLine.getStyle();

    // this.shapesFeatures.push(this.entityCircle);
    // this.shapesFeatures.push(this.entityTriangle);
    // this.shapesFeatures.push(this.entityFriendly);
    this.shapesFeatures.push(this.entityLine);



    var entitieslayer = new VectorLayer({
      source: this.shapes
    });

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
        // new TileLayer({
        //   opacity:0.7,
        //   source: new OSM()
        // }),
        // new TileLayer({
        //   opacity: 0.7,
        //   extent: this.proj4326.getExtent(),
        //   source: new WMTS({
        //     url: 'http://www.ign.es/wmts/mapa-raster/',
        //     layer: 'MTN',
        //     matrixSet: 'EPSG:4326',
        //     format: 'image/png',
        //     projection: this.proj4326,
        //     tileGrid: this.tileGrid,
        //     style: 'default',
        //     wrapX: true,
        //     attributions: 'Teselas de PNOA cedido por © Instituto Geográfico Nacional de España'
        //   })
        // }),
        entitieslayer
      ],
      
      view: new View({
        // projection: 'EPSG:4326',
        center: Proj.fromLonLat([this.lon, this.lat]),
        zoom: this.zoom
      }),

      controls: defaultControls().extend([
        new ScaleLine({text:false}),
        new ZoomSlider
      ])
    });

    
    this.entityAxe = new EntityAxe(this,coordinatesShape);


    // this.entityCircle.setStyle(this.circle);
    // this.entityTriangle.setStyle(this.triangle);
    // this.entityFriendly.setStyle(this.friendly);
    // this.entityLine.setStyle([this.lineStyle]);

    this.map.addInteraction(this.drag);
    this.map.addInteraction(this.move);
    // this.map.addInteraction(this.mouseup);

    // this.entityTriangle
    //   .on(
    //     'change',
    //     function(event){
    //       this.mapComponent.currentLat = this.getLocation()[1].toFixed(3);
    //       this.mapComponent.currentLong = this.getLocation()[0].toFixed(3);
    //     });

    // this.entityTriangle.onMouseUp = function (event:MouseEvent):void{
    //   this.mapComponent.currentLat = 0;
    //   this.mapComponent.currentLong = 0;
    // }

    // this.entityFriendly
    //   .on(
    //     'change',
    //     function(event){
    //       this.mapComponent.currentLat = this.getLocation()[1].toFixed(3);
    //       this.mapComponent.currentLong = this.getLocation()[0].toFixed(3);
    //     });

    // this.entityFriendly.onMouseUp = function (event:MouseEvent):void{
    //   this.mapComponent.currentLat = 0;
    //   this.mapComponent.currentLong = 0;
    // }

    var self = this;
    this.map.on("pointermove", function (evt:MapBrowserEvent) {
      
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
        self.shapes.getFeatures().forEach((feature) => {
          (<Entity>feature).onMouseExit(evt);
        })        
      }
    });

    var container = document.getElementById ("popup");
    var content = document.getElementById ("popup-content");
    var closer = document.getElementById ("popup-closer");
    const featureDragging = new Overlay({
      element:content,
      autoPan:true,
      autoPanAnimation:{duration:250}
    })

    this.map.addOverlay(featureDragging);

    var click = this.map.on("singleclick",function (evt:MapBrowserEvent){
      var entity:Entity;
      var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature:Entity, layer) {
        // feature.onMouseOver(evt);
        entity = feature;
        return true;
      }); 
      if (hit) {
        if(entity.entityOptions){
          var coordinate = evt.coordinate;
          var hdms = toStringHDMS(Proj.toLonLat(coordinate));
          console.log("Pinchando en :" + hdms + entity)
          // var svgService = this.svgService;
          content.innerHTML = "<p>" + self.svgService.createSVG(entity.entityOptions,0.50) + "</p>";
          featureDragging.setPosition(coordinate);
          evt.stopPropagation()
        }
        // return true;
      } else {
        featureDragging.setPosition(undefined);
        // closer.blur();
        // return false;    
      }
      
    })

    var dblclick = this.map.on("dblclick",function (evt:MapBrowserEvent){
        var coordinate = evt.coordinate;
        var hdms = toStringHDMS(Proj.toLonLat(coordinate));
        console.log("doble click en :" + hdms)
        
        evt.stopPropagation()
        
        // return true;
    })


    // this.map.on("pointerdrag",function(evt:MapBrowserEvent){
    //   var entity:Entity;
    //   var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature:Entity, layer) {
    //     // feature.onMouseOver(evt);
    //     entity = feature;
    //     return true;
    //   }); 
    //   if (hit) {
    //     (<Entity>entity).onMouseDown(evt);
    //   }
    // })

  } // NgOnInit
} // class OlMapComponent

  const cssUnitsPattern = /([A-Za-z%]+)$/;

function coerceCssPixelValue(value: any): string {
  if (value == null) {
    return '';
  }

  return cssUnitsPattern.test(value) ? value : `${value}px`;
}



