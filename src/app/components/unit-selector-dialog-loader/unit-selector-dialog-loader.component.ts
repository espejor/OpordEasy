import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { OpenModalService } from 'src/app/services/open-modal.service';
import { UnitSelectorComponent } from '../unit-selector/unit-selector.component';

@Component({
  template: ''
})
export class UnitSelectorDialogLoaderComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private openModalService:OpenModalService) {
      
    this.openModalService.openDialog(UnitSelectorComponent,"600px"); 
  }
  
  ngOnInit(): void {
  }

}
