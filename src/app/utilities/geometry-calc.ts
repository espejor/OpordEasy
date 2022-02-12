import { Coordinate, distance} from "ol/coordinate";


export const LEFT = 1;
export const RIGHT = 0;

export function getPerpendicularPoint(origin:Coordinate,rotation:number,distance:number): Coordinate{
    return getPointToVector(origin,rotation + Math.PI/2,distance);
}

export function distanceFromPointToLine(point:Coordinate,p1:Coordinate,p2:Coordinate):number{
    const x0 = point[0]
    const y0 = point[1]
    const x1 = p1[0]
    const y1 = p1[1]
    const x2 = p2[0]
    const y2 = p2[1]
    return (Math.abs(((x2-x1)*(y1-y0)) - ((x1-x0)*(y2-y1))))/distance(p1,p2)
}

export function getParallelLineWithEndOffset(coordinates: Coordinate[],distance:number,side:number,offset:number): Coordinate[] {
    var parallCoord = getParallelLine(coordinates,distance,side);
    var lastLegAngle = getOrientation(parallCoord[parallCoord.length - 1],parallCoord[parallCoord.length - 2]);
    var newLastPoint = getPointToVector(parallCoord[parallCoord.length - 1],lastLegAngle,offset);

    parallCoord[parallCoord.length - 1] = newLastPoint;
    return parallCoord;
}

export function getParallelLine(coordinates: Coordinate[],distance:number,side:number): Coordinate[]{
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

export function isRight(linePointA:Coordinate,linePointB:Coordinate, pointToCheck:Coordinate):boolean{
  return ((linePointB[0] - linePointA[0])*(pointToCheck[1] - linePointA[1]) - (linePointB[1] - linePointA[1])*(pointToCheck[0] - linePointA[0])) > 0;
}


export function getOrientation(pointStart: Coordinate, pointEnd: Coordinate): number {
    var deltaY = pointEnd[1] - pointStart[1];
    var deltaX = pointEnd[0] - pointStart[0];
    var atan = Math.atan(deltaY / deltaX);
    if (deltaX < 0){    // 2º y 3er cuadrante
        // if(atan >= 0)   // ATAN positivo 3º Cuadrante
            atan += Math.PI;
        // else            // ATAN negativo 2º Cuadrante
        //     atan = -atan + (Math.PI/2);
    }
    if (atan < 0)
        atan += (Math.PI * 2);

    return atan;
}

export function getAngle(startPoint:Coordinate,middlePoint:Coordinate,endPoint:Coordinate):number{
    const directionToStart = getOrientation(middlePoint,startPoint)
    const directionToEnd = getOrientation(middlePoint,endPoint)
    return Math.abs(directionToStart - directionToEnd)
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

export function getCoordsForArc(center:Coordinate,radius:number,angle:number = 2 * Math.PI,rotation:number = 0,segments:number = 10):Coordinate[]{
    const coordinates:Coordinate [] = []
    for (let i = 0; i <= segments; i++) {
        var x = center[0] + (radius * Math.cos(i* (angle/segments) + rotation))
        var y = center[1] + (radius * Math.sin(i* (angle/segments) + rotation))
        coordinates.push([x,y])
    }
    return coordinates        
}

export function getCoordsForArcFrom2Points(p1:Coordinate,p2:Coordinate,alfa:number = 0.5 * Math.PI,segments:number = 10):Coordinate[]{
    const beta = (0.5 * Math.PI) - (alfa/2) // ángulo entre p1, p2 y r
    const d = distance(p1,p2);  // distancia entre los dos puntos
    const r = (d/2) / Math.sin(alfa/2)  // radio
    const gamma = getOrientation(p1,p2) // orientación entre los 2 puntos
    const rotation = gamma + beta - Math.PI // rotación del arco
    const c = getPointToVector(p1,gamma + beta,r)   // centro de la circunferencia
    return getCoordsForArc(c,r,alfa,rotation,segments);
}

