import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaSelectorDialogLoaderComponent } from './components/area-selector-dialog-loader/area-selector-dialog-loader.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { LineSelectorDialogLoaderComponent } from './components/line-selector-dialog-loader/line-selector-dialog-loader.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { OperationsComponent } from './components/nav/operations/operations.component';
import { OpordComponent } from './components/opord/opord.component';
import { PointSelectorDialogLoaderComponent } from './components/point-selector-dialog-loader/point-selector-dialog-loader.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskSelectorDialogLoaderComponent } from './components/task-selector-dialog-loader/task-selector-dialog-loader.component';
import { UnitSelectorDialogLoaderComponent } from './components/unit-selector-dialog-loader/unit-selector-dialog-loader.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path:'',
    component: NavComponent,
    children: [{
      path:'Units',
      component: UnitSelectorDialogLoaderComponent, canActivate: [AuthGuard]
    },{
      path:'Points',
      component: PointSelectorDialogLoaderComponent, canActivate: [AuthGuard]
    },{
      path:'Lines',
      component: LineSelectorDialogLoaderComponent, canActivate: [AuthGuard]
    },{
      path:'Areas',
      component: AreaSelectorDialogLoaderComponent, canActivate: [AuthGuard]
    },{
      path:'Tasks',
      component: TaskSelectorDialogLoaderComponent, canActivate: [AuthGuard]
    },{
      path:'Operations',
      component: OperationsComponent, canActivate: [AuthGuard]
    },{
      path:'Opord',
      component: OpordComponent, canActivate: [AuthGuard]
    },{
      path:'Help',
      component: CarouselComponent
    },
      // {path: '', redirectTo: '/login', pathMatch: 'full'} ,
      {path: 'login', component: LoginComponent} ,
      {path: 'register', component: RegisterComponent} ,
      {path: 'userProfile', component: RegisterComponent, canActivate: [AuthGuard]} 
  ]
  },
  { 
    path: '**', // bonus: all routes not defined forward to /home
    redirectTo: ''
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { enableTracing: true } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
