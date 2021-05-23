import { Injectable } from '@angular/core';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import { OlMapComponent } from '../components/nav/ol-map/ol-map.component';
import { EntityUnit } from '../entities/entity-unit';
import { Entity } from '../entities/entity.class';

@Injectable({
  providedIn: 'root'
})
export class EntitiesDeployedService {  olMapComponent:OlMapComponent;

  entities: Entity[] = []

  constructor() { }

  setMapComponent(olMapComponent: OlMapComponent) {
    this.olMapComponent = olMapComponent;
  }
  getMapComponent(): OlMapComponent {
    return this.olMapComponent;
  }

  addNewEntity(entity: Entity<Geometry>) {
    
        this.olMapComponent.shapesFeatures.push(entity);
        this.olMapComponent.dragFeatures.push(entity);

          entity.setStyle(entity.getCustomStyle());
    // (<Point>entity.getGeometry()).setCoordinates(this.olMapComponent.getCentre())
    // this. entities.push(entity);
    // this.olMapComponent.shapesFeatures.push(entity);
    // entity.setStyle(entity.getStyle());
    // entity.activateStyle();
    // this.updateMap();
  }

  updateMap(){
  }


}
