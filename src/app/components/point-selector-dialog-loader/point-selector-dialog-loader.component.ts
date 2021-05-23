import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpenModalService } from 'src/app/services/open-modal.service';
import { PointSelectorComponent } from '../point-selector/point-selector.component';

@Component({
  template: ''
})
export class PointSelectorDialogLoaderComponent implements OnInit {
  dialogRef;

  constructor(
    public dialog: MatDialog,
    private openModalService:OpenModalService
  ){
    this.openModalService.openDialog(PointSelectorComponent,"300px"); 
   }

  ngOnInit(): void {
  }

}
