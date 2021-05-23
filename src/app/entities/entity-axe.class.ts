
import { Map } from "ol";
import { Coordinate, distance } from "ol/coordinate";
import BaseEvent from "ol/events/Event";
import Geometry from "ol/geom/Geometry";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import { TranslateEvent } from "ol/interaction/Translate";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import { getOrientation, getParallelLine, getParallelLineWithEndOffset, getPointToVector, LEFT, middlePoint, RIGHT } from "../utilities/geometry-calc";
import { EntityBackBone } from "./entity-backbone.class";
import { EntityComplex } from "./entity-complex.class";
import { EntityControlPoint } from "./entity-control-point";
import { EntityLine } from "./entity-line.class";
import { EntityPointOfLabel } from "./entity-point-of-label.class";
import { EntityPoint } from "./entity-point.class";

export class EntityAxe<GeomType extends Geometry = Geometry>  extends EntityComplex{
    // Entities components
    private backbone:EntityBackBone;
    private rightLine:EntityLine;
    private leftLine:EntityLine;
    private tipLine: EntityLine;
    private pointOfLabel: EntityPoint;
    private controlWidthPoint: EntityPoint;

    public WIDTH = 5000;
    DIVISOR: number = 4;


    constructor(mapComponent:OlMapComponent,coordinates: Coordinate[]){
        super(mapComponent,coordinates);

        // Create backbone
        this.backbone = new EntityBackBone(mapComponent,[this.rightLine,this.leftLine],{
            geometry: new LineString(coordinates)
        })

        this.backbone.lineColor = [255,0,0,0];
        this.backbone.lineWidth = 20;
        this.backbone.textLine = "";
        this.backbone.textAlign = "end";
        this.backbone.textBaseline = "middle";
        this.backbone.activateStyle();

        mapComponent.dragFeatures.push(this.backbone);
        mapComponent.shapes.addFeature(this.backbone);

        // Create both lateral lines
        this.rightLine = new EntityLine(mapComponent,{
            geometry: new LineString(getParallelLineWithEndOffset(coordinates,this.WIDTH/2,RIGHT,this.WIDTH))
        })

        this.rightLine.setStyle(this.rightLine.getStyle());
        mapComponent.shapes.addFeature(this.rightLine);

        this.leftLine = new EntityLine(mapComponent,{
            geometry: new LineString(getParallelLineWithEndOffset(coordinates,this.WIDTH/2,LEFT,this.WIDTH))
        })

        this.leftLine.setStyle(this.leftLine.getStyle());
        mapComponent.shapes.addFeature(this.leftLine);

        this.tipLine = new EntityLine(mapComponent,{
            geometry: new LineString(this.getTipLine())
        })

        this.tipLine.activateStyle();
        mapComponent.shapes.addFeature(this.tipLine);

        // create point of label

        this.pointOfLabel = new EntityPointOfLabel(mapComponent,{
            geometry: new Point(this.coordinates[0])
        })

        this.pointOfLabel.textLine = "Eje";
        this.pointOfLabel.activateStyle();
        mapComponent.shapes.addFeature(this.pointOfLabel);
        
        // create point of Lateral Control

        this.controlWidthPoint = new EntityControlPoint(mapComponent,this,{
            geometry: new Point(this.tipLine.getCoordinate(1))
        })
        
        mapComponent.moveFeatures.push(this.controlWidthPoint);

        // this.pointOfLabel.activateStyle();
        mapComponent.shapes.addFeature(this.controlWidthPoint);

        
        var self = this;
        this.backbone.on("change",
        function(){
            var newCoordinates:Coordinate[] = self.getCoordinates();
            self.updateShape(newCoordinates);
        })

        this.olMap.move.on("translating",(evt) => this.onDrag(evt));


        // this.controlWidthPoint.on("change",
        // function (ev) {
        //     var angleOfAxe = getOrientation(self.backbone.getPenultimate(),self.backbone.getEnd()) + Math.PI/2;
        //     var initMovePoint = self.tipLine.getPenultimate();
        //     var newPosition = (<Point>this.getGeometry()).getCoordinates();
        //     var angleOfPoint = getOrientation(initMovePoint,newPosition) - angleOfAxe;
        //     var newWidth = Math.cos(angleOfPoint) * distance(initMovePoint,newPosition);
        //     var finalPosition = getPointToVector(initMovePoint,angleOfAxe,newWidth);

        //     (<Point>self.controlWidthPoint.getGeometry()).setCoordinates(finalPosition);

        //     self.WIDTH = newWidth * 4 / 3;

        //     console.log(angleOfAxe + " " + initMovePoint + " " + newPosition);
            
        //     // self.WIDTH =10000;
        //     // self.updateShape();
        // })
    } // constructor


    private updateShape(newCoordinates:Coordinate[] = this.getCoordinates()):void{
        (<LineString>this.rightLine.getGeometry()).setCoordinates(getParallelLineWithEndOffset(newCoordinates,this.WIDTH/2,RIGHT,this.WIDTH));
        (<LineString>this.leftLine.getGeometry()).setCoordinates(getParallelLineWithEndOffset(newCoordinates,this.WIDTH/2,LEFT,this.WIDTH));
        (<LineString>this.tipLine.getGeometry()).setCoordinates(this.getTipLine());
        (<Point>this.pointOfLabel.getGeometry()).setCoordinates(newCoordinates[0]);
        (<Point>this.controlWidthPoint.getGeometry()).setCoordinates(this.tipLine.getCoordinate(1));
    }

    getCoordinates(): Coordinate[] {
        return (<LineString>this.backbone.getGeometry()).getCoordinates();
    }

    private getTipLine(): Coordinate[] {
        var tip:Coordinate[] = [];
        tip.push(this.rightLine.getEnd());
        var angle = getOrientation(this.rightLine.getPenultimate(),this.rightLine.getEnd());
        tip.push(getPointToVector(this.rightLine.getEnd(),angle + Math.PI/2,this.WIDTH/this.DIVISOR));
        tip.push(this.backbone.getEnd());
        tip.push(getPointToVector(this.leftLine.getEnd(),angle - Math.PI/2,this.WIDTH/this.DIVISOR));
        tip.push(this.leftLine.getEnd());

        return tip;
    }

    public onDrag(evt:TranslateEvent){
        var centreOfAxe = middlePoint(this.tipLine.getStart(),this.tipLine.getEnd());
        var angleOfAxe = getOrientation(this.backbone.getPenultimate(),this.backbone.getEnd()) + Math.PI/2;
        var newPosition = evt.coordinate;
        var angleOfPoint = getOrientation(centreOfAxe,newPosition) - angleOfAxe;
        var newDistanceToCentre = distance(centreOfAxe,newPosition);
        var newPerpendicullarDistanceToCentre = Math.cos(angleOfPoint) * newDistanceToCentre;

        if(newPerpendicullarDistanceToCentre >= this.WIDTH / 2)
        this.WIDTH = (newPerpendicullarDistanceToCentre * 3 / this.DIVISOR) * 2;
        this.updateShape();
    }

    /**
     * putWIDTH
width:number     */
    public  putWIDTH(width:number) {
        this.WIDTH = width;
    }

    /**
     * getWIDTH
     */
    public getWIDTH() {
        return this.WIDTH;
    }
}


