import { Feature } from "ol";
import { Extent } from "ol/extent";
import LineString from "ol/geom/LineString";
import Map from "ol/Map";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { UtmService } from "../services/utm.service";
import * as Proj from 'ol/proj';
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";

export class GraticuleUTM{
    extends: Extent;
    verticalLines: Feature<LineString>[] = [];
    extendsUTM: Extent;
    horizontalLines:  Feature<LineString>[] = [];
    graticule: Feature<LineString>[];
    graticuleLayer: VectorLayer<VectorSource<any>>;
    vectorLines: VectorSource<Geometry>;
    constructor(private map:Map,private utmService?:UtmService ){
        this.vectorLines = new VectorSource();
        this.graticuleLayer = new VectorLayer({ source:this.vectorLines})
        this.drawGraticule();
        // this.vectorLines.addFeatures(this.graticule);
        map.on("moveend",() => drawGraticuleFnt(this));
    }

    getGraticuleLayer():VectorLayer<VectorSource<any>>{
      return this.graticuleLayer;
    }

    drawGraticule(){
        this.extends = this.map.getView().calculateExtent()
        this.extendsUTM = <Extent>this.utmService.forward(this.extends);
        const zoom = this.map.getView().getZoom();
        this.verticalLines = [];
        this.horizontalLines = [];
        if (zoom > 7){
            var separacion;
            switch (Math.floor(zoom)){
                case 7: case 8: case 9: 
                    separacion = 50;
                    break;
                case 10:
                    separacion = 10;
                    break; 
                case 11:
                    separacion = 5;
                    break;
                case 12: 
                    separacion = 2;
                    break;
                // case 13: 
                //     separacion = 2;
                //     break;
                default:
                    separacion = 1;
            }
            const firstVerticalLineCoords = [[this.extendsUTM[0],this.extendsUTM[1]],[this.extendsUTM[0],this.extendsUTM[3]]];
            const lastVerticalLineCoords = [[this.extendsUTM[2],this.extendsUTM[1]],[this.extendsUTM[2],this.extendsUTM[3]]];
            const firstHorizontalLineCoords = [[this.extendsUTM[0],this.extendsUTM[1]],[this.extendsUTM[2],this.extendsUTM[1]]];
            const lastHorizontalLineCoords = [[this.extendsUTM[0],this.extendsUTM[3]],[this.extendsUTM[2],this.extendsUTM[3]]];
            let initialIndex = Math.floor(Math.floor(firstVerticalLineCoords[0][0] / 1000) / separacion) * separacion 
            for(let i = initialIndex - separacion; i < Math.ceil(lastVerticalLineCoords[0][0] / 1000) ; i += separacion){
                var newLine  = new Feature(new LineString(
                [Proj.fromLonLat(this.utmService.inverse([i * 1000,this.extendsUTM[1]])),
                Proj.fromLonLat(this.utmService.inverse([i * 1000,this.extendsUTM[3]]))]));
                newLine.setStyle(new Style({
                    stroke:new Stroke({width:1,color:'#3FBFFF'}),
                    text: new Text({
                        text: i.toString(),
                        placement: "point",
                        textAlign: "end",
                        textBaseline: 'middle',
                        rotation: -Math.PI/2,
                        backgroundFill: new Fill({color:"white"})
                    })
                }))
                this.verticalLines.push(newLine);
            }
            initialIndex = Math.floor(Math.floor(firstHorizontalLineCoords[0][0] / 1000) / separacion) * separacion 
            
            for(let i = initialIndex - separacion; i < Math.ceil(lastHorizontalLineCoords[0][1] / 1000) ; i += separacion){
                var newLine  = new Feature(new LineString(
                [Proj.fromLonLat(this.utmService.inverse([this.extendsUTM[0],i * 1000])),
                Proj.fromLonLat(this.utmService.inverse([this.extendsUTM[2],i * 1000]))]));
                newLine.setStyle(new Style({
                    stroke:new Stroke({width:1,color:'#3FBFFF'}),
                    text: new Text({
                        text: i.toString(),
                        placement: "point",
                        textAlign: "end",
                        textBaseline: 'middle',
                        // rotation: -Math.PI/2,
                        backgroundFill: new Fill({color:"white"})
                    })
                }))
                this.horizontalLines.push(newLine);
            }
            this.graticule = this.verticalLines.concat(this.horizontalLines);
            this.vectorLines.refresh()
            this.vectorLines.addFeatures(this.graticule)
            this.graticuleLayer.setSource(this.vectorLines)
        }else{
            this.graticule = [];
            this.vectorLines.refresh()
            this.vectorLines.addFeatures(this.graticule)
            this.graticuleLayer.setSource(this.vectorLines)

        }

    }
    

}

    function drawGraticuleFnt(graticule:GraticuleUTM){
        graticule.drawGraticule();
    }