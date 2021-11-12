import { extend } from "ol/extent";

export class FeatureForSelector {
  [x: string]: any;
  public selectorText:string;
  public classCSS?:string = "unSelected"
  public svg?:SVGPath;
  public svg_composed?:SVGPath[];
}

export class FeatureComposed extends FeatureForSelector{
}

export class SVG{
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
export class SVGPath extends SVG{
    d?:{
      friendly:string;
      enemy?:string
      unknown?:string;
      neutral?:string;
    }
}

export class SVGText extends SVG{
  text:string
}

export class TextFeatureForSelector extends FeatureForSelector{
  value:string
  public svg:SVGText
}
