import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import { EntityPoint } from 'src/app/entities/entity-point.class';
import { EntityOptions } from 'src/app/entities/entity.class';
import { FeatureForSelector } from 'src/app/models/feature-for-selector';
import { EntityLocated } from 'src/app/models/operation';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { SvgGeneralIconsListService } from 'src/app/services/svg-general-icons-list.service';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';

@Component({
  selector: 'app-point-selector',
  templateUrl: './point-selector.component.html',
  styleUrls: ['./point-selector.component.css']
})
export class PointSelectorComponent implements OnInit {
  public setFeaturesToSelect = "command";
  public listOfOptions = {control:"Puntos de control",obs:"Observatorio",logistic:"Logística", depart_point:"Punto de Partida"};

  private pointOptions: PointOptions = new PointOptions();

  constructor(public svgListOfIcons: SvgGeneralIconsListService, 
    private  entitiesDeployed:EntitiesDeployedService) {
   }

  ngOnInit(): void {
  }

  unsorted():number{
    return 0;
  }

  loadExtraData(feature:KeyValue<string,FeatureForSelector>){

  }

  
  savePoint(){
    const mapComponent = this.entitiesDeployed.getMapComponent(); 
    const coordinates:Coordinate[] = [];
    coordinates[0] = mapComponent.map.getView().getCenter();
    const point = new EntityPoint(null, this.pointOptions,{geometry: new Point(coordinates[0])});
    this.entitiesDeployed.addNewEntity(new EntityLocated(point),coordinates);
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