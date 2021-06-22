import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Entity } from 'src/app/entities/entity.class';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';

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

  constructor(public svgService:SVGUnitsIconsListService) {  }

  ngOnInit() {
  }

  ngAfterViewInit():void{
    this.entityCard.nativeElement.innerHTML = this.svgService.createSVGForCard(this.entity.entityOptions,this.size); 
  }

}
