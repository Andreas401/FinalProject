import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DemoComponent } from './demo/demo.component';
import { MapComponent } from './map/map.component';
import { AddpinpointComponent } from './map/addpinpoint/addpinpoint.component';

const routes: Routes = [{
  path: '', redirectTo: 'login', pathMatch: 'full'
},
{ path: 'home', component: HomeComponent },
{ path: 'login', component: LoginComponent},
{ path: 'demo', component: DemoComponent},
{ path: 'map', component: MapComponent, children: 
[
  { path: 'addpinpoint', component: AddpinpointComponent }
]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
