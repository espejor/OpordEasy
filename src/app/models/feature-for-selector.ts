import { AreaOptions } from "../entities/entity-area.class";
import { Reference } from "../entities/entity-multipoint.class";
import { TaskOptions } from "../entities/entity-task.class";
import { EntityOptions, Pattern } from "../entities/entity.class";

export class FeatureForDeploing {
  [x: string]: any;
  public selectorText?:string;
  public alternatesVerbose?:AlternateVerbose[] 
  public classCSS?:string = "unSelected"
  public combatFunction?: CombatFunction
  public codeForDeploing?:SVGPathForPoint | SVGPathForPoint[] | LineOptions | AreaOptions |TaskOptions;
  // public svg_composed?:;
}

export type AlternateVerbose = AlternateVerboseInSVG | AlternateVerboseInProperty

export interface AlternateVerboseInProperty{
  property:string
  value:string
}

export interface AlternateVerboseInSVG{
  group:string,
  option:string,
  value:string
}

export class TextFeatureForDeploing extends FeatureForDeploing{
  value:string
  public svg:SVGText
}
export type CombatFunction = "combat" |"support"

export class FeatureComposed extends FeatureForDeploing{
}

export interface TextSVGOptions{
  type: string;
  x: string;
  y:string;
  text?:string;
  visible?:boolean;
  indent?:"start"|"end"
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
    extraData? :{ textFields?:{unit?:TextField,dateTime?:TextField,info?:TextField},
                  lists?:{type?:ListFieldString},
                  numbers?:{num?:TextField}} 
    
    file?:{
      file:string,
      scale:number,
      anchor?:[number,number]
    }
}

export class LineOptions extends EntityOptions{
  typeLine?:string; // LL, PL ...
  pattern?:Pattern;  // 
  lineVisible?: boolean; // Si la línea se ha de ver ()
  svgWidth?:number; 
  stroke_dasharray?:[number,number] = [0,0]
  extraData? :{ textFields?:{name?:TextField,initDateTime?:TextField,finalDateTime?:TextField,coordination?:TextField},
                lists?:{purpose?:ListFieldString,echelon?:ListFieldString},
                numbers?:{num?:TextField}} 
}


export interface ElementType{
  value:string,
  text:string,
  icon?:string
}

// export interface ElementWithIcon extends ElementType{
// }

// export interface ListFieldWithIcon extends TextField{
//   list: ElementWithIcon[]
// }
export interface ListField extends TextField{
  list:ElementType[]
} 

export interface ListFieldString extends TextField{
  list:string
}

export interface TextField{
  selectorText:string,
  placeHolder:string,
  value:string,
  x:number,
  y:number,
  offset?:[number,number],
  fontSize?:number,
  indent?:"start" | "end",
  visible?:boolean,
  position?:Reference
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

