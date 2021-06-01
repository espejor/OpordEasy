import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.css']
})
export class FloatingMenuComponent implements OnInit {
  @Output() emitter = new EventEmitter();
  activatedOperations = false;
  constructor() { }

  ngOnInit() {
  }


changeView(){
  this.activatedOperations = !this.activatedOperations
  const data = this.activatedOperations?"activated":"deactivated"
  this.emitter.emit(data);
  console.log("-------------PINCHANDO" , this.activatedOperations)
}

}
