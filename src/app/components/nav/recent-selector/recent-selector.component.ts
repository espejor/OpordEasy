import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EntityUnit } from 'src/app/entities/entity-unit';
import { Entity } from 'src/app/entities/entity.class';
import { HTTPEntitiesService } from 'src/app/services/entities.service';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-recent-selector',
  templateUrl: './recent-selector.component.html',
  styleUrls: ['./recent-selector.component.css']
})
export class RecentSelectorComponent implements OnInit {
  // @ViewChild ("oneFavorite") oneFavorite:ElementRef;
  listOfRecents: Entity[];
  @Input() createSVG: Function;


  constructor(private httpEntitiesService:HTTPEntitiesService,
    private operationsService:OperationsService) { }

  ngOnInit(): void {
    this.listOfRecents = [];
    this.httpEntitiesService.getEntities().subscribe(res => {
      console.log(res);
      const list = <EntityUnit[]>res;
      this.listOfRecents = list.
        sort((a,b) => {
          if (a.dateCreation > b.dateCreation) return -1;
          else if (a.dateCreation < b.dateCreation) return 1
          else return 0}).
        slice(0,5);
      console.log(this.listOfRecents)
    });;
  }

  updateModel(unit:Entity){
    this.createSVG(unit);
    // this.operationsService.loadEntity(unit);
  }
}
