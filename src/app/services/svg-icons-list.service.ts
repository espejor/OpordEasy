import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { EntityUnit } from '../entities/entity-unit';
import { Entity } from '../entities/entity.class';
import { ElementType, SVGPathForPoint, TextSVGOptions } from '../models/feature-for-selector';

@Injectable({
  providedIn: 'root'
})
export class SvgIconsListService {

  listOfEchelons:ElementType[] = [
    {icon:"squad-item",text:"Escuadra",value:"squad"},
    {icon:"section-item",text:"Pelotón",value:"section"},
    {icon:"platoon-item",text:"Sección",value:"platoon"},
    {icon:"company-item",text:"Compañía",value:"company"}
    //...
  ]

  

  listOfReferencePoints:ElementType[] = [
    {text:"Punto de Control",value:"CHK"},
    {text:"Punto de Amnistía",value:"AMN"},
    {text:"Punto de Encuentro",value:"LU"},
    {text:"Punto de Paso",value:"PP"},
    {text:"Punto de Reunión",value:"RLY"},
    {text:"Punto de Dislocación",value:"RP"},
    {text:"Punto de Inicial",value:"SP"},
  ]

  listOfPhaseLines:ElementType[] = [
    {text:"Línea de Iluminación Reducida",value:"LL"},
    {text:"Línea de Coordinación",value:""},
    {text:"Línea de Contención",value:"HL"},
    {text:"Línea de Cambio de Responsabilidad",value:"RL"},
    {text:"Línea de Coordinación Final",value:"FCL"},
    {text:"Límite de avance",value:"LOA"},
    {text:"Línea de Partida",value:"LD"},
    {text:"Línea de Partida/Línea de Contacto",value:"LD/LC"},
    {text:"Línea Probable de Despliegue",value:"PLD"}
  ]

  listOfAreasForCommand:ElementType[] = [
    {text:"Área de Operaciones",value:"OA"},
    {text:"Área de Interés Identificada",value:"NAI"},
    {text:"Área de Interés de Objetivos",value:"TAI"}
  ]

  listOfAreasForManoeuvre:ElementType[] = [
  
    {text:"Área Propia",value:""},
    {text:"Zona de Reunión",value:"AA"},
    {text:"Zona de Lanzamiento",value:"DZ"},
    {text:"Zona de Lanzamiento a baja altura",value:"EZ"},
    {text:"Zona de Aterrizaje",value:"LZ"},
    {text:"Zona de Recogida",value:"PZ"},
    {text:"Zona de Fuego sobre los Objetivos",value:"EA"},
    {text:"Posición de Asalto",value:"ASLT"},
    {text:"Posición de Partida",value:"ATK"},
    {text:"Objetivo",value:"OBJ"}
  ]

  listOfAreasForFires:ElementType[] = [
  
    {text:"Zona de Fuego Libre",value:"FFA"},
    {text:"Zona de Fuego Prohibido",value:"NFA"},
    {text:"Zona de Fuego Restringido",value:"RFA"},
    {text:"Pantalla de Humo",value:"SMOKE"},
    {text:"Zona de Lanzamiento de Bombas",value:"BOMB"},
    {text:"Zona de Apoyos de Fuego",value:"FSA"}
  ]



  
  lists = {
    echelons:this.listOfEchelons, 
    "referencePoints":this.listOfReferencePoints,
    "phaseLines":this.listOfPhaseLines,
    "areasForCommand":this.listOfAreasForCommand,
    "areasForFires":this.listOfAreasForFires,
    "areasForManoeuvre":this.listOfAreasForManoeuvre,
  }



  protected x = "80";
  protected y = "70";
  protected iconX = "90";
  protected iconY = "35";
  protected generalStrokeColor = "black"
  protected generalStrokeWidth = "2"
  protected readonly TRANSPARENT = "#00000001"


  constructor(public iconRegistry?: MatIconRegistry, public sanitizer?: DomSanitizer) { 
    if(iconRegistry && sanitizer){
      for(let echelon of this.listOfEchelons){
        iconRegistry.addSvgIcon(echelon.icon, sanitizer.bypassSecurityTrustResourceUrl('assets/icons/echelons/' + echelon.icon + '.svg'));
      }
    }
  }
    
  getList(listType:string):ElementType[] {
    return this.lists[listType]
  }

