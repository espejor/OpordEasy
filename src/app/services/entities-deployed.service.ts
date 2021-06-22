import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import { OlMapComponent } from '../components/nav/ol-map/ol-map.component';
import { EntityUnit } from '../entities/entity-unit';
import { Entity } from '../entities/entity.class';
import { EntityLocated } from '../models/operation';

@Injectable({
  providedIn: 'root'
})
export class EntitiesDeployedService {
  readonly URL_API = 'http://localhost:3000/api/entities';
  olMapComponent:OlMapComponent;
  entities: EntityLocated[] = []

  constructor(private http:HttpClient) { }

  setMapComponent(olMapComponent: OlMapComponent) {
    this.olMapComponent = olMapComponent;
  }
  getMapComponent(): OlMapComponent {
    return this.olMapComponent;
  }

  addNewEntity(entityLocated: EntityLocated, coordinates?:Coordinate[] | Coordinate) {
    if (coordinates)
      entityLocated.location = coordinates;

    entityLocated.entity.setFlatCoordinatesfromLocation(coordinates);
    this.olMapComponent.shapesFeatures.push(entityLocated.entity);
    this.olMapComponent.dragFeatures.push(entityLocated.entity);
  }

  resetEntitiesDeployed() {
    this.olMapComponent.shapesFeatures.clear();
    this.olMapComponent.dragFeatures.clear();
  }  

  updateMap(){
  }


  saveEntity(entity: Entity){
    // -------- provisional
    // operation.user = "Pepe"
    return this.http.post(this.URL_API,entity);
  }

}
