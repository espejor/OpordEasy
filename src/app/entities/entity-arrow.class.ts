import { Feature } from "ol";
import { LineString } from "ol/geom";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { entityType } from "./entitiesType";
import { EntityLine } from "./entity-line.class";
import { TaskOptions } from "./entity-task.class";

export class EntityArrow<GeomType extends Geometry = Geometry> extends EntityLine{
  tipStyle: Style;
  tailStyle: Style;
  constructor(taskOptions:TaskOptions,opt_geometryOrProperties?: GeomType | { [key: string]: any },id?) {
    super(taskOptions,opt_geometryOrProperties,id);
    this.entityType = entityType.arrow
    const entity = this
    this.tipStyle = this.getTipStyle()
    this.tailStyle = this.getTailStyle()

    var stylesFunction = function(feature:Feature<Geometry>){
      const styles: Style[] = []
      styles.push(entity.tipStyle)
      styles.push(entity.tailStyle)
      if(taskOptions.echelon)
        styles.push(...entity.configureCentralIcon(feature,taskOptions.echelon,taskOptions.svgWidth));
      // styles.push(entity.startTextStyle);
      // styles.push(entity.endTextStyle);
      if (taskOptions. lineVisible)
        styles.push(entity.lineStyle);
      if(taskOptions.pattern)
        styles.push(...entity.createPattern(feature));
      if(taskOptions.purpose){
        styles.push(entity.purposeEndStyle);
        styles.push(entity.purposeStartStyle);
      }
      return styles
    }
    if(taskOptions){
        this.styles = stylesFunction;
        this.setStyle(this.styles)
    }
  }

  override getHTMLCodeForIconTimeline(): string {
      const file = this.file.file
      return '<div style="height: 50px;"><img src="' + file + 
      '" style="vertical-align: top;width: 50px"></div>'
  }

  public getTipStyle():Style{    
    var tipSource = (<TaskOptions>this.entityOptions).tipSource
    var arrowStyle = new Style({
      geometry: function(feature){
        const location = (<LineString>feature.getGeometry()).getFirstCoordinate()
        const point = new Point(location)
        const end = new Point((<LineString>feature.getGeometry()).getFirstCoordinate());
        const start = new Point((<EntityLine>feature).getCoordinates()[1]);
        const rotation = (<EntityLine>feature).getOrientation(end, start);
        (<EntityArrow>feature).tipStyle.getImage().setRotation(-(rotation + Math.PI/2));
        return point;
      },
      image: new Icon({
        anchor: [0.5,0.2],
        opacity: 1,
        src: tipSource,
        rotateWithView: true
      })
    })
    return arrowStyle;
  }

  public getTailStyle():Style{    
    var tailSource = (<TaskOptions>this.entityOptions).tailSource
    var arrowStyle = new Style({
      geometry: function(feature){
        const location = (<LineString>feature.getGeometry()).getLastCoordinate()
        const point = new Point(location)
        const start = new Point((<LineString>feature.getGeometry()).getLastCoordinate());
        const length = (<LineString>feature.getGeometry()).getCoordinates().length
        const end = new Point((<LineString>feature.getGeometry()).getCoordinates()[length - 2]);
        const rotation = (<EntityLine>feature).getOrientation(end, start);
        (<EntityArrow>feature).tailStyle.getImage().setRotation(-(rotation + Math.PI/2));
        return point;
      },
      image: new Icon({
        anchor: [0.5,0],
        opacity: 1,
        src: tailSource,
        rotateWithView: true,
        scale:1
      })
    })
    return arrowStyle;
  }

}