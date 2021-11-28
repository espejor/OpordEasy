import { extend } from "ol/extent";

export class FeatureForDeploing {
  [x: string]: any;
  public selectorText:string;
  public classCSS?:string = "unSelected"
  public codeForDeploing?:SVGPathForPoint | SVGPathForPoint[] | propertiesForLine;
  // public svg_composed?:;
}

export class FeatureComposed extends FeatureForDeploing{
}

export class propertiesForDeploing{
    type: string;
    x: string;
    y:string;
    fill:string;
    stroke:string;
    strokeWidth:string;
    text?:string;
    font?:string;
    font_Family?:string;
}
export class SVGPathForPoint extends propertiesForDeploing{
    d?:{
      friendly:string;
      enemy?:string
      unknown?:string;
      neutral?:string;
    }
}

export class SVGText extends propertiesForDeploing{
  text:string
}

export class propertiesForLine extends propertiesForDeploing{
  name: string = "Name of Line";
  type: string = "Type of Line"; 
}

export class TextFeatureForDeploing extends FeatureForDeploing{
  value:string
  public svg:SVGText
}
