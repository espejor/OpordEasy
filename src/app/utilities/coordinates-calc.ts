import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import { Pixel } from "ol/pixel";
// import { AppInjector } from "../app.module";
// import { EntitiesDeployedService } from "../services/entities-deployed.service";
// import { Globals } from "./globals";
import { distanceBetweenPixels } from "./pixels-geometry";

export function fromFlatToArray(coordinatesList:number[]):Coordinate[]{
    var coordinatesArray:Coordinate[] = new Array(coordinatesList.length / 2);
    if(coordinatesList.length % 2 == 0){
        for(var i = 0;i < coordinatesArray.length;i++){
            var coordinate:Coordinate = [0,0];
            coordinate[0] = coordinatesList[2 * i];
            coordinate[1] = coordinatesList[(2 * i) + 1];
            coordinatesArray[i] = coordinate;
        }
    }else{
        showError();
    }
    return coordinatesArray;
}

function showError() {
    throw new Error("Lista de Coordenadas con datos impares");
}

export function distanceInPixelBetweenCoordinates(map:Map,c1:Coordinate,c2:Coordinate):number{
    // const map = Globals.MAP
    const p1:Pixel = map.getPixelFromCoordinate(c1) 
    const p2:Pixel = map.getPixelFromCoordinate(c2)
    return distanceBetweenPixels(p1,p2); 
}

export function equals(c1:Coordinate,c2:Coordinate):boolean{
    if(c1[0] != c2[0])
        return false
    if(c1[1] != c2[1])
        return false
    return true
}

