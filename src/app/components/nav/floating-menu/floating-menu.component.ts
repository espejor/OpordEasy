import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Draw from 'ol/interaction/Draw';
import { AuthService } from 'src/app/services/auth.service';
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
  constructor(public router: Router,private authService:AuthService, private operationsService:OperationsService,private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { 
    this.iconRegistry.addSvgIcon("ruler", this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ruler.svg'));
  }

  ngOnInit() {
  }

  changeViewOPORD(){
    if(this.operationsService.isOperationLoaded())
      this.router.navigate(['Opord'])
      // this.operationsService.opordFormOpened = !this.operationsService.opordFormOpened
  }

  changeViewOperations(){
    // this.operationsService.activatedOperationsFormOpened = !this.operationsService.activatedOperationsFormOpened
    // const data = this.operationsService.activatedOperationsFormOpened?"activated":"deactivated"
    // this.emitter.emit(data);
    // console.log("-------------PINCHANDO" , this.operationsService.activatedOperationsFormOpened)
      this.router.navigate(['Operations'])
  }
  openTutorial(){
    // this.tutorialOpened = !this.tutorialOpened
    // this.emitterTutorial.emit(this.tutorialOpened)
      this.router.navigate(['Help'])
  }

  register(){
      this.router.navigate(['register'])
  }

  openMeasureTool(){
    this.rulerOpened = !this.rulerOpened
    this.emitterRuler.emit(this.rulerOpened)
  }
 

}
