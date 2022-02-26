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
import { UsersOperationsManagementComponent } from './components/users-operations-management/users-operations-management.component';
import { UsersComponent } from './components/users/users.component';
import { AuthRoleWownerService } from './services/auth-role-owner.service';
import { AuthRoleService } from './services/auth-role.service';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path:'',
    component: NavComponent,
    children: [{
      path:'Units',
      component: UnitSelectorDialogLoaderComponent, canActivate: [AuthGuard,AuthRoleService]
    },{
      path:'Points',
      component: PointSelectorDialogLoaderComponent, canActivate: [AuthGuard,AuthRoleService]
    },{
      path:'Lines',
      component: LineSelectorDialogLoaderComponent, canActivate: [AuthGuard,AuthRoleService]
    },{
      path:'Areas',
      component: AreaSelectorDialogLoaderComponent, canActivate: [AuthGuard,AuthRoleService]
    },{
      path:'Tasks',
      component: TaskSelectorDialogLoaderComponent, canActivate: [AuthGuard,AuthRoleService]
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
      {path: 'userProfile', component: RegisterComponent, canActivate: [AuthGuard]} ,
      {path: 'users', component: UsersComponent, canActivate: [AuthGuard]} ,
      {path: 'usersOperations', component: UsersOperationsManagementComponent, canActivate: [AuthGuard,AuthRoleWownerService]} 
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
