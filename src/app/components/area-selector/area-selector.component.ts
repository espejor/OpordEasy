import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
import { Pixel } from 'ol/pixel';
import { Observable } from 'rxjs';
import { entityType } from 'src/app/entities/entitiesType';
import { Entity } from 'src/app/entities/entity.class';
import { EntitySelector } from 'src/app/entities/factory-entity-selector';
import { EntityLocated } from 'src/app/models/operation';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { HTTPEntitiesService } from 'src/app/services/entities.service';
import { EntitySelectorService } from 'src/app/services/entity-selector.service';
import { OperationsService } from 'src/app/services/operations.service';
import { SvgGeneralIconsListService } from 'src/app/services/svg-general-icons-list.service';
import { Selector } from '../selector-base';

@Component({
  selector: 'app-area-selector',
  templateUrl: './area-selector.component.html',
  styleUrls: ['./area-selector.component.css']
})
export class AreaSelectorComponent extends Selector implements OnInit,AfterViewInit {
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

  
  ngAfterViewInit(){
    this.resetAspectSelectors();
  }

  resetAspectSelectors() {
    for (let featuresLabel in this.svgListOfIcons.features){
      for (let feature in this.svgListOfIcons.features[featuresLabel]){
        for(let featureForDeploing in this.svgListOfIcons.features[featuresLabel][feature].selector){
          this.svgListOfIcons.features[featuresLabel][feature].selector[featureForDeploing].classCSS = "unSelected"
        }
      }
    }
  }

  fillArrayOfOptions(): any[] {
    const options:any[] = []
    for(const property in this.svgListOfIcons.features.areas) {
      options[property] = this.svgListOfIcons.features.areas[property].text;
    };
    return options;
  }


  loadExtraData(feature:KeyValue<string,any>){
    this.resetAspectSelectors();
    const mapComponent = this.entitiesDeployed.getMapComponent();
    // const coordinates:Coordinate = []; 
    const center = mapComponent.map.getView().getCenter();
    const coordinates:Coordinate[] = [];
    coordinates.push([center[0] - 500,center[1]]);
    coordinates.push([center[0] + 500,center[1]]);
    feature.value.classCSS = feature.value.classCSS == "selectorSelected"? "unSelected" : "selectorSelected";
    // this.areaOptions = feature.value
    const area = EntitySelector.getFactory(entityType.area).createEntity(feature.value.codeForDeploing,coordinates);
    
    this.entitySelectorService.entitySelected = area
  }
  
  saveArea(area:Entity<Geometry>):Observable<Object>{    // area.favorite = this.favorite;
    // La guardamos en la BD
    return this.httpEntitiesService.addEntity(area);
  }

  
    
  insertArea(event) {
    // this.entitiesDeployed.saveEntity(entityType.area);
    // ---todo Intentar referenciar con viewChild o Output/Input 
    
    const mapComponent = this.entitiesDeployed.getMapComponent();
    // // const coordinates:Coordinate = []; 
    const pixel:Pixel = [event.x,event.y];
    var areaStart:Coordinate = mapComponent.map.getCoordinateFromPixel(pixel);
    areaStart = [areaStart[0] - 5000,areaStart[1]];
    const areaEnd:Coordinate = [areaStart[0] + 10000,areaStart[1]];
    const coordinates: Coordinate[] = [];
    coordinates.push(areaEnd,areaStart);
    // this.listOfUnitsCreated.push(this.areaOptions);
    // (<AreaOptions>(this.entitySelectorService.entitySelected.entityOptions)).name = "NAME";
    // (<AreaOptions>(this.entitySelectorService.entitySelected.entityOptions)).typeArea = "TYPE";
    const area = EntitySelector.getFactory(entityType.area).
                createEntity(this.entitySelectorService.entitySelected.entityOptions,coordinates);

    this.saveArea(area).subscribe(
      data => {
      this._snackBar.open(
        "Se ha guardado la Línea en la Base de datos",
        "Cerrar",
        {duration : 3000}
      )
      area._id = (<Entity>data)._id;
      this.entitySelectorService.entitySelected = area;
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
