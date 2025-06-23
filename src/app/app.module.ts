import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroContabilComponent } from './registro-contabil/registro-contabil.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    RegistroContabilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule // ✅ Correto aqui
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
