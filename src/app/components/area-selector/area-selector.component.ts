import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coordinate } from 'ol/coordinate';
import { Polygon } from 'ol/geom';
import Geometry from 'ol/geom/Geometry';
import GeometryType from 'ol/geom/GeometryType';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import { Pixel } from 'ol/pixel';
import { Observable } from 'rxjs';
import { entityType } from 'src/app/entities/entitiesType';
import { AreaOptions } from 'src/app/entities/entity-area.class';
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
  fieldsToShow: AreaOptions["extraData"]["textFields"];
  listsToShow: AreaOptions["extraData"]["lists"];
  // numsToShow: AreaOptions["extraData"]["numbers"];

  constructor(public svgListOfIcons: SvgGeneralIconsListService, 
    private  entitiesDeployedService:EntitiesDeployedService,
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
    for(const property in this.svgListOfIcons.features['areas']) {
      options[property] = this.svgListOfIcons.features['areas'][property].text;
    };
    return options;
  }


  updateFeatureWithTextField(event,option){
    (<AreaOptions>this.entitySelectorService.entitySelected.entityOptions).extraData.textFields[option.key].value = event.target.value
  }

  updateFeatureWithList(event,option){
    (<AreaOptions>this.entitySelectorService.entitySelected.entityOptions).extraData.lists[option.key].value = event.value    
  }

  // updateFeatureWithTextNumber(event,option){
  //   (<AreaOptions>this.entitySelectorService.entitySelected.entityOptions).extraData.numbers[option.key].value = event.target.value
  // }
  
  resetExtraData(){
    this.fieldsToShow = undefined
    this.listsToShow = undefined
  }

  loadExtraData(feature:KeyValue<string,any>){
    if(feature.value.codeForDeploing.extraData){
      this.fieldsToShow = feature.value.codeForDeploing.extraData.textFields
      this.listsToShow = feature.value.codeForDeploing.extraData.lists
      // this.numsToShow = feature.value.codeForDeploing.extraData.numbers
    }else{
      this.resetExtraData()
      // this.fieldsToShow = undefined
      // this.listsToShow = undefined
      // this.numsToShow = undefined
    }

    this.resetAspectSelectors();
    const mapComponent = this.entitiesDeployedService.getMapComponent();
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
    // ---todo Intentar referenciar con viewChild o Output/Input 
    
    const mapComponent = this.entitiesDeployedService.getMapComponent();
    const draw:Draw = new Draw({
      source:mapComponent.shapesVectorLayer,
      type: GeometryType.POLYGON
    })
    
    mapComponent.map.addInteraction(draw);

    var coordinates: Coordinate[] = [];
    draw.on("drawend", (evt:DrawEvent) => {
      mapComponent.map.removeInteraction(draw);

      coordinates = (<Polygon>evt.feature.getGeometry()).getCoordinates()[0]

      const area = EntitySelector.getFactory(entityType.area).
                  createEntity(this.entitySelectorService.entitySelected.entityOptions,coordinates);

      this.saveArea(area).subscribe(
        data => {
        this._snackBar.open(
          "Se ha guardado el Área en la Base de datos",
          "Cerrar",
          {duration : 3000}
        )
        area._id = (<Entity>data)._id;
        this.entitySelectorService.entitySelected = area;
        if(this.operationsService.loadEntityInLayout(this.entitySelectorService.entitySelected,coordinates)){
          const entityLocated:EntityLocated = new EntityLocated(this.entitySelectorService.entitySelected,this.entitySelectorService.entitySelected.getCoordinates())
          this.entitiesDeployedService.addNewEntityToMap(entityLocated);
          this.entitySelectorService.entitySelected = undefined;
        }
      });
    })
  }
// }
}
