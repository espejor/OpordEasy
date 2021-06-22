import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OpenModalService {
  dialogRef;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) {
  }

  public openDialog(component,width:string,height?:string): void{
    this.dialogRef = this.dialog.open(component, {
      width: width,
      height: height
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  receiveMessage($event){
    this.dialogRef.close();
  }

  closeDialog(){

  }

}
