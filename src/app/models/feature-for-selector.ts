import { extend } from "ol/extent";
import { LineOptions } from "../entities/entity-line.class";
import { EntityOptions } from "../entities/entity.class";

export class FeatureForDeploing {
  [x: string]: any;
  public selectorText:string;
  public classCSS?:string = "unSelected"
  public codeForDeploing?:SVGPathForPoint | SVGPathForPoint[] | LineOptions;
  // public svg_composed?:;
}

export class FeatureComposed extends FeatureForDeploing{
}

export class PointOptions extends EntityOptions{
    type: string;
    x: string;
    y:string;
    fill:string;
    stroke:string;
    strokeWidth:string;
    text?:string;
    font?:string;
    font_Family?:string;
    attachable? = true
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
