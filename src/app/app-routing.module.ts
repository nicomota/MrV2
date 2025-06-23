import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroContabilComponent } from './registro-contabil/registro-contabil.component';

const routes: Routes = [
  { path: '', redirectTo: 'registro-contabil', pathMatch: 'full' },
  { path: 'registro-contabil', component: RegistroContabilComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
