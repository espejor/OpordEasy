import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import Draw from 'ol/interaction/Draw';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.css']
})
export class FloatingMenuComponent implements OnInit {
  @Output() emitter = new EventEmitter();
  @Output() emitterTutorial = new EventEmitter();
  @Output() emitterRuler = new EventEmitter();
  tutorialOpened: boolean;
  rulerOpened: boolean;
  // activatedOperationsFormOpened = false;
  constructor(private operationsService:OperationsService,private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { 
    this.iconRegistry.addSvgIcon("ruler", this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ruler.svg'));
  }

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

  openMeasureTool(){
    this.rulerOpened = !this.rulerOpened
    this.emitterRuler.emit(this.rulerOpened)
  }
 

}
