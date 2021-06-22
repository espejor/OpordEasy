import { Injectable } from '@angular/core';
import { Entity } from '../entities/entity.class';

@Injectable({
  providedIn: 'root'
})
export class UnitSelectorService {
  entitySelected: Entity;

  constructor() { }
}
