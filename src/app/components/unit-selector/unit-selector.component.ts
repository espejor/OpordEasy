import { KeyValue } from '@angular/common';
import { noUndefined } from '@angular/compiler/src/util';
import { Component, ElementRef, OnInit, ViewChild, Renderer2,AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';
import { EntityUnit, UnitOptions } from 'src/app/entities/entity-unit';
import { Entity, EntityOptions } from 'src/app/entities/entity.class';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';
import { FeatureForSelector, TextFeatureForSelector } from 'src/app/models/feature-for-selector';
import { EntitiesService } from 'src/app/services/entities.service';
import { Coordinate } from 'ol/coordinate';
import { OperationsService } from 'src/app/services/operations.service';
import { FavoriteSelectorComponent } from '../nav/favorite-selector/favorite-selector.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { entityType } from 'src/app/entities/entitiesType';
import { EntitySelector } from 'src/app/entities/factory-entity-selector';
import { UnitSelectorService } from 'src/app/services/unit-selector.service';
import { EntityLocated } from 'src/app/models/operation';
import { Pixel } from 'ol/pixel';

@Component({
  selector: 'app-unit-selector',
  templateUrl: './unit-selector.component.html',
  styleUrls: ['./unit-selector.component.css']
})
export class UnitSelectorComponent implements OnInit,AfterViewInit {
  @ViewChild('svg') svg: ElementRef;
  // @ViewChild(FavoriteSelectorComponent) favoriteSelectorComponent:FavoriteSelectorComponent;

  @Output() messageEvent = new EventEmitter();
  // @Input() dialog;

  public svgListOfIcons: SVGUnitsIconsListService
  // public entitiesDeployed: EntitiesDeployedService
  public selectorClass;
  public favorite;
  // public fav = "fav";
  // public rec = "rec";
  private unitOptions: UnitOptions = new UnitOptions();
  private path:string = "assets/icons/units"
  public listOfOptions = {frame:"Marco",main:"Sector Principal",level:"Escalón", section1:"Sector superior",
    section2:"Sector inferior",sectionAdd:"Campos adicionales"};
  public setFeaturesToSelect = "frame";
  public unitResultIconName = "unit_result"

  public listOfUnitsCreated: UnitOptions[] = [];
  listOfFavorites: EntityUnit[];


  constructor(public svgListOfIconsService: SVGUnitsIconsListService, 
      private  entitiesDeployed:EntitiesDeployedService,
      private renderer: Renderer2,
      private entitiesService:EntitiesService,
      private operationsService: OperationsService,
      private svgService: SVGUnitsIconsListService, 
      private _snackBar: MatSnackBar,
      private unitSelectorService: UnitSelectorService)
      {
      this.svgListOfIcons = svgListOfIconsService;
      this.unitOptions = new UnitOptions();
    }

  ngOnInit(): void {
  }


  ngAfterViewInit():void{
    //Hay que pasar la Feature en formato <key,value>
    this.selectorClass = "unSelected"
    this.resetAspectSelectors();
    this.addFeature({key :"friendly",value :this.svgListOfIcons.features.frame.friendly});
  }

  
  get createSVGCall() {
    this.updateAspectSelectors();
    return this.createSVG.bind(this);
  }
  
  insertUnit(event){
    const mapComponent = this.entitiesDeployed.getMapComponent();
    const pixel:Pixel = [event.x,event.y];
    const coordinates:Coordinate = mapComponent.map.getCoordinateFromPixel(pixel);
    if(this.unitSelectorService.entitySelected == undefined){ // So n se ha grabado
      this.saveUnit(true)
    }else if(this.operationsService.loadUnit(this.unitSelectorService.entitySelected,coordinates)){
      const entityLocated:EntityLocated = new EntityLocated()
      entityLocated.entity = this.unitSelectorService.entitySelected
      entityLocated.location = this.unitSelectorService.entitySelected.getCoordinates();
      this.entitiesDeployed.addNewEntity(entityLocated);
      this.unitSelectorService.entitySelected = undefined;
    }
  }


  saveUnit(andInsert = false){
    // ---todo Intentar referenciar con viewChild o Output/Input 
    
    const mapComponent = this.entitiesDeployed.getMapComponent();
    // const coordinates:Coordinate = []; 
    const coordinates = mapComponent.map.getView().getCenter();
    this.listOfUnitsCreated.push(this.unitOptions);
    const unit = EntitySelector.getFactory(entityType.unit).createEntity(this.svgListOfIconsService, this.unitOptions,coordinates);
    unit.favorite = this.favorite;
    // La guardamos en la BD
    this.entitiesService.addEntity(unit).subscribe(
      data => {
      this._snackBar.open(
        "Se ha guardado la nueva Unidad en la Base de datos",
        "Cerrar",
        {duration : 3000}
      )
      unit._id = (<Entity>data)._id;
      this.unitSelectorService.entitySelected = unit;
      if (andInsert)
        this.insertUnit(null);
    });
  }


  resetAspectSelectors() {
    for (let featuresLabel in this.svgListOfIcons.features){
      for (let feature in this.svgListOfIcons.features[featuresLabel]){
        this.svgListOfIcons.features[featuresLabel][feature].classCSS = "unSelected"
      }
    }
  }

  updateAspectSelectors(){
    this.resetAspectSelectors();
    for (let featuresLabel in this.unitOptions){
      if (this.unitOptions[featuresLabel] != null){ // Inicializado
        if (Array.isArray(this.unitOptions[featuresLabel])){ // es un array
          if(this.unitOptions[featuresLabel].length > 0){
            for (let featureInArray in this.unitOptions[featuresLabel]){
              this.svgListOfIcons.features[featuresLabel][this.unitOptions[featuresLabel][featureInArray].key].classCSS = "selectorSelected"
            }
          }
        }else{
          this.svgListOfIcons.features[featuresLabel][this.unitOptions[featuresLabel].key].classCSS = "selectorSelected"
        }
      }
    }
  }

  filterFeature(feature) {
    return feature == 18
  }


  createSVG(entity?: EntityUnit){
    if (entity)
      this.unitOptions = <UnitOptions>entity.entityOptions;
    while ( this.svg.nativeElement.firstChild){
      this.svg.nativeElement.removeChild(this.svg.nativeElement.firstChild);
    }
    this.goThrougtArray(this.unitOptions);
  }

  goThrougtArray(collection){
    for(let element in collection) {
      if (Array.isArray(collection[element])) {
        this.goThrougtArray(collection[element]);
      }
      else{
        if (collection[element] != null)
          this.updateIconTemplate(collection[element]);
        // else
        //   this.deleteIconTemplate(collection[element])
      }
    };
  }

  updateFeature(event){
    // const label = 
    const value = event.srcElement.value
    console.log()
  }

  addFeature(feature:KeyValue<string,FeatureForSelector|TextFeatureForSelector>){
    const selected = this.unitOptions[this.setFeaturesToSelect];
    
    if (Array.isArray(selected)){ // buscamos en un array de Features
      feature.value.classCSS = feature.value.classCSS == "unSelected"? feature.value.classCSS = "selectorSelected": feature.value.classCSS = "unSelected";
      const exist = selected.some(f => f.key == feature.key);
      if (selected.length == 0 || !exist )   // NO existe el elemento
        this.unitOptions[this.setFeaturesToSelect].push(feature);  // lo agregamos
      else  // Existe el elemento -> lo borramos
        this.unitOptions[this.setFeaturesToSelect] = selected.filter(f => f.key != feature.key)
    }else // No es un array
      if (selected == null){
        feature.value.classCSS = "selectorSelected"
        this.unitOptions[this.setFeaturesToSelect] = feature;
      }else if(feature.key != selected.key){
        selected.value.classCSS = "unSelected"
        feature.value.classCSS = "selectorSelected"
        this.unitOptions[this.setFeaturesToSelect] = feature;
      }else{
        feature.value.classCSS = "unSelected"
        this.unitOptions[this.setFeaturesToSelect] = null;
      }
    this.createSVG();
  }

  
  public updateIconTemplate(feature: FeatureForSelector){
    const type = feature.value.svg.type;
    const element = this.renderer.createElement(type, 'svg');

    if (type == "path"){
      const draw = "m" + feature.value.svg.x + "," + feature.value.svg.y + (feature.value.svg.d[this.getD(feature)]);
      this.renderer.setAttribute(element, "d", draw);
      this.renderer.setAttribute(element, "stroke-width", feature.value.svg.strokeWidth)
      this.renderer.setAttribute(element, "stroke", feature.value.svg.stroke)
      this.renderer.setAttribute(element, "fill", feature.value.svg.fill)
    }else if (type == "text"){

    }

    this.renderer.appendChild(this.svg.nativeElement, element)
  }  

  getD(type:FeatureForSelector):string{
    if(this.unitOptions.frame)
      return type.value.svg.d[this.unitOptions.frame.key] != undefined? this.unitOptions.frame.key :"friendly"
    return "friendly";
  }



  unsorted():number{
    return 0;
  }

}
