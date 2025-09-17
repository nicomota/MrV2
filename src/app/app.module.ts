import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroContabilComponent } from './registro-contabil/registro-contabil.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalLancamentoComponent } from './registro-contabil/modal-lancamento/modal-lancamento.component'; // <-- importe aqui

@NgModule({
  declarations: [
    AppComponent,
    RegistroContabilComponent,
    ModalLancamentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
