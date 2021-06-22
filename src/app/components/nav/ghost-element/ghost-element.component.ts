import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Geometry from 'ol/geom/Geometry';
import { Pixel } from 'ol/pixel';
import { Entity } from 'src/app/entities/entity.class';
import { SVGUnitsIconsListService } from 'src/app/services/svg-units-icons-list.service';
import {DragDropModule} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-ghost-element',
  templateUrl: './ghost-element.component.html',
  styleUrls: ['./ghost-element.component.css']
})
export class GhostElementComponent implements OnInit {
  @ViewChild ("ghostElement") ghostFeature:ElementRef;

  ghostElementStyle = {
    left : "100px",
    top : "100px"
  }
  isMovingCopyFeature: boolean;
  constructor(public svgService:SVGUnitsIconsListService) { 

  }

  ngOnInit() {
  }

  update(pixel: Pixel, entity: Entity<Geometry>) {
    this.ghostFeature.nativeElement.innerHTML = this.svgService.createSVG(entity.entityOptions,0.50);
    
    this.ghostElementStyle.left = pixel[0] - this.ghostFeature.nativeElement.offsetWidth / 2 + "px";
    this.ghostElementStyle.top =  pixel[1] - this.ghostFeature.nativeElement.offsetHeight/ 2 + "px";
  }

  movingPointer(evt){
    if (this.isMovingCopyFeature){
      this.ghostElementStyle.left = evt.clientX;
      this.ghostElementStyle.top = evt.clientY;
      // this.renderer.
      // this.ghostFeature.nativeElement.
    }
}

}
