
import { Map } from "ol";
import { Coordinate, distance } from "ol/coordinate";
import BaseEvent from "ol/events/Event";
import Geometry from "ol/geom/Geometry";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import { TranslateEvent } from "ol/interaction/Translate";
import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";
import { getOrientation, getParallelLine, getParallelLineWithEndOffset, getPointToVector, LEFT, middlePoint, RIGHT } from "../utilities/geometry-calc";
import { Globals } from "../utilities/globals";
import { entityType } from "./entitiesType";
import { EntityBackBone } from "./entity-backbone.class";
import { EntityComplex } from "./entity-complex.class";
import { EntityControlPoint } from "./entity-control-point";
import { EntityLine, LineOptions } from "./entity-line.class";
import { EntityPointOfLabel } from "./entity-point-of-label.class";
import { EntityPoint } from "./entity-point.class";

export class EntityAxis<GeomType extends Geometry = Geometry>  extends EntityComplex{
    // Entities components
    private backbone:EntityBackBone;
    private rightLine:EntityLine;
    private leftLine:EntityLine;
    private tipLine: EntityLine;
    private pointOfLabel: EntityPoint;
    private controlWidthPoint: EntityPoint;

    public WIDTH = 2000;
    DIVISOR: number = 4;


    constructor(coordinates: Coordinate[]){
        super(coordinates);
        this.entityType = entityType.axis

        // Create backbone
        this.backbone = new EntityBackBone([this.rightLine,this.leftLine],{
            geometry: new LineString(coordinates)
        })

        this.location = coordinates;
        
        this.backbone.lineColor = [255,0,0,0];
        this.backbone.lineWidth = 20;
        this.backbone.name = "";
        this.backbone.textAlign = "end";
        this.backbone.textBaseline = "middle";
        this.backbone.activateStyle();

        // mapComponent.dragFeatures.push(this.backbone);
        // mapComponent.shapes.addFeature(this.backbone);

        const lineOption:LineOptions = new LineOptions();

        // Create both lateral lines
        this.rightLine = new EntityLine(lineOption,{
            geometry: new LineString(getParallelLineWithEndOffset(coordinates,this.WIDTH/2,RIGHT,this.WIDTH))
        })

        this.rightLine.setStyle(this.rightLine.getStyle());
        // mapComponent.shapes.addFeature(this.rightLine);

        this.leftLine = new EntityLine(lineOption,{
            geometry: new LineString(getParallelLineWithEndOffset(coordinates,this.WIDTH/2,LEFT,this.WIDTH))
        })

        this.leftLine.setStyle(this.leftLine.getStyle());
        // mapComponent.shapes.addFeature(this.leftLine);

        this.tipLine = new EntityLine(lineOption,{
            geometry: new LineString(this.getTipLine())
        })

        this.tipLine.activateStyle();
        // mapComponent.shapes.addFeature(this.tipLine);

        // create point of label

        this.pointOfLabel = new EntityPointOfLabel({
            geometry: new Point(this.location[0])
        })

        this.pointOfLabel.name = "Eje";
        this.pointOfLabel.activateStyle();
        // mapComponent.shapes.addFeature(this.pointOfLabel);
        
        // create point of Lateral Control

        // this.controlWidthPoint = new EntityControlPoint({
        //     geometry: new Point(this.tipLine.getCoordinate(1))
        // })
        
        // mapComponent.moveFeatures.push(this.controlWidthPoint);

        // this.pointOfLabel.activateStyle();
        Globals.SHAPES_VECTOR_LAYER.addFeature(this.controlWidthPoint);
        Globals.SHAPES_VECTOR_LAYER.addFeature(this.leftLine);
        Globals.SHAPES_VECTOR_LAYER.addFeature(this.rightLine);
        Globals.SHAPES_VECTOR_LAYER.addFeature(this.backbone);

        
        var self = this;
        this.backbone.on("change",
        function(){
            var newCoordinates:Coordinate[] = self.getCoordinates();
            self.updateShape(newCoordinates);
        })

        // this.olMap.move.on("translating",(evt) => this.onDrag(evt));


        // this.controlWidthPoint.on("change",
        // function (ev) {
        //     var angleOfAxis = getOrientation(self.backbone.getPenultimate(),self.backbone.getEnd()) + Math.PI/2;
        //     var initMovePoint = self.tipLine.getPenultimate();
        //     var newPosition = (<Point>this.getGeometry()).getCoordinates();
        //     var angleOfPoint = getOrientation(initMovePoint,newPosition) - angleOfAxis;
        //     var newWidth = Math.cos(angleOfPoint) * distance(initMovePoint,newPosition);
        //     var finalPosition = getPointToVector(initMovePoint,angleOfAxis,newWidth);

        //     (<Point>self.controlWidthPoint.getGeometry()).setCoordinates(finalPosition);

        //     self.WIDTH = newWidth * 4 / 3;

        //     console.log(angleOfAxis + " " + initMovePoint + " " + newPosition);
            
        //     // self.WIDTH =10000;
        //     // self.updateShape();
        // })
    } // constructor


    private updateShape(newCoordinates:Coordinate[] = this.getCoordinates()):void{
        this.rightLine.setCoordinates(getParallelLineWithEndOffset(newCoordinates,this.WIDTH/2,RIGHT,this.WIDTH));
        this.leftLine.setCoordinates(getParallelLineWithEndOffset(newCoordinates,this.WIDTH/2,LEFT,this.WIDTH));
        this.tipLine.setCoordinates(this.getTipLine());
        this.pointOfLabel.setCoordinates(newCoordinates[0]);
        this.controlWidthPoint.setCoordinates(this.tipLine.getCoordinate(1));
    }

    getEntityGeometry() {
        return this.backbone.getGeometry();
    }

    getCoordinates(): Coordinate[]{
        if (this.backbone)
            return this.backbone.getCoordinates();
        return null
    }

    private getTipLine(): Coordinate[] {
        var tip:Coordinate[] = [];
        tip.push(this.rightLine.getLastCoordinate());
        var angle = getOrientation(this.rightLine.getPenultimate(),this.rightLine.getLastCoordinate());
        tip.push(getPointToVector(this.rightLine.getLastCoordinate(),angle + Math.PI/2,this.WIDTH/this.DIVISOR));
        tip.push(this.backbone.getLastCoordinate());
        tip.push(getPointToVector(this.leftLine.getLastCoordinate(),angle - Math.PI/2,this.WIDTH/this.DIVISOR));
        tip.push(this.leftLine.getLastCoordinate());

        return tip;
    }

    public onDrag(evt:TranslateEvent){
        var centreOfAxis = middlePoint(this.tipLine.getStart(),this.tipLine.getLastCoordinate());
        var angleOfAxis = getOrientation(this.backbone.getPenultimate(),this.backbone.getLastCoordinate()) + Math.PI/2;
        var newPosition = evt.coordinate;
        var angleOfPoint = getOrientation(centreOfAxis,newPosition) - angleOfAxis;
        var newDistanceToCentre = distance(centreOfAxis,newPosition);
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


