import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Entity } from 'src/app/entities/entity.class';
import { EntityFactory } from 'src/app/entities/factory-entity';
import { EntitySelector } from 'src/app/entities/factory-entity-selector';
import { SvgIconsListService } from 'src/app/services/svg-icons-list.service';

@Component({
  selector: 'app-entity-in-timeline',
  templateUrl: './entity-in-timeline.component.html',
  styleUrls: ['./entity-in-timeline.component.css']
})
export class EntityInTimelineComponent implements OnInit, AfterViewInit {
  @ViewChild ("entityCard") entityCard:ElementRef;
  @Input() entity:Entity;
  @Input() size:number = 0.5;
  svgTemplate:string;


  entityElementStyle = {

  }

  constructor(public svgService:SvgIconsListService) {  }

  ngOnInit() {
  }

  ngAfterViewInit():void{
    this.svgService = EntitySelector.getFactory(this.entity.entityType).getSVGService();
    this.entityCard.nativeElement.innerHTML = this.svgService.createSVGForCard(this.entity.entityOptions,this.size); 
  }

}
