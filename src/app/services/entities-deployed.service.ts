import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { environment } from '../../environments/environment';
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
  olMapComponent:OlMapComponent;
  entities: EntityLocated[] = []
  URL_API: string;

  constructor(private http:HttpClient) {
    const URL_BASE = environment.baseUrl;
    this.URL_API = URL_BASE + '/api/operations'; 
  }

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
