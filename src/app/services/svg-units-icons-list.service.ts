import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FeatureForSelector, SVGPath, TextFeatureForSelector } from '../models/feature-for-selector';
import { SvgIconsListService } from './svg-icons-list.service';

@Injectable({
  providedIn: 'root'
})
export class SVGUnitsIconsListService extends SvgIconsListService{
  // public UNIT_RESULT = "<svg width='80' height='60' version='1.1' xmlns='http://www.w3.org/2000/svg'>";
  
  public features:{[key: string]: {[key: string]: FeatureForSelector | TextFeatureForSelector}} = {
    frame: {  
      friendly: {classCSS : "unSelected", selectorText : "Aliados", svg:{type:"path", x:this.x, y:this.y, fill:"#88E0FF", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m0,0 h80v60h-80z"}}},
      enemy: {classCSS : "unSelected", selectorText : "Enemigo",  svg:{type:"path", x:this.x, y:this.y, fill:"#ff8888", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,0 l30,30 l-30,30 l-30,-30 z"}}},      
      neutral: {classCSS : "unSelected", selectorText : "Neutral",  svg:{type:"path", x:this.x, y:this.y, fill:"#AAFFAA", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m10,0 h60v60h-60z"}}},
      unknown: {classCSS : "unSelected", selectorText : "Desconocido",  svg:{type:"path", x:this.x, y:this.y, fill:"#ffffe0", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m25,15 a15,15 0 0 1 30,0a15,15 0 0 1 0,30a15,15 0 0 1 -30,0a15,15 0 0 1 0,-30"}}},
    },
    main: {
      infantry: {classCSS : "unSelected", selectorText: "Infantería",  svg:{type:"path", x:this.x, y:this.y, fill:"", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m0,0l80,60m0,-60l-80,60",enemy:"m25,15l30,30m0,-30l-30,30",neutral:"m10,0l60,60m0,-60l-60,60",unknown:"m25,15l30,30m0,-30l-30,30"}}},
      artillery: {classCSS : "unSelected", selectorText: "Artillería",  svg:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m35,30 a5,5 0 1 0 0,-1z"}}},
      cavalry: {classCSS : "unSelected", selectorText: "Caballería",  svg:{type:"path", x:this.x, y:this.y, fill:"", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m80,0l-80,60",enemy:"m55,15l-30,30",neutral:"m70,0l-60,60",unknown:"m55,15l-30,30"}}},
      armoured: {classCSS : "unSelected", selectorText: "Ac/Mz",  svg:{type:"path", x:this.x, y:this.y, fill:"transparent", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m25,20 h30 a10,10 0 0 1 0,20 h-30 a10,10 0 0 1 0,-20",enemy:"m30,20 h20 a10,10 0 0 1 0,20 h-20 a10,10 0 0 1 0,-20",neutral:"m30,20 h20 a10,10 0 0 1 0,20 h-20 a10,10 0 0 1 0,-20",unknown:"m30,20 h20 a10,10 0 0 1 0,20 h-20 a10,10 0 0 1 0,-20"}}}
    },
    level: {
      squad: {classCSS : "unSelected", selectorText: "Escuadra",  svg:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m37,-10a3,3 0 1 0 0,-1z"}}},
      section: {classCSS : "unSelected", selectorText: "Pelotón",  svg:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m31,-10a3,3 0 1 0 0,-1z m12,0a3,3 0 1 0 0,-1z"}}},
      platoon: {classCSS : "unSelected", selectorText: "Sección",  svg:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m25,-10a3,3 0 1 0 0,-1z m12,0a3,3 0 1 0 0,-1z m12,0a3,3 0 1 0 0,-1z"}}},
      company: {classCSS : "unSelected", selectorText: "Compañía",  svg:{type:"path", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, d:{friendly:"m40,-0 v-10"}}},
    },
    
    //-----------------------
    // FALTAN FEATURES DE UNIDADES
    // ----------------------
    sectionAdd: {
      designation:{selectorText: "Designación",value:"León",svg:{type:"text", x:this.x, y:this.y, fill:"black", stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth}}
    }
  }


  constructor(private iconRegistry?: MatIconRegistry, private sanitizer?: DomSanitizer) {
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

    
  protected  compoundSVG(collection):string{
    var svg:string = " ";
    const frame = collection.frame
    
    for(let element in collection) {
      if (Array.isArray(collection[element])) {
        svg += this.compoundSVG(collection[element]);
      }
      else{
        if (collection[element] != null)
          svg += this.writeSVGContent(collection[element],frame);
      }
    };

    return svg;
  }


  protected writeSVGContent(feature,frame:string):string {
    const type = feature.value.svg.type;
    var svg:string="";
  
    if (type == "path"){
      svg += "<path ";
      // const draw = "m" + feature.value.svg.x + "," + feature.value.svg.y + (feature.value.svg.d[this.getD(feature)]);
      // escribimos d=""
      svg += "d='M" + this.iconX + "," + this.iconY + feature.value.svg.d[this.getD(feature,frame)] + "' ";
      // escribimos los atributos
      svg += "stroke-width = '" + feature.value.svg.strokeWidth + "' "
      svg += "stroke = '" + feature.value.svg.stroke + "' ";
      svg += "fill = '" + feature.value.svg.fill + "' ";
      svg += " />";
    }
  
    return svg;
  }




}

