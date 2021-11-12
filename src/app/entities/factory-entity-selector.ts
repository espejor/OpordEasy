import { entityType } from "./entitiesType";
import { EntityFactory } from "./factory-entity";
import { LineFactory } from "./factory-line";
import { PointFactory } from "./factory-point";
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
    
      default:
        throw new Error("No existe ese tipo de Entidad");
    }
  }
}