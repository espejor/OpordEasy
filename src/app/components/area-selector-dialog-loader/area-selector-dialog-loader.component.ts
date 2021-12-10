import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpenModalService } from 'src/app/services/open-modal.service';
import { AreaSelectorComponent } from '../area-selector/area-selector.component';

@Component({
  template: ''
})
export class AreaSelectorDialogLoaderComponent implements OnInit {
  dialogRef;
  constructor(
    public dialog: MatDialog,
    private openModalService:OpenModalService) {

      this.openModalService.openDialog(AreaSelectorComponent,"60%","75%");  
   }

  ngOnInit() {
  }

}
