import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Entity } from '../entities/entity.class';
import { environment } from '../../environments/environment';
import { Globals } from '../utilities/globals';
// import Geometry from 'ol/geom/Geometry';
// import { Entity } from '../entities/entity.class';

@Injectable({
  providedIn: 'root'
})
export class HTTPEntitiesService {
  // entities: Entity[];
  URL_API: string;


  constructor(public http:HttpClient) {
    const URL_BASE = environment.baseUrl;
    this.URL_API = URL_BASE + 'api/entities'; 
  }

  getEntities(){
    return this.http.get(this.URL_API);
  }

  getAllFavorites() {
    return this.http.get(this.URL_API);
  }

  addEntity(entity: Entity){
    // -------- provisional
    // entity.user = "Pepe"
    return this.http.post(this.URL_API,entity);
  }

  updateEntity(entity: Entity){
    return this.http.put(this.URL_API + `/${entity._id}`,entity);
  }

  updateCoordinates(entity: Entity) {
    entity.setCoordinatesOfLocation();
    return this.updateEntity(entity);
  }


  deleteEntity(_id: string){
    return this.http.delete(this.URL_API + `/${_id}`);
  }

  getEntity(_id: string){
    return this.http.get(this.URL_API + `/${_id}`);
  }


}

