
export class FeatureForSelector {
  [x: string]: any;
  public selectorText:string;
  public classCSS?:string = "selector"
  public svg:{
    type: string,
    x: string,
    y:string,
    fill:string
    stroke:string,
    strokeWidth:string,
    d?:{
      friendly:string,
      enemy?:string,
      unknown?:string,
      neutral?:string
    }
    text?:string
    font?:string,
    font_Family?:string
  }
}
