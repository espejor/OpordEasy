import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FeatureForDeploing, ListField, TextFeatureForDeploing, TextField, TextSVGOptions } from '../models/feature-for-selector';
import { SvgIconsListService } from './svg-icons-list.service';

@Injectable({
  providedIn: 'root'
})
export class SVGUnitsIconsListService extends SvgIconsListService{
  // public UNIT_RESULT = "<svg width='80' height='60' version='1.1' xmlns='http://www.w3.org/2000/svg'>";
  
  public features:{[key: string]: {[key: string]: FeatureForDeploing | TextFeatureForDeploing }  | UnitExtraOptions} = {
    frame: {  
      friendly: {classCSS : "unSelected", selectorText : "Aliados", codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"#88E0FF", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m0,0 h80v60h-80z"}}},
      enemy: {classCSS : "unSelected", selectorText : "Enemigo",  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"#ff8888", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,0 l30,30 l-30,30 l-30,-30 z"}}},      
      neutral: {classCSS : "unSelected", selectorText : "Neutral",  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"#AAFFAA", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m10,0 h60v60h-60z"}}},
      unknown: {classCSS : "unSelected", selectorText : "Desconocido",  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"#ffffe0", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m25,15 a15,15 0 0 1 30,0a15,15 0 0 1 0,30a15,15 0 0 1 -30,0a15,15 0 0 1 0,-30"}}},
    },
    main: {
      infantry: {classCSS : "unSelected", selectorText: "Infantería", combatFunction:"combat",  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m0,0l80,60m0,-60l-80,60",enemy:"m25,15l30,30m0,-30l-30,30",neutral:"m10,0l60,60m0,-60l-60,60",unknown:"m25,15l30,30m0,-30l-30,30"}}},
      artillery: {classCSS : "unSelected", selectorText: "Artillería", combatFunction:"support",   codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m35,30 a5,5 0 1 0 0,-1z"}}},
      cavalry: {classCSS : "unSelected", selectorText: "Caballería", combatFunction:"combat",   codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m80,0l-80,60",enemy:"m55,15l-30,30",neutral:"m70,0l-60,60",unknown:"m55,15l-30,30"}}},
      armoured: {classCSS : "unSelected", selectorText: "Ac/Mz",  combatFunction:"combat",  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"transparent", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m25,20 h30 a10,10 0 0 1 0,20 h-30 a10,10 0 0 1 0,-20",enemy:"m30,20 h20 a10,10 0 0 1 0,20 h-20 a10,10 0 0 1 0,-20",neutral:"m30,20 h20 a10,10 0 0 1 0,20 h-20 a10,10 0 0 1 0,-20",unknown:"m30,20 h20 a10,10 0 0 1 0,20 h-20 a10,10 0 0 1 0,-20"}}}
    },
    level: {
      squad: {classCSS : "unSelected", selectorText: "Escuadra",  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m37,-10a3,3 0 1 0 0,-1z"}}},
      section: {classCSS : "unSelected", selectorText: "Pelotón",  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m31,-10a3,3 0 1 0 0,-1z m12,0a3,3 0 1 0 0,-1z"}}},
      platoon: {classCSS : "unSelected", selectorText: "Sección",  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m25,-10a3,3 0 1 0 0,-1z m12,0a3,3 0 1 0 0,-1z m12,0a3,3 0 1 0 0,-1z"}}},
      company: {classCSS : "unSelected", selectorText: "Compañía", alternatesVerbose:[{group:"main",option:"artillery",value:"Batería"},{group:"main",option:"cavalry",value:"Escuadrón"}],  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,-0 v-10"}}},
    },
    sector1:{
      missile:{classCSS : "unSelected", selectorText: "Misiles",  codeForDeploing:{type:"path", x:this.x, y:this.y, fill:"none", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,20l0,-18m-5,18l0,-13a5,5 1 1 1 10,0l0,13"}}}

    },
    
    //-----------------------
    // FALTAN FEATURES DE UNIDADES
    // ----------------------
    // extraData: {
    //   designation:{selectorText: "Designación",codeForDeploing:{type:"text",x:"75",y:"125",visible:true}},
    //   heighterUnit:{selectorText: "Unidad Superior",codeForDeploing:{type:"text",x:"165",y:"70",visible:true}},
    //   typeEquipment:{selectorText: "Tipo de Equipo",codeForDeploing:{type:"text",x:"75",y:"105"}},
    //   dateTime:{selectorText: "Fecha-Hora",codeForDeploing:{type:"text",x:"75",y:"65"}}
    // }

    extraData:{
      fields:{  
        textFields:{
          designation:{selectorText:"Designación", placeHolder:"Designación", value:"", x:75, y:125, offset:[-20,12] ,visible:true, indent:"end"},
          heighterunit:{selectorText:"GU. Superior", placeHolder:"GU. Superior", value:"", x:165, y:125 , indent:"start"},
          typeEquipment:{selectorText:"Equipamiento", placeHolder:"Equipamiento", value:"", x:75, y:105 , indent:"end" },
          dateTime:{selectorText:"Fecha-Hora", placeHolder:"Fecha-Hora", value:"", x:75, y:65 , indent:"end" }
        }
      }
    }
  }


  constructor(public iconRegistry?: MatIconRegistry, public sanitizer?: DomSanitizer) {
    super();
    // this.updateIconTemplate();
    if(iconRegistry && sanitizer){
      for(let group in this.features){
        for(let option in this.features[group]){
          iconRegistry.addSvgIcon(option, sanitizer.bypassSecurityTrustResourceUrl('assets/icons/units/' + group + '/' + option + '.svg'));
        }
      } 
    }
  }

    
  protected  compoundSVG(collection,frameCollection):string{
    var svg:string = " ";
    const frame = frameCollection;
    
    for(let element in collection) {
      if(element != "attachable"){
        if(element == "extraData"){
          // for(let data in collection[element].fields.textFields)
          //   svg += this.writeUnitExtraData(collection[element].fields.textFields[data]);
          // for(let data in collection[element].fields.check)
          //   svg += this.writeUnitExtraData(collection[element].fields.check[data]);
        }else{
          if (Array.isArray(collection[element])) {
            svg += this.compoundSVG(collection[element],frame);
          }
          else{
            if (collection[element] != null){
              svg += this.writeSVGContent(collection[element],frame);
            }
          }
        }
      }
    };

    return svg;
  }

  writeUnitExtraData(textField: any):string {
    var svg:string="";
    const f = <TextField>textField
    const indent = f.indent?f.indent:"end"
    const style = "font: 20px sans-serif; text-anchor: " + indent
    if(f.visible){
      const x:string = (f.x+10).toLocaleString()
      const y:string = (f.y-30).toLocaleString()
      svg += "<text ";
      svg += "x = '" + x;
      svg += "' y = '" + y + "'"; 

      svg += " style = '" + style + "' >"
      svg += f.value + "</text>"
    }
    return svg
  }


  protected writeSVGContent(feature,frame:string):string {
    const type = feature.value.codeForDeploing.type;

    var svg:string="";
    if (type == "path"){
      svg += "<path ";
      // const draw = "m" + feature.value.codeForDeploing.x + "," + feature.value.codeForDeploing.y + (feature.value.codeForDeploing.d[this.getD(feature)]);
      // escribimos d=""
      svg += "d='M" + this.iconX + "," + this.iconY + feature.value.codeForDeploing.d[this.getD(feature,frame)] + "' ";
      // escribimos los atributos
      svg += "stroke-width = '" + feature.value.codeForDeploing.strokeWidth + "' "
      svg += "stroke = '" + feature.value.codeForDeploing.stroke + "' ";
      svg += "fill = '" + feature.value.codeForDeploing.fill + "' ";
      svg += " />";
    }
    if (type == "text"){
      const f = <TextSVGOptions>feature.value.codeForDeploing
      const indent = f.indent?f.indent:"end"
      const style = "font: 20px sans-serif; text-anchor: " + indent
      if(f.visible){
        const x:string = (parseInt(f.x)+10).toLocaleString()
        const y:string = (parseInt(f.y)-30).toLocaleString()
        svg += "<text ";
        svg += "x = '" + x;
        svg += "' y = '" + y + "'"; 

        svg += " style = '" + style + "' >"
        svg += f.text + "</text>"
      }
    }
  
    return svg;
  }
}

export interface UnitExtraOptions extends FeatureForDeploing{
  // selectorText?:string,
  // classCSS?:string,
  numbers?:{num?:TextField},
  textFields?:{designation?:TextField,heighterunit?:TextField,dateTime?:TextField,typeEquipment?:TextField},
  lists?:{type?:ListField},
  check?:{reinforced?:TextField}
}