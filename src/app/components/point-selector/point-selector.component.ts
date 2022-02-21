import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
import GeometryType from 'ol/geom/GeometryType';
import Point from 'ol/geom/Point';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import { Pixel } from 'ol/pixel';
import { Observable } from 'rxjs';
import { entityType } from 'src/app/entities/entitiesType';
import { Entity, EntityOptions } from 'src/app/entities/entity.class';
import { EntitySelector } from 'src/app/entities/factory-entity-selector';
import { FeatureForDeploing, PointOptions, ElementType } from 'src/app/models/feature-for-selector';
import { EntityLocated } from 'src/app/models/operation';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { HTTPEntitiesService } from 'src/app/services/entities.service';
import { EntitySelectorService } from 'src/app/services/entity-selector.service';
import { OperationsService } from 'src/app/services/operations.service';
import { SvgGeneralIconsListService } from 'src/app/services/svg-general-icons-list.service';
import { Selector } from '../selector-base';

@Component({
  selector: 'app-point-selector',
  templateUrl: './point-selector.component.html',
  styleUrls: ['./point-selector.component.css']
})
export class PointSelectorComponent extends Selector implements OnInit,AfterViewInit {
  
  public setFeaturesToSelect ;
  public listOfOptions = [];
  fieldsToShow: PointOptions["extraData"]["textFields"];
  listsToShow: PointOptions["extraData"]["lists"];
  numsToShow: PointOptions["extraData"]["numbers"];
  typeEntity:string

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
    for(const property in this.svgListOfIcons.features['points']) {
      options[property] = this.svgListOfIcons.features['points'][property].text;
    };
    return options;
  }

  loadExtraData(feature:KeyValue<string,any>){
    if(feature.value.codeForDeploing.extraData){
      this.fieldsToShow = feature.value.codeForDeploing.extraData.textFields
      this.listsToShow = feature.value.codeForDeploing.extraData.lists
      this.numsToShow = feature.value.codeForDeploing.extraData.numbers
    }else{
      this.fieldsToShow = undefined
      this.listsToShow = undefined
      this.numsToShow = undefined
    }


    this.resetAspectSelectors();
    const mapComponent = this.entitiesDeployedService.getMapComponent();
    // const coordinates:Coordinate = []; 
    const coordinates = mapComponent.map.getView().getCenter();
    feature.value.classCSS = feature.value.classCSS == "selectorSelected"? "unSelected" : "selectorSelected";
    // this.pointOptions = feature.value
    const point = EntitySelector.getFactory(entityType.point).createEntity(feature.value.codeForDeploing,coordinates);
    point.entityOptions.typeEntity = feature.value.selectorText
    
    this.entitySelectorService.entitySelected = point

  }


  updateFeatureWithTextField(event,option){
    (<PointOptions>this.entitySelectorService.entitySelected.entityOptions).extraData.textFields[option.key].value = event.target.value
  }

  updateFeatureWithList(event,option){
    (<PointOptions>this.entitySelectorService.entitySelected.entityOptions).extraData.lists[option.key].value = event.value    
  }

  updateFeatureWithTextNumber(event,option){
    (<PointOptions>this.entitySelectorService.entitySelected.entityOptions).extraData.numbers[option.key].value = event.target.value
  }


  savePoint(point:Entity<Geometry>):Observable<Object>{    // point.favorite = this.favorite;
    // La guardamos en la BD
    return this.httpEntitiesService.addEntity(point);
  }


  insertPoint(event) {
    // this.entitiesDeployedService.saveEntity(entityType.point);
    // ---todo Intentar referenciar con viewChild o Output/Input 
    
    const mapComponent = this.entitiesDeployedService.getMapComponent();
    const draw:Draw = new Draw({
      source:mapComponent.shapesVectorLayer,
      type: GeometryType.POINT
    })
    
    mapComponent.map.addInteraction(draw);

    var coordinates: Coordinate = [];
    draw.on("drawend", (evt:DrawEvent) => {
      mapComponent.map.removeInteraction(draw);
      
      coordinates = (<Point>evt.feature.getGeometry()).getCoordinates()
    // // const coordinates:Coordinate = []; 
    // const pixel:Pixel = [event.x,event.y];
    // const coordinates = mapComponent.map.getCoordinateFromPixel(pixel);
    // this.listOfUnitsCreated.push(this.pointOptions);
    const point = EntitySelector.getFactory(entityType.point).createEntity(this.entitySelectorService.entitySelected.entityOptions,coordinates);

    this.savePoint(point).subscribe(
      data => {
      this._snackBar.open(
        "Se ha guardado el Punto en la Base de datos",
        "Cerrar",
        {duration : 3000}
      )
      point._id = (<Entity>data)._id;
      this.entitySelectorService.entitySelected = point;
    // if (!coordinates)
    // if(this.entitySelectorService.entitySelected == undefined){ // Si no se ha grabado
    // }else 
      if(this.operationsService.loadEntityInLayout(this.entitySelectorService.entitySelected,coordinates)){
        const entityLocated:EntityLocated = new EntityLocated(this.entitySelectorService.entitySelected,this.entitySelectorService.entitySelected.getCoordinates())
        // entityLocated.entity = this.entitySelectorService.entitySelected
        // entityLocated.location = this.entitySelectorService.entitySelected.getCoordinates();
        this.entitiesDeployedService.addNewEntityToMap(entityLocated);
        this.entitySelectorService.entitySelected = undefined;
      }
    });
  })
  }
// }
}

