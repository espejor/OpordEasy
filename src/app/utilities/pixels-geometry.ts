import { Pixel } from "ol/pixel";

export function distanceBetweenPixels(from:Pixel,to:Pixel): number{
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];

    return Math.sqrt(dx*dx +dy*dy);
}
export function angleBetweenPixels(from:Pixel,to:Pixel): number{
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    return Math.atan2(dy, dx);
}

export function offsetFromPixel(pixel:Pixel,distance:number,angle:number):Pixel{
    return [pixel[0] + (Math.cos(angle) * distance),pixel[1] + (Math.sin(angle) * distance)]
}
