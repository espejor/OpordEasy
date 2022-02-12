import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Operation } from 'src/app/models/operation';
import { OperationsService } from 'src/app/services/operations.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SvgIconsListService } from 'src/app/services/svg-icons-list.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit,AfterViewInit {
  selectedOperation: Operation = new Operation();
  operations;
  timelines = [];

  constructor(public operationsService: OperationsService,
    private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer, 
    private _snackBar: MatSnackBar,
    private svgService: SvgIconsListService) {
      iconRegistry.addSvgIcon('circle', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/circle24.svg'));
  }

  addOperation(form:NgForm){
    this.operationsService.updateOperation(this.operationsService.selectedOperation)
    .subscribe(res => {
      console.log(res)
      this.operationsService.selectedOperation = new Operation(this.svgService,res);
      // this.resetForm(form);
      if(res){      
        this.getOperations();  
        this._snackBar.open('Operación guardada', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  resetForm(form:NgForm){
    form.reset();
    this.operationsService.selectedOperation = new Operation();
  }

  ngOnInit(): void {
    this.getOperations();
  }

  ngAfterViewInit():void{
  }

  getOperations(): any {
    this.operationsService.getOperations()
    .subscribe(res => {
      console.log(res);
      this.operationsService.operations = this.recoverOperations(res);
      return res;
    });
  }

  deleteOperation(form:NgForm){
    const snackRef = this._snackBar.open(
      "¿Está seguro que quiere eliminar la Operación activa?",
      "Eliminar",
      {
        duration:5000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    snackRef.onAction().subscribe(() =>{
        this.operationsService.deleteOperation(this.operationsService.selectedOperation._id)
        .subscribe(result =>{
          this._snackBar.open(`Se ha eliminado Operación activa`,"",{duration:3000})
          console.log(result);
          this.resetForm(form)
          this.ngOnInit()
          // this.operationsService.operations = this.recoverOperations(result);
          return result;
        })
    })
  }

  recoverOperations(jsonOperations): Operation[] {
    const operations:Operation[] = [] 
    for(let i = 0; i < jsonOperations.length; i++){
      operations.push(new Operation(this.svgService,jsonOperations[i]))
    }
    return operations
  }




}