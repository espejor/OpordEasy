import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.css']
})
export class FloatingMenuComponent implements OnInit {
  @Output() emitter = new EventEmitter();
  // activatedOperations = false;
  constructor(private operationsService:OperationsService) { }

  ngOnInit() {
  }


changeView(){
  this.operationsService.activatedOperations = !this.operationsService.activatedOperations
  const data = this.operationsService.activatedOperations?"activated":"deactivated"
  this.emitter.emit(data);
  console.log("-------------PINCHANDO" , this.operationsService.activatedOperations)
}

}
