export enum entityType {
    unit,
    point,
    pointOfLabel,
    controlPoint,
    line,
    arrow,
    axis,
    task
}
export class EntityStakedOrder{
    order = {
        line : 0,
        pointOfLabel : 1,
        point : 2,
        unit : 3
    }
    getOrder(type:string){
        return this.order[type]
    }
}