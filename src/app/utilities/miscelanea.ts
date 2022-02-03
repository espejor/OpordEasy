import { Collection } from "ol";
import { Geometry } from "ol/geom";
import { Entity } from "../entities/entity.class";

export function collectionToArray(collection)
{
	var ary = [];
	for(var i=0, len = collection.length; i < len; i++)
	{
		ary.push(collection[i]);
	}
	return ary;
}

export function findElement(collection:Collection<Entity<Geometry>>|Entity[],element, property?:{key:string,value:any}):number{
    const array = collection instanceof Collection?collection.getArray():collection
        
    return array.findIndex((e,i) => {
        if (property){
            return (e[property.key] == property.value)
                // return i
        }else{
             return (e == element)
                // return i
        }
    })
    // return -1
}