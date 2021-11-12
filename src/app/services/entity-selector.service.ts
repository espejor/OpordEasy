import { Injectable } from '@angular/core';
import { Entity } from '../entities/entity.class';

@Injectable({
  providedIn: 'root'
})
export class EntitySelectorService {
  entitySelected: Entity;

  constructor() { }
}
