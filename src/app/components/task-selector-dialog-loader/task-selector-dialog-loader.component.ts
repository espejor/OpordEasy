import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpenModalService } from 'src/app/services/open-modal.service';
import { TaskSelectorComponent } from '../task-selector/task-selector.component';

@Component({
  template: ''
})
export class TaskSelectorDialogLoaderComponent implements OnInit {
  dialogRef;

  constructor(
    public dialog: MatDialog,
    private openModalService:OpenModalService
  ){
    this.openModalService.openDialog(TaskSelectorComponent,"60%","75%"); 
   }

  ngOnInit(): void {
  }

}
