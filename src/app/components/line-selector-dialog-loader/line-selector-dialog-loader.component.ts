import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpenModalService } from 'src/app/services/open-modal.service';
import { LineSelectorComponent } from '../line-selector/line-selector.component';

@Component({
  template: ''
})
export class LineSelectorDialogLoaderComponent implements OnInit {
  dialogRef;

  constructor(
    public dialog: MatDialog,
    private openModalService:OpenModalService
    ) {
    this.openModalService.openDialog(LineSelectorComponent,"60%","75%");  
  }

  ngOnInit(): void {
  }

}
