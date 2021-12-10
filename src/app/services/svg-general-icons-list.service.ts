import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FeatureForDeploing } from '../models/feature-for-selector';
import { SvgIconsListService } from './svg-icons-list.service';

@Injectable({
  providedIn: 'root'
})
export class SvgGeneralIconsListService extends SvgIconsListService {

  public features:{[key: string]:{ [key: string]:{text:string,selector: {[key: string]:FeatureForDeploing}}}} = {
    points:{
      command:{
        text:"Mando",
        selector:{
          control_point: {classCSS : "unSelected", selectorText : "Punto de Control",codeForDeploing:{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, attachable:true, d:{friendly:"m25,-25 h30 v35 h-30 z m0,35 l15,15 l15,-15"}}},
          contact_point: {classCSS : "unSelected", selectorText : "Punto de Contacto", codeForDeploing:{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, attachable:true, d:{friendly:"m20,4 h40 v40 h-40z"}}},
          coordination_point: {classCSS : "unSelected", selectorText : "Punto de Coordinación", codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"#E8E8CE", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, attachable:true, d:{friendly:"m40,4a20,20 0 1 0 1,0z m-13,6l28,28m-28,0l28,-28"}}},
        }
      },
      obs:{
        text:"Observatorios",
        selector:{
          obs: {classCSS : "unSelected", selectorText : "Observatorio", codeForDeploing:{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,-1 l23,40  h-46z"}}},
          recon_point: {classCSS : "unSelected", selectorText : "Punto de Recon.", codeForDeploing:{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,-1 l23,40  h-46z m-23,40 l34,-20"}}},
          frw_obs: {classCSS : "unSelected", selectorText : "Observatorio avanzado", codeForDeploing:[{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,-1 l23,40  h-46z m-23,40 l34,-20"}},
                                                                                                   {type:"path", x:this.x, y:this.y, fill:"000000", stroke:this.generalStrokeColor, strokeWidth:"1", d:{friendly:"m40,20 a6,6 0 1 0 1,0z"}}]},
          cbrn_obs: {classCSS : "unSelected", selectorText : "Observatorio CBRN", codeForDeploing:[{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,-1 l23,40  h-46z m-23,40 l34,-20  m-18,0 a10,16 0 0 1 10,16 m4,-16 a10,16 0 0 0 -8,16"}},
                                                                                                {type:"path", x:this.x, y:this.y, fill:"000000", stroke:this.generalStrokeColor, strokeWidth:"1", d:{friendly:"m33,15.5 a2,3 0 1 0 1,0z m14,0 a2,3 0 1 0 1,0z"}}]},
          sensor_post: {classCSS : "unSelected", selectorText : "Puesto de escucha", codeForDeploing:[{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,-1 l23,40  h-46z"}},
                                                                                                   {type:"path", x:this.x, y:this.y, fill:"000000", stroke:this.generalStrokeColor, strokeWidth:"1", d:{friendly:"m30,25 a10,10 0 0 1 10,10 a10,10 0 0 1 10,-10 a10,10 0 0 1 -10,-10 a10,10 0 0 1 -10,10z"}}]},
          combat_post: {classCSS : "unSelected", selectorText : "Puesto avanzado de combate", codeForDeploing:{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,-1 l23,40  h-46zm2.3,4 l8,-4.6m-5.7,8.6 l8,-4.6m-5.7,8.6 l8,-4.6m-5.7,8.6 l8,-4.6m-5.7,8.6 l8,-4.6m-5.7,8.6 l8,-4.6m-5.7,8.6 l8,-4.6m-5.7,8.6 l8,-4.6m-5.7,8.6 l8,-4.6m-8,8.6 v10m-4,-10 v10m-4,-10 v10m-4,-10 v10m-4,-10 v10m-4,-10 v10m-4,-10 v10m-4,-10 v10m-4,-10 v10m-4,-10 v10m-4,-10 v10m-2,-12.6 l-8,-4.6m10.3,0.6 l-8,-4.6m10.3,0.6 l-8,-4.6m10.3,0.6 l-8,-4.6m10.3,0.6 l-8,-4.6m10.3,0.6 l-8,-4.6m10.3,0.6 l-8,-4.6m10.3,0.6 l-8,-4.6m10.3,0.6 l-8,-4.6"}}},
        }
      },
      fires:{
        text:"Fuegos",
        selector:{
        }

      },
      logistic:{
        text:"Logística",
        selector:{
        }

      }
    },
    areas:{
      command:{
        text: "Mando",
        selector:{

        }
      },
      maneuver:{
        text: "Maniobra",
        selector:{
          occupied_assembly: {classCSS : "unSelected", selectorText : "Zona de reunión ocupada",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"ALFA",typeLine:"AA",lineVisible:true}},


        }
      },
      fires:{
        text: "Fuegos",
        selector:{

        }
      },
      logistic:{
        text: "Logística",
        selector:{

        }
      },
      intelligence:{
        text: "Inteligencia",
        selector:{

        }
      }

    },
    lines:{
      command:{
        text: "Mando",
        selector:{
          boundary: {classCSS : "unSelected", selectorText : "Límites",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"",typeLine:"",lineVisible:true,echelon:"assets/icons/echelons/platoon.svg",svgWidth:1  }},
          light_line: {classCSS : "unSelected", selectorText : "Línea de iluminación reducida",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"NOMBRE",typeLine:"LL",lineVisible:true}},
        }
      },
      maneuver:{
        text: "Maniobra",
        selector:{
          friendly_present: {classCSS : "unSelected", selectorText : "Presencia Fuerzas Propias",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"",typeLine:"",lineVisible:false,pattern:"assets/icons/patterns/friendly_present.svg"}},
          phase_line: {classCSS : "unSelected", selectorText : "Línea de coordinación",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"NOMBRE",typeLine:"PL",lineVisible:true}},
          feba: {classCSS : "unSelected", selectorText : "FEBA",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"",typeLine:"FEBA",lineVisible:true}},

        }
      },
      fires:{
        text: "Fuegos",
        selector:{
          rfl: {classCSS : "unSelected", selectorText : "Línea de Fuegos Restringido",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"RED",typeLine:"PL",purpose:"RFL", lineVisible:true}},

        }
      },
      logistic:{
        text: "Logística",
        selector:{

        }
      },
      intelligence:{
        text: "Inteligencia",
        selector:{

        }
      }

    },
    tasks:{

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
