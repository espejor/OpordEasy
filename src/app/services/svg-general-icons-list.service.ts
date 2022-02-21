import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FeatureForDeploing, ElementType } from '../models/feature-for-selector';
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
          control_point: {classCSS : "unSelected", selectorText : "Punto de Referencia",codeForDeploing:{type:"file", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,  attachable:true,extraData:{textFields:{unit:{selectorText:"Unidad",placeHolder:"Unidad",value:""},dateTime:{selectorText:"Fecha-Hora",placeHolder:"Fecha-Hora",value:""},info:{selectorText:"Información",placeHolder:"Informacíon",value:""}}, lists:{ type:{selectorText:"Tipo",placeHolder:"Tipo",value:"", list:"referencePoints"}},numbers:{num:{selectorText:"Número",placeHolder:"0",value:"",offset:[14,-20]}}}, file:{file:"assets/icons/points/command/control_point.svg",scale:0.5, anchor:[0.5,0.8]}}},
          contact_point: {classCSS : "unSelected", selectorText : "Punto de Contacto", codeForDeploing:{type:"path", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, attachable:true,extraData:{numbers:{num:{selectorText:"Número",placeHolder:"0",value:""}}}, d:{friendly:"m20,4 h40 v40 h-40z"}}},
          decision_point: {classCSS : "unSelected", selectorText : "Punto de Decisión", codeForDeploing:{type:"file", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, attachable:true,extraData:{numbers:{num:{selectorText:"Número",placeHolder:"0",value:""}}},file:{file:"assets/icons/points/command/decision_point.svg",scale:0.5, anchor:[0.5,0.45]}}},
          coordination_point: {classCSS : "unSelected", selectorText : "Punto de Coordinación", codeForDeploing:{type:"file", x:this.x, y:this.y, fill:"#E8E8CE", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, attachable:true, file:{file:"assets/icons/points/command/coordination_point.svg",scale:0.5, anchor:[0.5,0.45]}}},
          waypoint: {classCSS : "unSelected", selectorText : "Punto de Recorrido", codeForDeploing:{type:"file", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, attachable:true,extraData:{numbers:{num:{selectorText:"Número",placeHolder:"0",value:"",offset:[10,0]}}},file:{file:"assets/icons/points/command/waypoint.svg",scale:0.5, anchor:[0.5,0.5]}}},
          point_of_interest: {classCSS : "unSelected", selectorText : "Punto de Interés", codeForDeploing:{type:"file", x:this.x, y:this.y, fill:"#E8E8CE", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, attachable:true,extraData:{numbers:{num:{selectorText:"Número",placeHolder:"0",value:"",offset:[0,-20]}}}, file:{file:"assets/icons/points/command/point_of_interest.svg",scale:0.5, anchor:[0.5,0.8]}}},
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
          area_operations: {classCSS : "unSelected", selectorText : "Area de Operaciones",codeForDeploing:{type:"class",file:"command/area_operations", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"",typeArea:"",lineVisible:true,extraData:{textFields:{name:{selectorText:"Nombre",placeHolder:"Nombre",value:""}},lists:{ type:{selectorText:"Tipo de Área",placeHolder:"Tipo de Área",value:"", list:"areasForCommand"}}}}},
        }
      },
      maneuver:{
        text: "Maniobra",
        selector:{
          assembly_area: {classCSS : "unSelected", selectorText : "Zonas para la Maniobra",codeForDeploing:{type:"class",file:"maneuver/assembly_area", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,lineVisible:true,extraData:{textFields:{name:{selectorText:"Nombre",placeHolder:"Nombre",value:""}},lists:{ type:{selectorText:"Tipo de Área",placeHolder:"Tipo de Área",value:"", list:"areasForManoeuvre"}}}}},
          // drop_zone: {classCSS : "unSelected", selectorText : "Zona de Lanzamiento",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"ECHO",typeArea:"DZ",lineVisible:true}},
          fortified_area: {classCSS : "unSelected", selectorText : "Zona Fortificada",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,typeArea:"Zona Fortificada",lineVisible:false,pattern:{pattern:"assets/patterns/fortified_area.svg",gap:0,wide:20,anchor:[1,1]},extraData:{textFields:{name:{selectorText:"Nombre",placeHolder:"Nombre",value:""}}}}},
          battle_position: {classCSS : "unSelected", selectorText : "Posición defensiva",codeForDeploing:{type:"class",file:"maneuver/battle_position", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"",typeArea:"Posición defensiva",lineVisible:true,svgWidth:2,extraData:{textFields:{name:{selectorText:"Nombre",placeHolder:"Nombre",value:""}},lists:{echelon:{selectorText:"Escalon",placeHolder:"Escalón",value:"", list:"echelons"}}}}},
          strong_point: {classCSS : "unSelected", selectorText : "Punto Fuerte",codeForDeploing:{type:"class",file:"maneuver/strong_point", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"",typeArea:"Punto Fuerte",lineVisible:true,svgWidth:2,pattern:{pattern:"assets/patterns/strong_point.svg",gap:0,wide:20,anchor:[0,0]},extraData:{textFields:{name:{selectorText:"Nombre",placeHolder:"Nombre",value:""}},lists:{echelon:{selectorText:"Escalon",placeHolder:"Escalón",value:"", list:"echelons"}}}}},
        
        }
      },
      fires:{
        text: "Fuegos",
        selector:{
          fires_area: {classCSS : "unSelected", selectorText : "Zonas de Fuego",codeForDeploing:{type:"class",file:"fires/fires_area", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,name:"ALFA",typeArea:"AA",lineVisible:true,extraData:{textFields:{name:{selectorText:"Nombre",placeHolder:"Nombre",value:""},initDateTime:{selectorText:"Fecha-Hora Inicio Activación",placeHolder:"Fecha-Hora Inicio Activación",value:""},finalDateTime:{selectorText:"Fecha-Hora Fin Activación",placeHolder:"Fecha-Hora Fin Activación",value:""},info:{selectorText:"Información Adicional",placeHolder:"Información Adicional",value:""}},lists:{ type:{selectorText:"Tipo de Área",placeHolder:"Tipo de Área",value:"", list:"areasForFires"}}}}},
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
          boundary: {classCSS : "unSelected", selectorText : "Límites",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,file:"command/boundary",name:"",typeLine:"",typeEntity:"Límites", lineVisible:true,svgWidth:1,extraData: {lists:{echelon:{selectorText:"Escalon",placeHolder:"Escalón",value:"", list:"echelons"}}}}},
          light_line: {classCSS : "unSelected", selectorText : "Línea de iluminación reducida",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,file:"command/light_line",name:"",typeLine:"PL",lineVisible:true}},
        }
      },
      maneuver:{
        text: "Maniobra",
        selector:{
          friendly_present: {classCSS : "unSelected", selectorText : "Presencia Fuerzas Propias",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,file:"maneuver/friendly_present",name:"",typeLine:"",lineVisible:false,pattern:{pattern:"assets/patterns/friendly_present.svg",gap:0,wide:20,anchor:[1,1]}}},
          phase_line: {classCSS : "unSelected", selectorText : "Línea de coordinación",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,file:"maneuver/phase_line",name:"",typeLine:"PL",lineVisible:true,extraData:{textFields:{name:{selectorText:"Nombre",placeHolder:"Nombre",value:""},initDateTime:{selectorText:"Fecha-Hora Inicio Activación",placeHolder:"Fecha-Hora Inicio Activación",value:""},finalDateTime:{selectorText:"Fecha-Hora Fin Activación",placeHolder:"Fecha-Hora Fin Activación",value:""},coordination:{selectorText:"Coordinación",placeHolder:"Coordinación",value:""}}, lists:{ purpose:{selectorText:"Finalidad",placeHolder:"Línea de Coordinación",value:"", list:"phaseLines"}}}}},
          feba: {classCSS : "unSelected", selectorText : "FEBA",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,file:"maneuver/feba",name:"",typeLine:"FEBA",lineVisible:true}},

        }
      },
      fires:{
        text: "Fuegos",
        selector:{
          rfl: {classCSS : "unSelected", selectorText : "Línea de Fuegos Restringido",codeForDeploing:{type:"class", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,file:"fires/rfl",name:"RED",typeLine:"PL",purpose:"RFL", lineVisible:true}},

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

  constructor(public override iconRegistry?: MatIconRegistry, public override sanitizer?: DomSanitizer) { 
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
