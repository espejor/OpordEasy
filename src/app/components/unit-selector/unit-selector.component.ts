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
import { FeatureForDeploing, TextFeatureForDeploing } from 'src/app/models/feature-for-selector';
import { HTTPEntitiesService } from 'src/app/services/entities.service';
import { Coordinate } from 'ol/coordinate';
import { OperationsService } from 'src/app/services/operations.service';
import { FavoriteSelectorComponent } from '../nav/favorite-selector/favorite-selector.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { entityType } from 'src/app/entities/entitiesType';
import { EntitySelector } from 'src/app/entities/factory-entity-selector';
import { EntitySelectorService } from 'src/app/services/entity-selector.service';
import { EntityLocated } from 'src/app/models/operation';
import { Pixel } from 'ol/pixel';
import { Selector } from '../selector-base';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';

@Component({
  selector: 'app-unit-selector',
  templateUrl: './unit-selector.component.html',
  styleUrls: ['./unit-selector.component.css']
})
export class UnitSelectorComponent extends Selector implements OnInit,AfterViewInit {
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
    section2:"Sector inferior",extraData:"Campos adicionales"};
  public setFeaturesToSelect = "frame";
  public unitResultIconName = "unit_result"

  // public listOfUnitsCreated: UnitOptions[] = [];
  listOfFavorites: EntityUnit[];

  reinforcedOptions:string[] = ["Reforzada","Reducida", "Reforzada Y Reducida"]
  reinforcedOptionSelected: null


  constructor(public svgListOfIconsService: SVGUnitsIconsListService, 
      private  entitiesDeployed:EntitiesDeployedService,
      private renderer: Renderer2,
      private httpEntitiesService:HTTPEntitiesService,
      private operationsService: OperationsService,
      // private svgService: SVGUnitsIconsListService, 
      private _snackBar: MatSnackBar,
      private entitySelectorService: EntitySelectorService)
      {
        super();
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
  
  insertUnit(coordinates?:Coordinate[]){
    const mapComponent = this.entitiesDeployed.getMapComponent();
    // const pixel:Pixel = [event.x,event.y];
    // if (!coordinates)
      // coordinates = mapComponent.map.getCoordinateFromPixel(pixel);
    if(this.entitySelectorService.entitySelected == undefined){
      const draw:Draw = new Draw({
        source:mapComponent.shapesVectorLayer,
        type: GeometryType.POINT
      })
      
      mapComponent.map.addInteraction(draw);
  
      var coords = [];
      draw.on("drawend", (evt:DrawEvent) => {
        mapComponent.map.removeInteraction(draw);
        coords = (<Point>evt.feature.getGeometry()).getCoordinates()
        this.deployUnit(coords);
      })
    }else{
      this.deployUnit(coordinates)
    }
  }

  deployUnit(coordinates){
    if(this.entitySelectorService.entitySelected == undefined){ // Si no se ha grabado
      this.saveUnit(true,coordinates)
    }else if(this.operationsService.loadEntity(this.entitySelectorService.entitySelected,coordinates)){
      const entityLocated:EntityLocated = new EntityLocated(this.entitySelectorService.entitySelected,this.entitySelectorService.entitySelected.getCoordinates())
      // entityLocated.entity = this.entitySelectorService.entitySelected
      // entityLocated.location = this.entitySelectorService.entitySelected.getCoordinates();
      this.entitiesDeployed.addNewEntity(entityLocated);
      this.entitySelectorService.entitySelected = undefined;
    }

  }


  saveUnit(andInsert = false,coordinates?){
    // this.entitiesDeployed.saveEntity(entityType.unit);
    // ---todo Intentar referenciar con viewChild o Output/Input 
    
    const mapComponent = this.entitiesDeployed.getMapComponent();
    // // const coordinates:Coordinate = []; 
    if(!coordinates)
      coordinates = mapComponent.map.getView().getCenter();
    // this.listOfUnitsCreated.push(this.unitOptions);
    const unit = EntitySelector.getFactory(entityType.unit).createEntity(this.unitOptions,coordinates);
    unit.favorite = this.favorite;
    // La guardamos en la BD
    this.httpEntitiesService.addEntity(unit).subscribe(
      data => {
      this._snackBar.open(
        "Se ha guardado la nueva Unidad en la Base de datos",
        "Cerrar",
        {duration : 3000}
      )
      unit._id = (<Entity>data)._id;
      this.entitySelectorService.entitySelected = unit;
      if (andInsert)
        this.insertUnit(coordinates);
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
      if (featuresLabel != "attachable" && featuresLabel != "extraData"){
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
  }

  filterFeature(feature) {
    return feature == 18
  }


  createSVG(entity?: EntityUnit){
    if (entity)
      this.unitOptions = <UnitOptions>entity.entityOptions;
    for(let i = 0;i < this.svg.nativeElement.childNodes.length;i++){
      const child = this.svg.nativeElement.childNodes[i]
      if(child.tagName == "path" || child.tagName  == undefined ){
        if(child.id != "foSymbol" && child.id != "cgSymbol" ){
          this.svg.nativeElement.removeChild(child);
          i--
        }
      }
    }
    this.goThrougtArray(this.unitOptions);
  }

  goThrougtArray(collection){
    for(let element in collection) {
      if(element != "attachable"){
        if (Array.isArray(collection[element])) {
          this.goThrougtArray(collection[element]);
        }
        else{
          if (collection[element] != null)
            this.updateIconTemplate(collection[element]);
          // else
          //   this.deleteIconTemplate(collection[element])
        }
      }
    };
  }

  checkState(event, el) {
    event.preventDefault();
    if (this.reinforcedOptionSelected && this.reinforcedOptionSelected === el.value) {
      el.checked = false;
      this.reinforcedOptionSelected = null;
    } else {
      this.reinforcedOptionSelected = el.value
      el.checked = true;
    }
    const txt:string = this.reinforcedOptionSelected == "Reforzada"? "(+)":this.reinforcedOptionSelected == "Reducida"?"(-)":this.reinforcedOptionSelected == "Reforzada Y Reducida"?"(±)":" "
    const feature = {key:"reinforced",value:{codeForDeploing:{x:165,y:70,visible:true,text:txt,fontSize:"18",indent:"start"}}}
    this.updateFeatureWithText(event,feature,txt)
  }

  addCG(event){
    this.removeChildElement(this.svg.nativeElement,"cgSymbol")
    if(event){
      const cg = this.renderer.createElement("path", 'svg');
      const x = 80
      const y = 130
      const draw = "m" + x + "," + y + " m0,0 v60";
      this.renderer.setAttribute(cg, "d", draw);
      this.renderer.setAttribute(cg, "stroke-width", "2")
      this.renderer.setAttribute(cg, "stroke", "#000")
      this.renderer.setAttribute(cg, "fill", "#00000001")
      this.renderer.setAttribute(cg, "id", "cgSymbol");
      this.renderer.appendChild(this.svg.nativeElement, cg)

      const obj = {type:"path", x:"0", y: "0", fill:"#00000001", stroke: "#000", strokeWidth:"2", d:{friendly:"m0,60 v60"}};
      const data = {key:"cgSymbol",value:{codeForDeploing: obj}}

      const exist = this.unitOptions.extraData.some(f => f.key == "cgSymbol")
      if(exist)
        this.unitOptions.extraData = this.unitOptions.extraData.filter(f => f.key != "cgSymbol")
      this.unitOptions.extraData.push(data) 
    }
  }

  addFO(event){
    this.removeChildElement(this.svg.nativeElement,"foSymbol")
    if(event){
      const fo = this.renderer.createElement("path", 'svg');
      const x = 95
      const y = 70
      const draw = "m" + x + "," + y + " m0,0 v-20h50v20";
      this.renderer.setAttribute(fo, "d", draw);
      this.renderer.setAttribute(fo, "stroke-width", "2")
      this.renderer.setAttribute(fo, "stroke", "#000")
      this.renderer.setAttribute(fo, "fill", "#00000001")
      this.renderer.setAttribute(fo, "id", "foSymbol");
      this.renderer.appendChild(this.svg.nativeElement, fo)

      const obj = {type:"path", x:"0", y: "0", fill:"#00000001", stroke: "#000", strokeWidth:"2", d:{friendly:"m15,0 v-20h50v20"}};
      const data = {key:"foSymbol",value:{codeForDeploing: obj}}

      const exist = this.unitOptions.extraData.some(f => f.key == "foSymbol")
      if(exist)
        this.unitOptions.extraData = this.unitOptions.extraData.filter(f => f.key != "foSymbol")
      this.unitOptions.extraData.push(data) 

    }
  }

  updateFeatureWithText(event:Event,feature,value?:string){
    this.removeChildElement(this.svg.nativeElement,feature.key)
    const text = this.renderer.createElement("text", 'svg');
    const textValue = value?value:(event.target as HTMLInputElement).value
    const txt = this.renderer.createText(textValue)
    const fontSize = feature.value.codeForDeploing.fontSize?feature.value.codeForDeploing.fontSize:"12"
    const indent = feature.value.codeForDeploing.indent?feature.value.codeForDeploing.indent:"end"
    this.renderer.setAttribute(text, "x", feature.value.codeForDeploing.x);
    this.renderer.setAttribute(text, "y", feature.value.codeForDeploing.y);
    this.renderer.setAttribute(text, "id", feature.key);
    this.renderer.setAttribute(text, "style", "font: " + fontSize + "px sans-serif; text-anchor: " + indent);
    this.renderer.appendChild(this.svg.nativeElement, text)
    this.renderer.appendChild(text, txt)

    const obj = {visible:feature.value.codeForDeploing.visible, type: "text", x: feature.value.codeForDeploing.x,y: feature.value.codeForDeploing.y,text:txt.data,indent:feature.value.codeForDeploing.indent}
    const data = {key:feature.key,value:{codeForDeploing: obj}}
    // this.unitOptions.extraData[feature.key] = obj
    const exist = this.unitOptions.extraData.some(f => f.key == feature.key)
    if(exist)
      this.unitOptions.extraData = this.unitOptions.extraData.filter(f => f.key != feature.key)
    this.unitOptions.extraData.push(data) 
  }

  removeChildElement(parent:any,childId:string){
    // const parent: HTMLElement = this.svg.nativeElement;
    const children = parent.childNodes;
    children.forEach((child:any) => {
      if (child.id == childId)
        this.renderer.removeChild(parent,child)
    })
  }

  addFeature(feature:KeyValue<string,FeatureForDeploing|TextFeatureForDeploing>){
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

  
  public updateIconTemplate(feature: FeatureForDeploing){
    const type = feature.value.codeForDeploing.type;
    const element = this.renderer.createElement(type, 'svg');

    if (type == "path"){
      const draw = "m" + feature.value.codeForDeploing.x + "," + feature.value.codeForDeploing.y + (feature.value.codeForDeploing.d[this.getD(feature)]);
      this.renderer.setAttribute(element, "d", draw);
      this.renderer.setAttribute(element, "stroke-width", feature.value.codeForDeploing.strokeWidth)
      this.renderer.setAttribute(element, "stroke", feature.value.codeForDeploing.stroke)
      this.renderer.setAttribute(element, "fill", feature.value.codeForDeploing.fill)
    }else if (type == "text"){

    }

    this.renderer.appendChild(this.svg.nativeElement, element)
  }  

  getD(type:FeatureForDeploing):string{
    if(this.unitOptions.frame)
      return type.value.codeForDeploing.d[this.unitOptions.frame.key] != undefined? this.unitOptions.frame.key :"friendly"
    return "friendly";
  }



  unsorted():number{
    return 0;
  }

}
