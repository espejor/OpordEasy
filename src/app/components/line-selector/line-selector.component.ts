import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Geometry from 'ol/geom/Geometry';
import { Pixel } from 'ol/pixel';
import { Observable } from 'rxjs';
import { entityType } from 'src/app/entities/entitiesType';
import { Entity, EntityOptions } from 'src/app/entities/entity.class';
import { EntitySelector } from 'src/app/entities/factory-entity-selector';
import { FeatureForSelector } from 'src/app/models/feature-for-selector';
import { EntityLocated } from 'src/app/models/operation';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { HTTPEntitiesService } from 'src/app/services/entities.service';
import { EntitySelectorService } from 'src/app/services/entity-selector.service';
import { OperationsService } from 'src/app/services/operations.service';
import { SvgGeneralIconsListService } from 'src/app/services/svg-general-icons-list.service';
import { Selector } from '../selector-base';

@Component({
  selector: 'app-line-selector',
  templateUrl: './line-selector.component.html',
  styleUrls: ['./line-selector.component.css']
})
export class LineSelectorComponent extends Selector implements OnInit {
  
  public setFeaturesToSelect ;
  public listOfOptions = [];

  constructor(public svgListOfIcons: SvgGeneralIconsListService, 
    private  entitiesDeployed:EntitiesDeployedService,
    private entitySelectorService:EntitySelectorService,
    private operationsService:OperationsService,
    private _snackBar: MatSnackBar,
    private httpEntitiesService:HTTPEntitiesService) {
      super();
   }

  ngOnInit(): void {
    this.listOfOptions = this.fillArrayOfOptions();
    this.setFeaturesToSelect = Object.keys(this.listOfOptions)[0];
  }

  fillArrayOfOptions(): any[] {
    const options:any[] = []
    for(const property in this.svgListOfIcons.features.lines) {
      options[property] = this.svgListOfIcons.features.lines[property].text;
    };
    return options;
  }


  loadExtraData(feature:KeyValue<string,FeatureForSelector>){
    const mapComponent = this.entitiesDeployed.getMapComponent();
    // const coordinates:Coordinate = []; 
    const coordinates = mapComponent.map.getView().getCenter();
    feature.value.classCSS = feature.value.classCSS == "selectorSelected"? "unSelected" : "selectorSelected";
    // this.lineOptions = feature.value
    const line = EntitySelector.getFactory(entityType.line).createEntity(feature.value,coordinates);
    
    this.entitySelectorService.entitySelected = line

  }
  
  saveLine(line:Entity<Geometry>):Observable<Object>{    // line.favorite = this.favorite;
    // La guardamos en la BD
    return this.httpEntitiesService.addEntity(line);
  }

  
    
  insertLine(event) {
    // this.entitiesDeployed.saveEntity(entityType.line);
    // ---todo Intentar referenciar con viewChild o Output/Input 
    
    const mapComponent = this.entitiesDeployed.getMapComponent();
    // // const coordinates:Coordinate = []; 
    const pixel:Pixel = [event.x,event.y];
    const coordinates = mapComponent.map.getCoordinateFromPixel(pixel);
    // this.listOfUnitsCreated.push(this.lineOptions);
    const line = EntitySelector.getFactory(entityType.line).createEntity(this.entitySelectorService.entitySelected.entityOptions,coordinates);

    this.saveLine(line).subscribe(
      data => {
      this._snackBar.open(
        "Se ha guardado la Línea en la Base de datos",
        "Cerrar",
        {duration : 3000}
      )
      line._id = (<Entity>data)._id;
      this.entitySelectorService.entitySelected = line;
    // if (!coordinates)
    // if(this.entitySelectorService.entitySelected == undefined){ // Si no se ha grabado
    // }else 
      if(this.operationsService.loadEntity(this.entitySelectorService.entitySelected,coordinates)){
        const entityLocated:EntityLocated = new EntityLocated(this.entitySelectorService.entitySelected,this.entitySelectorService.entitySelected.getCoordinates())
        // entityLocated.entity = this.entitySelectorService.entitySelected
        // entityLocated.location = this.entitySelectorService.entitySelected.getCoordinates();
        this.entitiesDeployed.addNewEntity(entityLocated);
        this.entitySelectorService.entitySelected = undefined;
      }
    });
  }
// }
}


export class LineOptions extends EntityOptions{
  icon:FeatureForSelector;
  name:string

  constructor(){
    super();
    this.icon = null;

  }
}
