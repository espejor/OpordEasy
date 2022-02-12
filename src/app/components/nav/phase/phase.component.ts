import { Component, OnInit } from '@angular/core';
import { EntitiesDeployedService } from 'src/app/services/entities-deployed.service';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css']
})
export class PhaseComponent implements OnInit {

  constructor(public operationsService:OperationsService,
    private entitiesDeployedService:EntitiesDeployedService) { }

  ngOnInit(): void {
  }

  loadLayout(){
    this.entitiesDeployedService.entities = 
      this.operationsService.selectedOperation.phases[this.operationsService.phaseOrder].layout;
  }

  newTimeline(){
    this.operationsService.newTimeline()
  }

  deleteTimeline(i:number){
    this.operationsService.deleteTimeline(i);
  }

  deletePhase(i:number){
    this.operationsService.deletePhase(i);
  }

}
