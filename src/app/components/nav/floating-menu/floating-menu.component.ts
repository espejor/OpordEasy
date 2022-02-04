import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.css']
})
export class FloatingMenuComponent implements OnInit {
  @Output() emitter = new EventEmitter();
  @Output() emitterTutorial = new EventEmitter();
  tutorialOpened: boolean;
  // activatedOperationsFormOpened = false;
  constructor(private operationsService:OperationsService) { }

  ngOnInit() {
  }

changeViewOPORD(){
  if(this.operationsService.isOperationLoaded())
    this.operationsService.opordFormOpened = !this.operationsService.opordFormOpened
}

changeViewOperations(){
  this.operationsService.activatedOperationsFormOpened = !this.operationsService.activatedOperationsFormOpened
  const data = this.operationsService.activatedOperationsFormOpened?"activated":"deactivated"
  this.emitter.emit(data);
  console.log("-------------PINCHANDO" , this.operationsService.activatedOperationsFormOpened)
}
openTutorial(){
  this.tutorialOpened = !this.tutorialOpened
  this.emitterTutorial.emit(this.tutorialOpened)
}

}
