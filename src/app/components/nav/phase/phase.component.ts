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
    private entitiesDeployed:EntitiesDeployedService) { }

  ngOnInit(): void {
  }

  loadLayout(){
    this.entitiesDeployed.entities = 
      this.operationsService.selectedOperation.phases[this.operationsService.phaseOrder].layout;
  }

  newTimeline(){
    
  }

}
