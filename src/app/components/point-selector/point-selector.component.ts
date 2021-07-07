import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import { Pixel } from 'ol/pixel';
import { entityType } from 'src/app/entities/entitiesType';
import { EntityPoint } from 'src/app/entities/entity-point.class';
import { EntityOptions } from 'src/app/entities/entity.class';
import { EntitySelector } from 'src/app/entities/factory-entity-selector';
import { FeatureForSelector } from 'src/app/models/feature-for-selector';
import { EntityLocated } from 'src/app/models/operation';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { EntitySelectorService } from 'src/app/services/entity-selector.service';
import { OperationsService } from 'src/app/services/operations.service';
import { SvgGeneralIconsListService } from 'src/app/services/svg-general-icons-list.service';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';
import { Selector } from '../selector-base';

@Component({
  selector: 'app-point-selector',
  templateUrl: './point-selector.component.html',
  styleUrls: ['./point-selector.component.css']
})
export class PointSelectorComponent extends Selector implements OnInit {
  public setFeaturesToSelect ;
  public listOfOptions = [];
  // public listOfOptions = {command:"Mando",obs:"Observatorios",logistic:"Logística", fires:"Fuegos"};

  private pointOptions: PointOptions = new PointOptions();

  constructor(public svgListOfIcons: SvgGeneralIconsListService, 
    private  entitiesDeployed:EntitiesDeployedService,
    private entitySelectorService:EntitySelectorService,
    private operationsService:OperationsService) {
      super();
   }

  ngOnInit(): void {
    this.listOfOptions = this.fillArrayOfOptions();
    this.setFeaturesToSelect = Object.keys(this.listOfOptions)[0];
  }

  fillArrayOfOptions(): any[] {
    const options:any[] = []
    for(const property in this.svgListOfIcons.features.points) {
      options[property] = this.svgListOfIcons.features.points[property].text;
    };
    return options;
  }

  unsorted():number{
    return 0;
  }

  loadExtraData(feature:KeyValue<string,FeatureForSelector>){
    const mapComponent = this.entitiesDeployed.getMapComponent();
    // const coordinates:Coordinate = []; 
    const coordinates = mapComponent.map.getView().getCenter();
    feature.value.classCSS = feature.value.classCSS == "selectorSelected"? "unSelected" : "selectorSelected";
    const point = EntitySelector.getFactory(entityType.point).createEntity(this.svgListOfIcons, feature.value,coordinates);
    
    this.entitySelectorService.entitySelected = point

  }
  
  insertPoint() {
    throw new Error('Method not implemented.');
  }

  
  savePoint(event){
    
    const mapComponent = this.entitiesDeployed.getMapComponent();
    const pixel:Pixel = [event.x,event.y];
    const coordinates:Coordinate = mapComponent.map.getCoordinateFromPixel(pixel);

    if(this.operationsService.loadUnit(this.entitySelectorService.entitySelected,coordinates)){
      const entityLocated:EntityLocated = new EntityLocated()
      entityLocated.entity = this.entitySelectorService.entitySelected
      entityLocated.location = this.entitySelectorService.entitySelected.getCoordinates();
      this.entitiesDeployed.addNewEntity(entityLocated);
      this.entitySelectorService.entitySelected = undefined;
    // }    // const point = new EntityPoint(null, this.pointOptions,{geometry: new Point(coordinates[0])});
    // this.entitiesDeployed.addNewEntity(new EntityLocated(this.entitySelectorService.entitySelected),coordinates);
  }
}
}


export class PointOptions extends EntityOptions{
  icon:FeatureForSelector;
  name:string

  constructor(){
    super();
    this.icon = null;

  }
}