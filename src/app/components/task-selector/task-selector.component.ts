import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Map, MapBrowserEvent, MapBrowserEventHandler } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { MultiPoint, Point } from 'ol/geom';
import Geometry from 'ol/geom/Geometry';
import GeometryType from 'ol/geom/GeometryType';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import { Observable } from 'rxjs';
import { getEntityType } from 'src/app/entities/entitiesType';
import { AreaOptions } from 'src/app/entities/entity-area.class';
import { LineOptions } from 'src/app/entities/entity-line.class';
import { MultiPointOptions } from 'src/app/entities/entity-multipoint.class';
import { TaskOptions } from 'src/app/entities/entity-task.class';
import { Entity } from 'src/app/entities/entity.class';
import { EntitySelector } from 'src/app/entities/factory-entity-selector';
import { EntityLocated } from 'src/app/models/operation';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { HTTPEntitiesService } from 'src/app/services/entities.service';
import { EntitySelectorService } from 'src/app/services/entity-selector.service';
import { OperationsService } from 'src/app/services/operations.service';
import { SvgTasksIconsListService } from 'src/app/services/svg-tasks-icons-list.service';
import { Globals } from 'src/app/utilities/globals';
import { Selector } from '../selector-base';

@Component({
  selector: 'app-task-selector',
  templateUrl: './task-selector.component.html',
  styleUrls: ['./task-selector.component.css']
})
export class TaskSelectorComponent extends Selector implements OnInit,AfterViewInit {
  public setFeaturesToSelect ;
  public listOfOptions = [];
  optionsForDeploying: TaskOptions;

  constructor(public svgListOfIcons: SvgTasksIconsListService, 
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
    for (let selector in this.svgListOfIcons.features.tasks.selector){
      for(let featureForDeploying in this.svgListOfIcons.features.tasks.selector[selector]){
        this.svgListOfIcons.features.tasks.selector[selector].classCSS = "unSelected"
      }
    }
  }

  fillArrayOfOptions(): any[] {
    const options:any[] = []
    for(const property in this.svgListOfIcons.features.tasks) {
      options[property] = this.svgListOfIcons.features.tasks[property].text;
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
    this.optionsForDeploying = feature.value.codeForDeploing
  }
  
  saveTask(task:Entity<Geometry>):Observable<Object>{    // task.favorite = this.favorite;
    // La guardamos en la BD
    return this.httpEntitiesService.addEntity(task);
  }

  
    
  insertTask(event) {
    // ---todo Intentar referenciar con viewChild o Output/Input 
    var clicks = 0;
    var points: Coordinate[] =[]
    const map:Map = Globals.MAP
    const typeInteracction = TaskOptions.getTypeTask(this.optionsForDeploying.typeTask)

    var nPoints
    
    if(this.optionsForDeploying.options && isMultiPointOption(this.optionsForDeploying.options))
      nPoints = this.optionsForDeploying.options.numPoints

    const mapComponent = this.entitiesDeployed.getMapComponent();

    const draw:Draw = new Draw({
      source:mapComponent.shapesVectorLayer,
      type: typeInteracction,
      minPoints: nPoints?nPoints:undefined,
      maxPoints: nPoints?nPoints:Infinity
    })

    function isMultiPointOption(mpo: MultiPointOptions | LineOptions | AreaOptions): mpo is MultiPointOptions { //magic happens here
      return (<MultiPointOptions>mpo).numPoints !== undefined;
    }
    
    mapComponent.map.addInteraction(draw);

    var coordinates: Coordinate[] | Coordinate;

    draw.on("change", (evt:DrawEvent) => {
      console.log("---------")
    })

    draw.on("drawend", (evt:DrawEvent) => {
      // if (evt.feature.getGeometry().getType() == GeometryType.MULTI_POINT){
      //   points.push((<MultiPoint>evt.feature.getGeometry()).getCoordinates()[0])
      //   // draw.setProperties({
      //   //   "style":new Style({
      //   //     geometry: new Point((<MultiPoint>evt.feature.getGeometry()).getCoordinates()[0]),
      //   //     image:new Icon({
      //   //       src:"assets/icons/point.svg"
      //   //     })
      //   //   })
      //   // })
      //   if(++clicks == (<MultiPointOptions>this.optionsForDeploying.options).numPoints) {
      //     coordinates = points
      //   }else 
      //     return
      // }
      mapComponent.map.removeInteraction(draw);
      if(!coordinates)
        coordinates = TaskOptions.getCoordinatesByType (this.optionsForDeploying.typeTask,evt.feature)

      const task = EntitySelector.getFactory(getEntityType(this.optionsForDeploying.typeTask)).
                  createEntity(this.optionsForDeploying,coordinates);

      this.saveTask(task).subscribe(
        data => {
        this._snackBar.open(
          "Se ha guardado la Tarea en la Base de datos",
          "Cerrar",
          {duration : 3000}
        )
        task._id = (<Entity>data)._id;
        this.entitySelectorService.entitySelected = task;
        if(this.operationsService.loadEntity(this.entitySelectorService.entitySelected,coordinates)){
          const entityLocated:EntityLocated = new EntityLocated(this.entitySelectorService.entitySelected,this.entitySelectorService.entitySelected.getCoordinates())
          this.entitiesDeployed.addNewEntity(entityLocated);
          this.entitySelectorService.entitySelected = undefined;
        }
      });
    })
  }

}
