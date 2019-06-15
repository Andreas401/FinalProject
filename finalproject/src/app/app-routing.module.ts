import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { AuthGuard } from './auth/auth.guard';
import { AddpinpointComponent } from './map/addpinpoint/addpinpoint.component';
import { RegisterComponent } from './register/register.component';
import { EditpointComponent } from './map/editpoint/editpoint.component';

const routes: Routes = [{
  path: '', redirectTo: 'login', pathMatch: 'full'
},
{ path: 'home', component: HomeComponent },
{ path: 'login', component: LoginComponent},
{ path: 'register', component: RegisterComponent},
{ path: 'map', component: MapComponent, canActivate: [AuthGuard], children: 
[
  { path: 'addpinpoint', component: AddpinpointComponent },
  { path: 'editpoint', component: EditpointComponent }
]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
