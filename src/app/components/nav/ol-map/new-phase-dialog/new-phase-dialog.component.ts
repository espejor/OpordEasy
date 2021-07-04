import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpenModalService } from 'src/app/services/open-modal.service';

@Component({
  selector: 'app-new-phase-dialog',
  templateUrl: './new-phase-dialog.component.html',
  styleUrls: ['./new-phase-dialog.component.css']
})
export class NewPhaseDialogComponent implements OnInit {

  keepLayout:boolean;
  name:string = ""
  constructor(public dialogRef: MatDialogRef<NewPhaseDialogComponent>) { }

  public onChange(keep:boolean){
    this.keepLayout = keep;
  }

  newPhase(){
    this.dialogRef.close({
      "action":"newPhase",
      "keepLayout":this.keepLayout,
      "name": this.name
    });

  }

  cancel(){
    this.dialogRef.close({"action":"close"});
  }

  ngOnInit(): void {
  }

}

