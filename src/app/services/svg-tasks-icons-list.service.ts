import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ConstraintType, Direction, ReferenceType, TypeShape, CPosition, TypeOffset, Operation } from '../entities/entity-multipoint.class';
import { FeatureForDeploing } from '../models/feature-for-selector';
import { SvgIconsListService } from './svg-icons-list.service';

@Injectable({
  providedIn: 'root'
})
export class SvgTasksIconsListService extends SvgIconsListService {

  public features:{ tasks:{text:string,selector: {[key: string]:FeatureForDeploing}}} = {
    tasks:{
        text:"Cometidos Tácticos",
        selector:{
          // Points
          arrest: {classCSS : "unSelected", selectorText : "Arrestar", codeForDeploing:{typeTask:"point", verbose: "Arrestar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,type:"file",file:{file:"assets/icons/tasks/arrest.svg", scale:1/3}}},
          destroy: {classCSS : "unSelected", selectorText : "Destruir", codeForDeploing:{typeTask:"point", verbose: "Destruir", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,type:"file",file:{file:"assets/icons/tasks/destroy.svg", scale:1/3}}},
          neutralize: {classCSS : "unSelected", selectorText : "Neutralizar", codeForDeploing:{typeTask:"point", verbose: "Neutralizar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,type:"file",file:{file:"assets/icons/tasks/neutralize.svg", scale:1/2}}},
          interdict: {classCSS : "unSelected", selectorText : "Interdicción", codeForDeploing:{typeTask:"point", verbose: "Interdicción", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,type:"file",file:{file:"assets/icons/tasks/interdict.svg", scale:1}}},
          suppress: {classCSS : "unSelected", selectorText : "Suprimir", codeForDeploing:{typeTask:"point", verbose: "Suprimir", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth,type:"file",file:{file:"assets/icons/tasks/suppress.svg", scale:1/2}}},
          // Lines
          attack: {classCSS : "unSelected", selectorText : "Ataque", codeForDeploing:{typeTask:"axis", verbose: "Ataque", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/attack.svg", scale:1/3}}},
          follow_and_support: {classCSS : "unSelected", selectorText : "Seguir y Apoyar", codeForDeploing:{typeTask:"arrow", verbose: "Seguir y Apoyar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/follow_and_support.svg", scale:1/3}, lineVisible:true, tailSource:"assets/icons/arrow_tail.svg",tipSource:"assets/icons/up-arrow.svg"}},
          follow_and_assume: {classCSS : "unSelected", selectorText : "Seguir y Asumir", codeForDeploing:{typeTask:"arrow", verbose: "Seguir y Asumir", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/follow_and_assume.svg", scale:1/3}, lineVisible:true, tailSource:"assets/icons/label_tail.svg",tipSource:"assets/icons/double_arrow.svg", stroke_dasharray:[5,5]}},
          // Shapes
          attack_by_fire: {classCSS : "unSelected", selectorText : "Ataque por el fuego", codeForDeploing:{typeTask:"multipoint", verbose:"Ataque por el fuego", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/attack_by_fire.svg", scale:1/3}, options:{numPoints:3,edges:[{shape:{type:TypeShape.STICKLINE,angle:Math.PI/4,direction:Direction.LEFT}, initAnchor:{order:3}, finalAnchor:{order:1}},{shape:{type:TypeShape.STICKLINE,angle:Math.PI/4,direction:Direction.RIGHT}, initAnchor:{order:3}, finalAnchor:{order:2}},{shape:{type:TypeShape.LINE}, initAnchor:{order:3}, finalAnchor:{order:0},}],points:[{order:0,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}},{order:1},{order:2},{order:3,reference:{referenceType:ReferenceType.MIDDLE,referencesPoints:[1,2]}}]}}},
          support_by_fire: {classCSS : "unSelected", selectorText : "Apoyo por el fuego", codeForDeploing:{typeTask:"multipoint", verbose:"Apoyar por el fuego", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/support_by_fire.svg", scale:1/3}, options:{
            numPoints:4,
            edges:[{
              shape:{
                type:
                TypeShape.STICKLINE,
                angle:Math.PI/4,
                direction:Direction.LEFT
              },
              initAnchor:{
                order:4
              }, 
              finalAnchor:{
                order:1
              }
            },
            {
              shape:{
                type:TypeShape.STICKLINE,
                angle:Math.PI/4,
                direction:Direction.RIGHT
              }, 
              initAnchor:{
                order:4
              }, 
              finalAnchor:{
                order:2
              }
            },
            {
              shape:{
                type:TypeShape.LINE
              }, 
              initAnchor:{order:1}, 
              finalAnchor:{order:0}
            },
            {
              shape:{
                type:TypeShape.LINE
              }, 
              initAnchor:{order:2}, 
              finalAnchor:{order:3}
            }
          ],
            
            points:[{
              order:0,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}
            },{
              order:1
            },{
              order:2
            },{
              order:3,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}
            },{
              order:4,reference:{referenceType:ReferenceType.MIDDLE,referencesPoints:[1,2]}
            }
            ]
          }}},
          block: {classCSS : "unSelected", selectorText : "Bloquear", codeForDeploing:{typeTask:"multipoint", x:this.x, y:this.y, verbose: "Bloquear", fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/block.svg", scale:1/3}, options:{numPoints:3,mainConstraints:[{constraintType:ConstraintType.ISOSCELES,referencesPoints:[0,1,2]}],edges:[{shape:{type:TypeShape.LINE}, initAnchor:{order:0}, finalAnchor:{order:1}},{shape:{type:TypeShape.LINE}, text: {text:"B",position:CPosition.CENTER}, initAnchor:{order:2}, finalAnchor:{order:3},}],points:[{order:0},{order:1},{order:2},{order:3,reference:{referenceType:ReferenceType.MIDDLE,referencesPoints:[0,1]}}]}}},
          breach: {classCSS : "unSelected", selectorText : "Brecha", codeForDeploing:{typeTask:"multipoint", verbose: "Brecha", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/breach.svg", scale:1/3}, options:{numPoints:3,mainConstraints:[{constraintType:ConstraintType.ISOSCELES,referencesPoints:[0,1,2]}],edges:[{shape:{type:TypeShape.LINE}, initAnchor:{order:0}, finalAnchor:{order:3}},{shape:{type:TypeShape.LINE}, initAnchor:{order:1}, finalAnchor:{order:4}},{shape:{type:TypeShape.LINE}, initAnchor:{order:4}, finalAnchor:{order:3},text:{text:"B",position:CPosition.CENTER}}],points:[{order:0,tip:{src:"assets/icons/tips/tilt_line_left.svg",ubication:CPosition.START}},{order:1,tip:{src:"assets/icons/tips/tilt_line_right.svg",ubication:CPosition.START}},{order:2},{order:3,reference:{referenceType:ReferenceType.LEFT_PERPENDICULAR,referencesPoints:[1,0,0,2]}},{order:4,reference:{referenceType:ReferenceType.RIGHT_PERPENDICULAR,referencesPoints:[0,1,1,2]}}]}}},
          bypass: {classCSS : "unSelected", selectorText : "Desbordar", codeForDeploing:{typeTask:"multipoint", verbose: "Desbordar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/bypass.svg", scale:1/3}, options:{numPoints:3,mainConstraints:[{constraintType:ConstraintType.ISOSCELES,referencesPoints:[0,1,2]}],edges:[{shape:{type:TypeShape.LINE}, initAnchor:{order:0}, finalAnchor:{order:3}},{shape:{type:TypeShape.LINE}, initAnchor:{order:1}, finalAnchor:{order:4}},{shape:{type:TypeShape.LINE}, initAnchor:{order:4}, finalAnchor:{order:3},text:{text:"B",position:CPosition.CENTER}}],points:[{order:0,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.START,anchor:[0.5,0.2]}},{order:1,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.START,anchor:[0.5,0.2]}},{order:2},{order:3,reference:{referenceType:ReferenceType.LEFT_PERPENDICULAR,referencesPoints:[1,0,0,2]}},{order:4,reference:{referenceType:ReferenceType.RIGHT_PERPENDICULAR,referencesPoints:[0,1,1,2]}}]}}},
          canalize: {classCSS : "unSelected", selectorText : "Canalizar", codeForDeploing:{typeTask:"multipoint", verbose: "Canalizar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/canalize.svg", scale:1/3}, options:{numPoints:3,mainConstraints:[{constraintType:ConstraintType.ISOSCELES,referencesPoints:[0,1,2]}],edges:[{shape:{type:TypeShape.LINE}, initAnchor:{order:0}, finalAnchor:{order:3}},{shape:{type:TypeShape.LINE}, initAnchor:{order:1}, finalAnchor:{order:4}},{shape:{type:TypeShape.LINE}, initAnchor:{order:4}, finalAnchor:{order:3},text:{text:"C",position:CPosition.CENTER}}],points:[{order:0,tip:{src:"assets/icons/tips/tilt_line_right.svg",ubication:CPosition.START}},{order:1,tip:{src:"assets/icons/tips/tilt_line_left.svg",ubication:CPosition.START}},{order:2},{order:3,reference:{referenceType:ReferenceType.LEFT_PERPENDICULAR,referencesPoints:[1,0,0,2]}},{order:4,reference:{referenceType:ReferenceType.RIGHT_PERPENDICULAR,referencesPoints:[0,1,1,2]}}]}}},
          penetrate: {classCSS : "unSelected", selectorText : "Penetrar", codeForDeploing:{typeTask:"multipoint", verbose: "Penetrar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/penetrate.svg", scale:1/3}, options:{numPoints:3,mainConstraints:[{constraintType:ConstraintType.ISOSCELES,referencesPoints:[0,1,2]}],edges:[{shape:{type:TypeShape.LINE}, initAnchor:{order:0}, finalAnchor:{order:1}},{shape:{type:TypeShape.LINE}, initAnchor:{order:2}, finalAnchor:{order:3},}],points:[{order:0},{order:1},{order:2},{order:3,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0]}, reference:{referenceType:ReferenceType.MIDDLE,referencesPoints:[0,1]}}]}}},
          
          cover: {classCSS : "unSelected", selectorText : "Cubrir", codeForDeploing:{typeTask:"multipoint", verbose: "Cubrir", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/cover.svg", scale:1/3}, options:{numPoints:3,edges:[{shape:{type:TypeShape.RAY,direction:Direction.LEFT}, initAnchor:{order:1}, finalAnchor:{order:0},text:{text:"C",position:CPosition.START}},{shape:{type:TypeShape.RAY,direction:Direction.RIGHT}, initAnchor:{order:1}, finalAnchor:{order:2},text:{text:"C",position:CPosition.START}}],points:[{order:0,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}},{order: 1},{order:2,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}}]}}},
          
          
         
          
          contain: {classCSS : "unSelected", selectorText : "Contener", codeForDeploing:{typeTask:"circle", verbose: "Contener", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/contain.svg", scale:1/3}, pattern:{pattern:"assets/patterns/strong_point.svg",gap:0,wide:10,anchor:[0.5,0]}, options:{center:{},radius:0,arc:Math.PI}}},
          secure: {classCSS : "unSelected", selectorText : "Asegurar", codeForDeploing:{typeTask:"circle", verbose: "Asegurar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/secure.svg", scale:1/3}, options:{center:{},radius:0,arc:7*Math.PI/4,text:{text:"S",position:CPosition.CENTER},tips:[{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.START,anchor:[0.5,0.2]}]}}},
          locate: {classCSS : "unSelected", selectorText : "Localizar", codeForDeploing:{typeTask:"circle", verbose: "Localizar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/locate.svg", scale:1/3}, options:{center:{},radius:0,arc:7*Math.PI/4,text:{text:"LOC",position:CPosition.CENTER},tips:[{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.START,anchor:[0.5,0.2]},{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}]}}},
          control: {classCSS : "unSelected", selectorText : "Controlar", codeForDeploing:{typeTask:"circle", verbose: "Controlar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/control.svg", scale:1/3}, options:{center:{},radius:0,arc:7*Math.PI/4,text:{text:"C",position:CPosition.CENTER},tips:[{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.START,anchor:[0.5,0.2]},{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}]}}},
            
          delay: {classCSS : "unSelected", selectorText : "Retardar", codeForDeploing:{typeTask:"multipoint", verbose: "Retardar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/delay.svg", scale:1/3}, options:{numPoints:3,mainConstraints:[{constraintType:ConstraintType.RIGHT_TRIANGLE,referencesPoints:[0,1,2]}],edges:[{shape:{type:TypeShape.LINE}, initAnchor:{order:1}, finalAnchor:{order:0}},{shape:{type:TypeShape.ARC,angle:Math.PI,direction:Direction.LEFT}, initAnchor:{order:1}, finalAnchor:{order:2}}],points:[{order:0,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}},{order:1},{order:2}]}}},
          demostrate: {classCSS : "unSelected", selectorText : "Demostración", codeForDeploing:{typeTask:"multipoint", verbose: "Demostración", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/demostrate.svg", scale:1/3}, options:{numPoints:3,mainConstraints:[{constraintType:ConstraintType.RIGHT_TRIANGLE,referencesPoints:[0,1,2]}],edges:[{shape:{type:TypeShape.LINE}, initAnchor:{order:1}, finalAnchor:{order:0},text:{text:"DEM",position:CPosition.CENTER,rotation:Math.PI}},{shape:{type:TypeShape.ARC,angle:Math.PI,direction:Direction.LEFT}, initAnchor:{order:1}, finalAnchor:{order:2}},{shape:{type:TypeShape.LINE},initAnchor:{order:2},finalAnchor:{order:3}}],points:[{order:0,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}},{order:1},{order:2},{order:3,reference:{referenceType:ReferenceType.LEFT_PERPENDICULAR,referencesPoints:[2,1,2,0]}}]}}},
          
          recover: {classCSS : "unSelected", selectorText : "Recuperar", codeForDeploing:{typeTask:"multipoint", verbose: "Recuperar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/recover.svg", scale:1/3}, options:{numPoints:3,edges:[{shape:{type:TypeShape.ARC,angle:Math.PI/2,direction:Direction.RIGHT}, initAnchor:{order:0}, finalAnchor:{order:2},text:{text:"R",position:CPosition.CENTER}}],points:[{order:0,tip:{src:"assets/icons/tips/circle.svg",ubication:CPosition.START,anchor:[0.5,0.5]}},{order:1},{order:2,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}}]}}},
          
          infiltrate: {classCSS : "unSelected", selectorText : "Infiltrar", codeForDeploing:{typeTask:"multipoint", verbose: "Infiltrar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/infiltrate.svg", scale:1/3}, options:{numPoints:3,mainConstraints:[{constraintType:ConstraintType.IN_LINE,referencesPoints:[0,1,2]},{constraintType:ConstraintType.EQUAL,referencesPoints:[1,2,1,0]}],edges:[{text:{text:"IN",position:CPosition.CENTER},shape:{type:TypeShape.LINE}, initAnchor:{order:0}, finalAnchor:{order:3}},{shape:{type:TypeShape.ARC,angle:Math.PI/2,direction:Direction.RIGHT}, initAnchor:{order:3}, finalAnchor:{order:1}},{shape:{type:TypeShape.ARC,angle:Math.PI/2,direction:Direction.LEFT}, initAnchor:{order:1}, finalAnchor:{order:4}},{shape:{type:TypeShape.LINE}, initAnchor:{order:4}, finalAnchor:{order:2}}],points:[{order:0},{order:1}, {order:2,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}},{order:3,reference:{referenceType:ReferenceType.OFFSET,referencesPoints:[0,1,0],offset:{typeOffset:TypeOffset.POLAR, angle:Math.PI/18,distance:{referenceType:ReferenceType.PROPORTIONAL,proportion:{operation:Operation.MULT,referencePoints:[0,1],proportion:0.811}}}}},{order:4,reference:{referenceType:ReferenceType.OFFSET,referencesPoints:[2,1,2],offset:{typeOffset:TypeOffset.POLAR, angle:Math.PI/18,distance:{referenceType:ReferenceType.PROPORTIONAL,proportion:{operation:Operation.MULT,referencePoints:[0,1],proportion:0.811}}}}}]}}},
          exfiltrate: {classCSS : "unSelected", selectorText : "Exfiltrar", codeForDeploing:{typeTask:"multipoint", verbose: "Exfiltrar", x:this.x, y:this.y, fill:this.TRANSPARENT, stroke:this.generalStrokeColor, strokeWidth:this.generalStrokeWidth, file:{file:"assets/icons/tasks/exfiltrate.svg", scale:1/3}, options:{numPoints:3,mainConstraints:[{constraintType:ConstraintType.IN_LINE,referencesPoints:[0,1,2]},{constraintType:ConstraintType.EQUAL,referencesPoints:[1,2,1,0]}],edges:[{text:{text:"EX",position:CPosition.CENTER,rotation:Math.PI},shape:{type:TypeShape.LINE}, initAnchor:{order:0}, finalAnchor:{order:3}},{shape:{type:TypeShape.ARC,angle:Math.PI/2,direction:Direction.RIGHT}, initAnchor:{order:3}, finalAnchor:{order:1}},{shape:{type:TypeShape.ARC,angle:Math.PI/2,direction:Direction.LEFT}, initAnchor:{order:1}, finalAnchor:{order:4}},{shape:{type:TypeShape.LINE}, initAnchor:{order:4}, finalAnchor:{order:2}}],points:[{order:0},{order:1}, {order:2,tip:{src:"assets/icons/tips/up-arrow.svg",ubication:CPosition.END,anchor:[0.5,0.2]}},{order:3,reference:{referenceType:ReferenceType.OFFSET,referencesPoints:[0,1,0],offset:{typeOffset:TypeOffset.POLAR, angle:Math.PI/18,distance:{referenceType:ReferenceType.PROPORTIONAL,proportion:{operation:Operation.MULT,referencePoints:[0,1],proportion:0.811}}}}},{order:4,reference:{referenceType:ReferenceType.OFFSET,referencesPoints:[2,1,2],offset:{typeOffset:TypeOffset.POLAR, angle:Math.PI/18,distance:{referenceType:ReferenceType.PROPORTIONAL,proportion:{operation:Operation.MULT,referencePoints:[0,1],proportion:0.811}}}}}]}}},
            
        }
    }
  }

  constructor(public iconRegistry?: MatIconRegistry, public sanitizer?: DomSanitizer) { 
    super()
    // this.updateIconTemplate();
    if(iconRegistry && sanitizer){
      for(let option in this.features.tasks.selector){
        iconRegistry.addSvgIcon(option, sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tasks/' + option + '.svg'));
      }
    }
  }

}
