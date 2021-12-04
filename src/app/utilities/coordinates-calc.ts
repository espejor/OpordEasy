import { Coordinate } from "ol/coordinate";
import { Pixel } from "ol/pixel";
import { AppInjector } from "../app.module";
import { EntitiesDeployedService } from "../services/entities-deployed.service";
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

export function distanceInPixelBetweenCoordinates(c1:Coordinate,c2:Coordinate):number{
    const map = AppInjector.get(EntitiesDeployedService).getMapComponent().map
    const p1:Pixel = map.getPixelFromCoordinate(c1) 
    const p2:Pixel = map.getPixelFromCoordinate(c2)
    return distanceBetweenPixels(p1,p2); 
}

