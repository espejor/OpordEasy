import { Component, Input, OnInit } from '@angular/core';
import { Entity } from 'src/app/entities/entity.class';
import { Phase, Timeline } from 'src/app/models/operation';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
@Input() timeline:Timeline


getSVGTimelineItem(entity:Entity):string{
  return entity.getSVGTimelineItem();
}

  constructor(public operationsService: OperationsService) { }

  ngOnInit() {
  }

}
