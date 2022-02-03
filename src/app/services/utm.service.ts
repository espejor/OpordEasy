import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import * as proj4x from 'proj4';
import * as Proj from 'ol/proj';

@Injectable({
  providedIn: 'root'
})
export class UtmService {
  private proj4 = (proj4x as any).default;
  private converter;
  private zone:number;

  constructor() { 
    // this.proj4 = (proj4x as any).default;
  }

  forward(origin:Coordinate | Extent):Coordinate | Extent{
      if(origin.length == 2){// Coordinate
        // const originLatLon = Proj.toLonLat(origin);
        // this.zone = 1 + Math.floor((originLatLon[0] +180)/6);
        return this.translate(origin,"forward")
      }
      if(origin.length == 4){// Extent
        const center = [(origin[0] + origin[2]) / 2,(origin[1] + origin[3]) / 2]
        const centerLatLon = Proj.toLonLat(center);
        this.zone = 1 + Math.floor((centerLatLon[0] +180)/6);
        const extMin:Coordinate = this.translate(Proj.toLonLat([origin[0],origin[1]]));
        const extMax:Coordinate = this.translate(Proj.toLonLat([origin[2],origin[3]]));
        return extMin.concat(extMax);
      }
      throw new Error("Sólo se admiten Coordenadas o Extents");
  }

  inverse(origin:Coordinate | Extent):Coordinate | Extent{
      if(origin.length == 2){// Coordinate
        // const originLatLon = Proj.toLonLat(origin);
        // this.zone = 1 + Math.floor((originLatLon[0] +180)/6);
        return this.translate(origin,"inverse")// En formato Lonlat
      }
      if(origin.length == 4){// Extent
        const center = [(origin[0] + origin[2]) / 2,(origin[1] + origin[3]) / 2]
        const centerLatLon = Proj.toLonLat(center);
        this.zone = 1 + Math.floor((centerLatLon[0] +180)/6);
        const extMin:Coordinate = this.translate(Proj.toLonLat([origin[0],origin[1]]),"inverse");
        const extMax:Coordinate = this.translate(Proj.toLonLat([origin[2],origin[3]]),"inverse");
        return extMin.concat(extMax);
      }
      throw new Error("Sólo se admiten Coordenadas o Extents");
  }

  private translate(origin:Coordinate,direction:string = "forward" ): Coordinate{
        this.proj4.defs("UTM",`+proj=utm +zone=${this.zone} +ellps=WGS84 +datum=WGS84 +units=m +no_defs `);
        this.converter = this.proj4(
          'EPSG:4326',
          "UTM"
        );
        if (direction === "forward")
          return this.converter.forward(origin);
        else
          return this.converter.inverse(origin);

  }


}