  public createSVG(collection,scale:number = 1):string{
    const x = 260 * scale;
    const y = 120 * scale;
    var svg = "<svg   viewBox='0 0 260 140' width= '"+ x + "' height= '" + y + "' version='1.1' xmlns='http://www.w3.org/2000/svg'>";
    svg += this.compoundSVG(collection,collection.frame?collection.frame.key:undefined);
    return svg += "</svg>";
  }

  public createSVGForTimeline(entity:Entity,scale:number = 1):string{
    const collection:any = entity.entityOptions
    const frame = collection.frame?collection.frame.key:undefined
    const x = 100 * scale;
    const y = 100 * scale;
    this.iconX = "10";
    this.iconY = "20";
    var svg = "<svg   viewBox='0 0 100 110' width= '"+ x + "' height= '" + y + "' version='1.1' xmlns='http://www.w3.org/2000/svg'>";
    svg += this.compoundSVG(collection,frame);
    const ident = entity.getIdent()
    if (ident)
      svg += '<text font-size="18" y="100" x="50" text-anchor="middle" stroke-width="1" stroke="#000" fill="#000000">' + ident + '</text>'
    return svg += "</svg>";
  }

  createSVGForTimeLineFromFile (file: string, type: {type:string,offset:number[]}, designation: {designation:string,offset:number[]}): string {
    designation.offset[1] = type.type == " "?designation.offset[1] +20:designation.offset[1] 
    return '<div style="height: 50px;"><img src="' + file + 
            '" style="vertical-align: top;width: 50px"><br>'+
            '<p style="font-size: 8px;position: relative;top: ' + type.offset[1] + 'px;left:' + type.offset[0] +'px;text-align: center;font-weight: bold;">'+
            type.type +
            '</p>' + 
            '<p style="font-size: 8px;position: relative;top: ' + designation.offset[1] + 'px;left:' + designation.offset[0] +'px;text-align: center;font-weight: bold;">'+
            designation.designation +
            '</p></div>'
  }
  
  protected  compoundSVG(collection,frameCollection?:string):string{
    var svg:string = " ";
    const frame = frameCollection
    if(Array.isArray(collection)){
      collection.forEach(svgItem => {
        svg += this.writeSVGContent(svgItem,frame);
      });
    }else{
      svg += this.writeSVGContent(collection,frame);
    }
    return svg;
  }

      
  protected writeSVGContent(feature: SVGPathForPoint | TextSVGOptions,frameCollection:string):string {
    const frame = frameCollection? frameCollection:"friendly" 
    const type = feature.type;
    var svg:string="";
  
    if (type == "path"){
      const f = <SVGPathForPoint>feature
      svg += "<path ";
      // const draw = "m" + feature.value.codeForDeploing.x + "," + feature.value.codeForDeploing.y + (feature.value.codeForDeploing.d[this.getD(feature)]);
      // escribimos d=""
      svg += "d='M" + this.iconX + "," + this.iconY + f.d[frame] + "' ";
      // escribimos los atributos
      svg += "stroke-width = '" + f.strokeWidth + "' "
      svg += "stroke = '" + f.stroke + "' ";
      svg += "fill = '" + f.fill + "' ";
      svg += " />";
    }
    if (type == "text"){
      const f = <TextSVGOptions>feature
      const x:string = (parseInt(f.x)).toLocaleString()
      const y:string = (parseInt(f.y)).toLocaleString()
      svg += "<text ";
      svg += "x = '" + x;
      svg += "' y = '" + y + "'"; 

      svg += " style = 'font: 16px sans-serif; text-anchor: end' >"
      svg += f.text + "</text>"
      
    }
  
    return svg;
  }


  protected getD(type,frame):string{
    if(frame){
      return type.value.codeForDeploing.d[frame] != undefined? frame :"friendly"
    }
    return "friendly";
  }


  public createSVGForCard(entity: Entity,scale:number = 1): string {
  //   if(entity instanceof EntityUnit)
  //     return this.createSVGForTimeline(entity,scale);
  //   else{
        return entity.getHTMLCodeForIconTimeline() 
    // }  
    // return null
  }

  // createSVGFromFileForTimeline(entity: Entity, scale: number): string {
  //   throw new Error('Method not implemented.');
  // }

  getTypeFromShortType(value:string,list:string):string{
    const actualList = this.lists[list] 
    return actualList.filter(e => {
      if (e.value == value)
        return e
      return undefined
    })[0].text
  }

}
