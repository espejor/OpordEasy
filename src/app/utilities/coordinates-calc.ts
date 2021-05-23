import { Coordinate } from "ol/coordinate";

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
