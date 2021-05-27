import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-floating-buttons',
  templateUrl: './floating-buttons.component.html',
  styleUrls: ['./floating-buttons.component.css']
})
export class FloatingButtonsComponent implements OnInit {

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { 
    iconRegistry.addSvgIcon("unit-button", sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unit-button.svg'));
    iconRegistry.addSvgIcon("control-point-button", sanitizer.bypassSecurityTrustResourceUrl('assets/icons/control-point-button.svg'));
    iconRegistry.addSvgIcon("lines-button", sanitizer.bypassSecurityTrustResourceUrl('assets/icons/lines-button.svg'));
    iconRegistry.addSvgIcon("areas-button", sanitizer.bypassSecurityTrustResourceUrl('assets/icons/areas-button.svg'));
    iconRegistry.addSvgIcon("tasks-button", sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tasks-button.svg'));
  }

  ngOnInit() {
  }

}
