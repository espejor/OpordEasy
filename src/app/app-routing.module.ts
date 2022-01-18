import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaSelectorDialogLoaderComponent } from './components/area-selector-dialog-loader/area-selector-dialog-loader.component';
import { LineSelectorDialogLoaderComponent } from './components/line-selector-dialog-loader/line-selector-dialog-loader.component';
import { NavComponent } from './components/nav/nav.component';
import { PointSelectorDialogLoaderComponent } from './components/point-selector-dialog-loader/point-selector-dialog-loader.component';
import { TaskSelectorDialogLoaderComponent } from './components/task-selector-dialog-loader/task-selector-dialog-loader.component';
import { UnitSelectorDialogLoaderComponent } from './components/unit-selector-dialog-loader/unit-selector-dialog-loader.component';

const routes: Routes = [
  {
    path:'',
    component: NavComponent,
    children: [{
      path:'Units',
      component: UnitSelectorDialogLoaderComponent
    },{
      path:'Points',
      component: PointSelectorDialogLoaderComponent
    },{
      path:'Lines',
      component: LineSelectorDialogLoaderComponent
    },{
      path:'Areas',
      component: AreaSelectorDialogLoaderComponent
    } 
    ,{
      path:'Tasks',
      component: TaskSelectorDialogLoaderComponent
    }
  ]
  },
  { 
    path: '**', // bonus: all routes not defined forward to /home
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { enableTracing: true } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
