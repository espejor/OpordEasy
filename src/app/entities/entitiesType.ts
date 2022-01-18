export enum entityType {
    unit,
    point,
    pointOfLabel,
    controlPoint,
    line,
    arrow,
    axis,
    area,
    task,
    multipoint,
    circle
}

export function getEntityType(type:string):entityType{
    return entityType[type]
}

export class EntityStakedOrder{
    order = {
        area: 0,
        line : 1,
        multipoint: 2,
        circle: 3,
        pointOfLabel : 4,
        point : 5,
        unit : 6
    }
    getOrder(type:string){
        return this.order[type]
    }
}