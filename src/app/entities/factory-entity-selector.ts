import { entityType } from "./entitiesType";
import { AreaFactory } from "./factory-area";
import { ArrowFactory } from "./factory-arrow";
import { AxisFactory } from "./factory-axis";
import { CircleFactory } from "./factory-circle";
import { EntityFactory } from "./factory-entity";
import { LineFactory } from "./factory-line";
import { MultiPointFactory } from "./factory-multipoint";
import { PointFactory } from "./factory-point";
// import { TaskFactory } from "./factory-task";
import { UnitFactory } from "./factory-unit";

export class EntitySelector{
  static getFactory (entityCode:entityType):EntityFactory{
    switch (entityCode) {
      case entityType.unit:
        return new UnitFactory()
        
      case entityType.point:
        return new PointFactory()
    
      case entityType.line:
          return new LineFactory()
  
      case entityType.area:
        return new AreaFactory()

      // case entityType.task:
      //   return new TaskFactory()

      case entityType.arrow:
        return new ArrowFactory()    

      case entityType.axis:
        return new AxisFactory()    

      case entityType.multipoint:
        return new MultiPointFactory()    

      case entityType.circle:
        return new CircleFactory()
          
      default:
        throw new Error("No existe ese tipo de Entidad");
    }
  }
}