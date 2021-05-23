import { Coordinate, distance} from "ol/coordinate";


export const LEFT = 1;
export const RIGHT = 0;

export function getPerpendicularPoint(origin:Coordinate,angle:number,distance:number): Coordinate{
    return getPointToVector(origin,angle + Math.PI/2,distance);
}

export function getParallelLineWithEndOffset(coordinates: Coordinate[],distance:number,side:number,offset:number): Coordinate[] {
    var parallCoord = getParallelLine(coordinates,distance,side);
    var lastLegAngle = getOrientation(parallCoord[parallCoord.length - 1],parallCoord[parallCoord.length - 2]);
    var newLastPoint = getPointToVector(parallCoord[parallCoord.length - 1],lastLegAngle,offset);

    parallCoord[parallCoord.length - 1] = newLastPoint;
    return parallCoord;
}

export function getParallelLine(coordinates: Coordinate[],distance:number,side:number): Coordinate[] {
    var angle: number;
    var parallCoord: Array<Coordinate> = [];
    
    for(var i = 0;i < coordinates.length; i++){
        var newPoint = [0,0];
        if(coordinates.length > 2 && i != 0 && i != coordinates.length - 1){
            var alfa1 = getOrientation(coordinates[i - 1],coordinates[i]);
            var alfa2 = getOrientation(coordinates[i],coordinates[i + 1]);
            var point1 = getPerpendicularPoint(coordinates[i], side == LEFT ? alfa1 += Math.PI: alfa1,distance);
            var point2 = getPerpendicularPoint(coordinates[i], side == LEFT ? alfa2 += Math.PI: alfa2,distance);
            newPoint = middlePoint(point1,point2);

        }else{
            if(i < coordinates.length - 1){
                angle = getOrientation(coordinates[i],coordinates[i + 1]);
            }else{
                angle = getOrientation(coordinates[i - 1],coordinates[i]);
            }
    
            if (side == LEFT) 
                angle += Math.PI;
            newPoint = getPerpendicularPoint(coordinates[i], angle,distance);
        }

        parallCoord[i] = newPoint;
    }
    
    return parallCoord;
}

export function getOrientation(pointStar: Coordinate, pointEnd: Coordinate): number {
    var deltaY = pointEnd[1] - pointStar[1];
    var deltaX = pointEnd[0] - pointStar[0];
    var atan = Math.atan(deltaY / deltaX);
    if (deltaX < 0){    // 2º y 3er cuadrante
        // if(atan >= 0)   // ATAN positivo
            atan += Math.PI;
        // else            // ATAN negativo
        //     atan += (Math.PI * 2);
    }
    // if (atan < 0)
    //     atan += (Math.PI * 2);

    return atan;
}

export function middlePoint(p1:Coordinate,p2:Coordinate):Coordinate{
    var newPoint : Coordinate = [0,0];
    newPoint[0] = (p1[0] + p2[0]) / 2;
    newPoint[1] = (p1[1] + p2[1]) / 2;
    return newPoint;
}

export function getPointToVector(origin:Coordinate,angle:number,distance:number): Coordinate{
    var newPoint : Coordinate = [0,0];
    newPoint[0] = origin[0] + distance * Math.cos(angle);
    newPoint[1] = origin[1] + distance * Math.sin(angle);
    return newPoint;
}

