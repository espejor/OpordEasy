export enum entityType {
    unit,
    point,
    pointOfLabel,
    controlPoint,
    line,
    arrow,
    axis,
    area,
    task
}
export class EntityStakedOrder{
    order = {
        area: 0,
        line : 1,
        pointOfLabel : 2,
        point : 3,
        unit : 4
    }
    getOrder(type:string){
        return this.order[type]
    }
}