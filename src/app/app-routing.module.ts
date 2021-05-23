import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { PointSelectorDialogLoaderComponent } from './components/point-selector-dialog-loader/point-selector-dialog-loader.component';
import { UnitSelectorDialogLoaderComponent } from './components/unit-selector-dialog-loader/unit-selector-dialog-loader.component';

const routes: Routes = [
  {
    path:'',
    component: NavComponent,
    children: [{
      path:'Unidades',
      component: UnitSelectorDialogLoaderComponent
    },{
      path:'Puntos',
      component: PointSelectorDialogLoaderComponent
    }]
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
