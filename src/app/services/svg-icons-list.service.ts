import { Injectable } from '@angular/core';
import { Collection } from 'ol';
import { EntityOptions } from '../entities/entity.class';
import { FeatureForSelector, SVGPath } from '../models/feature-for-selector';

@Injectable({
  providedIn: 'root'
})
export class SvgIconsListService {
  protected x = "80";
  protected y = "70";
  protected iconX = "40";
  protected iconY = "35";
  protected generalStrokeColor = "black"
  protected generalStrokeWidth = "2"
  protected readonly TRANSPARENT = "#00000001"


  constructor() { }

    
  public createSVG(collection,scale:number = 1):string{
    const x = 160 * scale;
    const y = 120 * scale;
    var svg = "<svg   viewBox='0 0 160 120' width= '"+ x + "' height= '" + y + "' version='1.1' xmlns='http://www.w3.org/2000/svg'>";
    svg += this.compoundSVG(collection);
    return svg += "</svg>";
  }

  
  protected  compoundSVG(collection):string{
    var svg:string = " ";
    const frame = "friendly"
    if(collection.svg_composed){
      collection.svg_composed.forEach(svgItem => {
        svg += this.writeSVGContent(svgItem,frame);
      });
    }else{
      svg += this.writeSVGContent(collection.svg,frame);
    }
    return svg;
  }

      
  protected writeSVGContent(feature: SVGPath,frame:string):string {
    const type = feature.type;
    var svg:string="";
  
    if (type == "path"){
      svg += "<path ";
      // const draw = "m" + feature.value.svg.x + "," + feature.value.svg.y + (feature.value.svg.d[this.getD(feature)]);
      // escribimos d=""
      svg += "d='M" + this.iconX + "," + this.iconY + feature.d[frame] + "' ";
      // escribimos los atributos
      svg += "stroke-width = '" + feature.strokeWidth + "' "
      svg += "stroke = '" + feature.stroke + "' ";
      svg += "fill = '" + feature.fill + "' ";
      svg += " />";
    }
  
    return svg;
  }


  protected getD(type,frame):string{
    if(frame){
      return type.value.svg.d[frame.key] != undefined? frame.key :"friendly"
    }
    return "friendly";
  }


  public createSVGForCard(entityOptions: EntityOptions,scale:number = 1): string {
    return this.createSVG(entityOptions,scale);
  }


}
