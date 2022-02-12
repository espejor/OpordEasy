import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import { entityType } from 'src/app/entities/entitiesType';
import { EntityUnit, UnitOptions } from 'src/app/entities/entity-unit';
import { Entity } from 'src/app/entities/entity.class';
import { EntitySelector } from 'src/app/entities/factory-entity-selector';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { HTTPEntitiesService } from 'src/app/services/entities.service';
import { OperationsService } from 'src/app/services/operations.service';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';
import { EntitySelectorService } from 'src/app/services/entity-selector.service';
import { Geometry } from 'ol/geom';
import { EntityFactory } from 'src/app/entities/factory-entity';

@Component({
  selector: 'app-favorite-selector',
  templateUrl: './favorite-selector.component.html',
  styleUrls: ['./favorite-selector.component.css']
})
export class FavoriteSelectorComponent implements OnInit {
  // @ViewChild ("oneFavorite") oneFavorite:ElementRef;
  listOfEntities: Entity[];
  @Input() createSVG: Function;
  @Input() type: string;
  entitySelected: Entity;

  constructor(
    private httpEntitiesService:HTTPEntitiesService,
    private svgService: SVGUnitsIconsListService,
    private mapService:EntitiesDeployedService,
    private entitySelectorService:EntitySelectorService) { }

  ngOnInit(): void {
    var listSliced = [];
    if (this.type == "fav"){
      this.httpEntitiesService.getEntities().subscribe(res => {
          console.log(res);
        listSliced = <Entity[]>res;
        listSliced = listSliced.filter(entity => entity.favorite == true && entity.entityType == entityType.unit);
        this.listOfEntities = this.convertToEntities(listSliced)
      });
    }else{    
      this.httpEntitiesService.getEntities().subscribe(res => {
        console.log(res);
        const list:Entity[] = <Entity[]>res;
        listSliced = list
          .filter(entity => entity.entityType == entityType.unit)
          .sort((a,b) => {
            if (a.dateCreation > b.dateCreation) return -1;
            else if (a.dateCreation < b.dateCreation) return 1
            else return 0
          })
          .slice(0,5);
        this.listOfEntities = this.convertToEntities(listSliced)
      });
    }
  }

  convertToEntities(listSliced: any[]): Entity<Geometry>[] {
    const entities:Entity[] = []
    listSliced.forEach(element => {
      entities.push(EntitySelector.getFactory(element.entityType).createEntity(element.entityOptions,element.location,element._id))
    })

    return entities
  }

  updateModel(unit:Entity){
    // const mapComponent = this.mapService.getMapComponent();
    // // const coordinates:Coordinate[] = []; 
    // const coordinates = mapComponent.map.getView().getCenter();
    // const entity = EntitySelector.getFactory(unit.entityType).createEntity(<UnitOptions>unit.entityOptions,coordinates);
    // entity._id = unit._id;
    this.entitySelectorService.entitySelected = unit;
    this.createSVG(unit);
    // this.operationsService.loadEntity(unit);
  }


}
