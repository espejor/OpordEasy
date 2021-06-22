import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FeatureForSelector } from '../models/feature-for-selector';

@Injectable({
  providedIn: 'root'
})
export class SvgGeneralIconsListService {
  private x = "80";
  private y = "70";
  private iconX = "40";
  private iconY = "35";
  private generalStrokeColor = "black"
  private generalStrokeWidth = "2"

  public features:{[key: string]:{ [key: string]:{[key: string]: FeatureForSelector}}} = {
    points:{
      command:{
        control_point: {classCSS : "unSelected", selectorText : "Punto de Control", svg:{type:"path", x:this.x, y:this.y, fill:"#88E0FF", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m0,0 h80v60h-80z"}}},
      }
    },
    areas:{

    }

  }


  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { 
    // this.updateIconTemplate();
    for(let section in this.features){
      for(let group in this.features[section]){
        for(let option in this.features[section][group]){
          iconRegistry.addSvgIcon(option, sanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + section + '/' + group + '/' + option + '.svg'));
        }
      }
    }
  }
}
