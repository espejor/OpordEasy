import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FeatureForSelector } from '../models/feature-for-selector';
import { SvgIconsListService } from './svg-icons-list.service';

@Injectable({
  providedIn: 'root'
})
export class SvgTasksIconsListService extends SvgIconsListService {

  public features:{ [key: string]:{text:string,selector: {[key: string]:FeatureForSelector}}} = {
    tasks:{
        text:"Cometidos Tácticos",
        selector:{
          control_point: {classCSS : "unSelected", selectorText : "Punto de Control", svg:{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m25,25 l30,0 l0,35 l-30,0 l0,-35 z m0,35 l15,15 l15,-15"}}},
          contact_point: {classCSS : "unSelected", selectorText : "Punto de Contacto", svg:{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m20,4 h40 v40 h-40z"}}},
          coordination_point: {classCSS : "unSelected", selectorText : "Punto de Coordinación", svg:{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,4a20,20 0 1 0 1,0z m-13,6l28,28m-28,0l28,-28"}}},
      }
    }
  }


  constructor(private iconRegistry?: MatIconRegistry, private sanitizer?: DomSanitizer) { 
    super()
    // this.updateIconTemplate();
    if(iconRegistry && sanitizer){
      for(let section in this.features){
        for(let group in this.features[section]){
          for(let option in this.features[section][group].selector){
            iconRegistry.addSvgIcon(option, sanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + section + '/' + group + '/' + option + '.svg'));
          }
        }
      }
    }
  }

}
