import { KeyValue } from '@angular/common';
import { noUndefined } from '@angular/compiler/src/util';
import { Component, ElementRef, OnInit, ViewChild, Renderer2,AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';
import { EntityUnit } from 'src/app/entities/entity-unit';
import { Entity, EntityOptions } from 'src/app/entities/entity.class';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';
import { FeatureForSelector } from 'src/app/models/feature-for-selector';

@Component({
  selector: 'app-unit-selector',
  templateUrl: './unit-selector.component.html',
  styleUrls: ['./unit-selector.component.css']
})
export class UnitSelectorComponent implements OnInit,AfterViewInit {
  @ViewChild('svg') svg: ElementRef;
  @Output() messageEvent = new EventEmitter();
  // @Input() dialog;

  public svgListOfIcons: SVGUnitsIconsListService
  // public entitiesDeployed: EntitiesDeployedService
  public selectorClass = "selector"
  private unitOptions: UnitOptions = new UnitOptions();
  private path:string = "assets/icons/units"
  public listOfOptions = {frame:"Marco",main:"Sector Principal",level:"Escalón", section1:"Sector superior",
    section2:"Sector inferior",sectionAdd:"Campos adicionales"};
  public setFeaturesToSelect = "frame";
  public unitResultIconName = "unit_result"

  public listOfUnitsCreated: UnitOptions[] = [];

  constructor(public svgListOfIconsService: SVGUnitsIconsListService, 
      private  entitiesDeployed:EntitiesDeployedService,
      private renderer: Renderer2) 
      {
      this.svgListOfIcons = svgListOfIconsService;
      this.unitOptions = new UnitOptions();
    }

  ngOnInit(): void {
  }

  saveUnit(){
    const mapComponent = this.entitiesDeployed.getMapComponent(); 
    const coordinates = mapComponent.map.getView().getCenter();
    this.listOfUnitsCreated.push(this.unitOptions);
    const unit = new EntityUnit(this.svgListOfIconsService,mapComponent, this.unitOptions,{geometry: new Point(coordinates)});
    this.entitiesDeployed.addNewEntity(unit);
  }



  ngAfterViewInit():void{
    //Hay que pasar la Feature en formato <key,value>
    this.resetAspectSelectors();
    this.addFeature({key :"friendly",value :this.svgListOfIcons.features.frame.friendly});
  }
  
  resetAspectSelectors() {
    for (let features in this.svgListOfIcons.features){
      for (let feature in this.svgListOfIcons.features[features]){
        this.svgListOfIcons.features[features][feature].classCSS = "selector"
      }
    }
  }

  filterFeature(feature) {
    return feature == 18
  }

  createSVG(){
    // this.svgListOfIcons.UNIT_RESULT = "<svg width='80' height='60' version='1.1' xmlns='http://www.w3.org/2000/svg'>"
    while ( this.svg.nativeElement.firstChild){
      this.svg.nativeElement.removeChild(this.svg.nativeElement.firstChild);
    }
//    this.svg.nativeElement
    this.goThrougtArray(this.unitOptions);

    // this.svgListOfIcons.UNIT_RESULT += "</svg>"

    // this.updateIconTemplate();

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

  addFeature(feature:KeyValue<string,FeatureForSelector>){
    const selected = this.unitOptions[this.setFeaturesToSelect];

    
    if (Array.isArray(selected)){ // buscamos en un array de Features
      feature.value.classCSS = feature.value.classCSS == "selector"? feature.value.classCSS = "selectorSelected": feature.value.classCSS = "selector";
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
        selected.value.classCSS = "selector"
        feature.value.classCSS = "selectorSelected"
        this.unitOptions[this.setFeaturesToSelect] = feature;
      }else{
        feature.value.classCSS = "selector"
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

export class UnitOptions extends EntityOptions{
  frame:FeatureForSelector;
  main:FeatureForSelector[];
  sector1:FeatureForSelector;
  sector2:FeatureForSelector;
  level:FeatureForSelector;

  constructor(){
    super();
    this.frame = null;
    this.main = [];
    this.sector1 = null;
    this.sector2 = null;
    this.level = null;
  }
}
