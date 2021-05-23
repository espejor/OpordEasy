import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Operation } from 'src/app/models/operation';
import { OperationsService } from 'src/app/services/operations.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

  selectedOperation: Operation = new Operation();
  operations;

  public toggleOptions = [
    {
      'value':'left',
      'icon': "circle"
    },
    {
      'value':'center',
      'icon':'circle'
    },
    {
      'value':'right',
      'icon':'circle'
    },
    {
      'value':'justify',
      'icon':'circle' 
    }
  ];

  constructor(public operationsService: OperationsService,private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer, private _snackBar: MatSnackBar) {
      iconRegistry.addSvgIcon('circle', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/circle24.svg'));

    }
 
    addOperation(form:NgForm){
      this.operationsService.updateOperation(this.operationsService.selectedOperation)
      .subscribe(res => {
        console.log(res)
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
      this.operationsService.selectedOperation = new Operation;
    }

  ngOnInit(): void {
    this.operationsService.operations = this.getOperations();
  }

  getOperations(): any {
    this.operationsService.getOperations()
    .subscribe(res => {
      console.log(res);
      this.operationsService.operations = <Operation[]>res;
      return res;
    });
  }


}