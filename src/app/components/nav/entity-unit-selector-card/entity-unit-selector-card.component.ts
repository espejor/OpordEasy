import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EntityUnit } from 'src/app/entities/entity-unit';
import { Entity } from 'src/app/entities/entity.class';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';

@Component({
  selector: 'app-entity-unit-selector-card',
  templateUrl: './entity-unit-selector-card.component.html',
  styleUrls: ['./entity-unit-selector-card.component.css']
})
export class EntityUnitSelectorCardComponent implements OnInit {
  @ViewChild ("entityCard") entityCard:ElementRef;
  @Input() entity:Entity;
  @Input() size:number = 1;
  svgTemplate:string;


  entityElementStyle = {

  }

  constructor(public svgService:SVGUnitsIconsListService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    this.entityCard.nativeElement.innerHTML = this.svgService.createSVGForCard(<EntityUnit>this.entity,this.size); 
  }

}
