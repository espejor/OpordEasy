import { Component, Input, OnInit } from '@angular/core';
import { Pixel } from 'ol/pixel';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements OnInit {

  @Input() tooltipPixel:Pixel
  @Input() tooltipMeasure:string

  constructor() { }

  ngOnInit(): void {
  }

}
