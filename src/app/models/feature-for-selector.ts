import { extend } from "ol/extent";
import { AreaOptions } from "../entities/entity-area.class";
import { LineOptions } from "../entities/entity-line.class";
import { TaskOptions } from "../entities/entity-task.class";
import { EntityOptions } from "../entities/entity.class";

export class FeatureForDeploing {
  [x: string]: any;
  public selectorText?:string;
  public classCSS?:string = "unSelected"
  public codeForDeploing?:SVGPathForPoint | SVGPathForPoint[] | LineOptions | AreaOptions |TaskOptions | TextInUnitOptions;
  // public svg_composed?:;
}

export class FeatureComposed extends FeatureForDeploing{
}

export interface TextOptions{
  type: string;
  x: string;
  y:string;
  text?:string;
  visible?:boolean;
  indent?:"start"|"end"
}

export interface TextInUnitOptions extends EntityOptions{
  designation:TextOptions,
  heighterUnit:TextOptions,
  typeEquipment:TextOptions,
  dateTime:TextOptions,

  foSymbol?:ExtraDataSmbol
  cgSymbol?:ExtraDataSmbol
} 

export interface ExtraDataSmbol{
  active:boolean
}

export class PointOptions extends EntityOptions{
    type: string;
    x: string;
    y:string;
    visible?:boolean = false;
    fill?:string;
    stroke?:string;
    strokeWidth?:string;
    text?:string;
    font?:string;
    font_Family?:string;
    attachable? = true;
    file?:{
      file:string,
      scale:number
    }
}
export class SVGPathForPoint extends PointOptions{
    d?:{
      friendly:string;
      enemy?:string
      unknown?:string;
      neutral?:string;
    }
}

export class SVGText extends PointOptions{
  text:string
}

// export class PropertiesForLine extends PropertiesForDeploing{
//   name: string = "Name of Line";
//   typeLine: string = "Type of Line";
// }

export class TextFeatureForDeploing extends FeatureForDeploing{
  value:string
  public svg:SVGText
}
