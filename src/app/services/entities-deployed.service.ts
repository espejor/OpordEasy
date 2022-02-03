import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { Geometry } from 'ol/geom';
import { environment } from '../../environments/environment';
import { OlMapComponent } from '../components/nav/ol-map/ol-map.component';
import { Entity } from '../entities/entity.class';
import { EntityLocated } from '../models/operation';
import { collectionToArray, findElement } from '../utilities/miscelanea';
import { SvgIconsListService } from './svg-icons-list.service';

@Injectable({
  providedIn: 'root'
})
export class EntitiesDeployedService {
  olMapComponent:OlMapComponent;
  entities: EntityLocated[] = []
  URL_API: string;

  constructor(private http:HttpClient,
    public svgListOfIconsService:SvgIconsListService) {
    const URL_BASE = environment.baseUrl;
    this.URL_API = URL_BASE + 'api/entities'; 
  }

  updateEntity(entity: Entity<Geometry>):number {
    const indexElement = findElement(this.olMapComponent.shapesFeatures,entity,{key:"_id",value:entity._id})
    if (indexElement != -1){
      this.olMapComponent.shapesFeatures.setAt(indexElement,entity)
    }
    return indexElement
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

    entityLocated.entity.setFlatCoordinatesfromLocation(entityLocated.location );
    this.olMapComponent.shapesFeatures.push(entityLocated.entity);
  }

  removeEntity(entityLocated: EntityLocated){
    this.olMapComponent.shapesFeatures.remove(entityLocated.entity)
  }

  resetEntitiesDeployed() {
    this.olMapComponent.shapesFeatures.clear();
    this.olMapComponent.dragFeatures.clear();
    // this.olMapComponent.snap.clearFeatures()
  }  

  updateMap(){
  }


  // saveEntity(entityType:entityType){
  //   // -------- provisional
  //   // operation.user = "Pepe"
        
  //   const mapComponent = this.getMapComponent();
  //   // // const coordinates:Coordinate = []; 
  //   const coordinates = mapComponent.map.getView().getCenter();
  //   // this.listOfUnitsCreated.push(this.unitOptions);
  //   const unit = EntitySelector.getFactory(entityType).createEntity(this.svgListOfIconsService, this.unitOptions,coordinates);
  //   unit.favorite = this.favorite;
  //   // La guardamos en la BD
  //   this.httpEntitiesService.addEntity(unit).subscribe(
  //     data => {
  //     this._snackBar.open(
  //       "Se ha guardado la nueva Unidad en la Base de datos",
  //       "Cerrar",
  //       {duration : 3000}
  //     )
  //     unit._id = (<Entity>data)._id;
  //     this.entitySelectorService.entitySelected = unit;
  //     if (andInsert)
  //       this.insertUnit(event);
  //   });
  // }

}
