import { entityType } from "./entitiesType";
import { EntityFactory } from "./factory-entity";
import { UnitFactory } from "./factory-unit";

export class EntitySelector{
  static getFactory (entityCode:entityType):EntityFactory{
    switch (entityCode) {
      case entityType.unit:
        return new UnitFactory()
        break;
    
      default:
        throw new Error("No existe ese tipo de Entidad");
        break;
    }
  }
}