import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { Entity, EntityOptions } from 'src/app/entities/entity.class';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { HTTPEntitiesService } from 'src/app/services/entities.service';
import { OperationsService } from 'src/app/services/operations.service';
import { UtmService } from 'src/app/services/utm.service';
import * as Proj from 'ol/proj';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';
import { SvgIconsListService } from 'src/app/services/svg-icons-list.service';
import { Pixel } from 'ol/pixel';

@Component({
  selector: 'app-bubble_feature',
  templateUrl: './bubble_feature.component.html',
  styleUrls: ['./bubble_feature.component.css']
})
export class Bubble_featureComponent implements OnInit,AfterViewInit,OnChanges {
  @Input() pixel:Pixel
  @Input() entity:Entity
  @Input() bubbleState:boolean
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();

  closeBubble() {
      this.onClose.emit(true);
  }

  typeEntity: string;
  entitiesDeployedServiceSvc:EntitiesDeployedService
  operationsService: OperationsService;
  entitiesService: HTTPEntitiesService;
  entityOptions:EntityOptions
  listsToShow: [string,any][];
  fieldsToShow: [string,any][];
  numsToShow: [string,any][];
  Object = Object;
  updated: boolean;
  coordinatesToShow: Coordinate;
  utmService: UtmService;

  constructor(entitiesDeployedServiceSvc:EntitiesDeployedService,operationsService:OperationsService,
              entitiesService:HTTPEntitiesService,utmService:UtmService,
              public svgUnit:SVGUnitsIconsListService,public svgIconsList:SvgIconsListService) {
    this.entitiesDeployedServiceSvc = entitiesDeployedServiceSvc
    this.operationsService = operationsService
    this.entitiesService = entitiesService
    this.utmService = utmService
  }

  updateBubbleData(): void {
    // this.updated = true
    this.resetBubbleData()
    this.typeEntity = this.entity.getType()

    if(this.entity.entityOptions.extraData){
      const extraData = this.entity.entityOptions.extraData
      // const lists = this.loadLists(extraData.lists)
      this.listsToShow = extraData.lists?Object.entries(extraData.lists):null
      if(this.typeEntity == "Unidad")
        this.fieldsToShow = extraData.fields.textFields?Object.entries(extraData.fields.textFields):this.svgUnit.features['extraData']['fields'].textFields
      else
        this.fieldsToShow = extraData.textFields?Object.entries(extraData.textFields):null
      
      this.numsToShow = extraData.numbers?Object.entries(extraData.numbers):null
    }else{
      const textFields = this.entity.getSvgSvcFieldsOfExtraData()
      if(textFields)
        this.fieldsToShow = Object.entries(textFields)
    }
    this.coordinatesToShow = !Array.isArray(this.entity.getCoordinates()[0])? roundCoordinate(<Coordinate>this.utmService.forward (Proj.toLonLat(<Coordinate>this.entity.getCoordinates()))):null // Sólo para los puntos
  }

  // loadLists(lists: any) {
  //   for(const list in lists){
  //     const expandedList = this.svgIconsList.getList(lists[list].list)
  //     lists[list].list = expandedList
  //   }
  // }

  resetBubbleData() {
    this.listsToShow = null
    this.fieldsToShow = null
    this.numsToShow = null
    this.coordinatesToShow = null
  }

  deleteEntity(){
    // Eliminar la entidad del Layout, de la Fases y del Combo de la Operación
    this.operationsService.deleteEntityFromOperation(this.entity)
    this.entitiesService.deleteEntity(this.entity._id)
    this.closeBubble()
  }

  updateEntity(){
    if(this.coordinatesToShow){
      const newCoordinates = [this.coordinatesToShow[0] * 1,this.coordinatesToShow[1] * 1]
      const lonLatCoords = this.utmService.inverse(newCoordinates)
      const nativeCoordinates = Proj.fromLonLat(lonLatCoords)
      this.entity.setCoordinates(nativeCoordinates)
      this.operationsService.updateEntityPositionInOperation(this.entity)
    }
    if(this.fieldsToShow && !this.entity.entityOptions.extraData){
      var  textFields = {}
      this.fieldsToShow.forEach(field => {
        const key = field[0]
        textFields[key] = field[1]
      })
      if(this.typeEntity == "Unidad"){
        this.entity.entityOptions["extraData"] = {fields:{textFields:textFields}}
      }else{
        this.entity.entityOptions["extraData"] = {textFields:textFields}
      }
    }
    this.operationsService.updateEntityInOperation(this.entity)
    const response = this.entitiesDeployedServiceSvc.updateEntity(this.entity)
    if (response != -1)
      this.entitiesService.updateEntity(this.entity).subscribe((data) => {
        console.log(data);
      })
  }


  ngAfterViewInit(): void {
    this.updateBubbleData()
  }

  updateFeatureWithTextNumber(event,list){

  }

  updateFeatureWithTextField(event,list){

  }

  updateFeatureWithList(event,list){

  }

  ngOnChanges(){
    this.updateBubbleData()
  }

  getTypeEntity(){
    // if(!this.updated)
    //   this.updateData()
    // else
    //   this.updated = false
    const options = this.entity.entityOptions
    if (options.extraData)
      if(options.extraData.lists)
        if(options.extraData.lists.type){
          const list = options.extraData.lists.type.list
          const shortValue = options.extraData.lists.type.value
          return this.entitiesDeployedServiceSvc.svgListOfIconsService.getTypeFromShortType(shortValue,list)
        }
    // if(options.verbose)
        return this.entity.getVerbose()
    // return this.entity.getType()
  }

  ngOnInit() {
  }


}

export function roundCoordinate(coordinate:Coordinate): Coordinate{
  return [Math.round(coordinate[0]),Math.round(coordinate[1])]
}