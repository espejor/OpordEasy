import { Injectable } from '@angular/core';
import { Collection } from 'ol';
import { UnitOptions } from '../entities/entity-unit';
import { EntityOptions } from '../entities/entity.class';
import { FeatureForDeploing, SVGPathForPoint, TextInUnitOptions, TextOptions } from '../models/feature-for-selector';

@Injectable({
  providedIn: 'root'
})
export class SvgIconsListService {
  protected x = "80";
  protected y = "70";
  protected iconX = "90";
  protected iconY = "35";
  protected generalStrokeColor = "black"
  protected generalStrokeWidth = "2"
  protected readonly TRANSPARENT = "#00000001"


  constructor() { }

    
  public createSVG(collection,scale:number = 1):string{
    const x = 260 * scale;
    const y = 120 * scale;
    var svg = "<svg   viewBox='0 0 260 140' width= '"+ x + "' height= '" + y + "' version='1.1' xmlns='http://www.w3.org/2000/svg'>";
    svg += this.compoundSVG(collection,collection.frame);
    return svg += "</svg>";
  }

  
  protected  compoundSVG(collection,frameCollection:string):string{
    var svg:string = " ";
    const frame = "friendly"
    if(Array.isArray(collection)){
      collection.forEach(svgItem => {
        svg += this.writeSVGContent(svgItem,frame);
      });
    }else{
      svg += this.writeSVGContent(collection,frame);
    }
    return svg;
  }

      
  protected writeSVGContent(feature: SVGPathForPoint | TextOptions,frame:string):string {
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
      const f = <TextOptions>feature
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
      return type.value.codeForDeploing.d[frame.key] != undefined? frame.key :"friendly"
    }
    return "friendly";
  }


  public createSVGForCard(entityOptions: EntityOptions,scale:number = 1): string {
    if(entityOptions instanceof UnitOptions)
      return this.createSVG(entityOptions,scale);
    return null
  }


}
