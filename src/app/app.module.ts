import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroContabilComponent } from './registro-contabil/registro-contabil.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalLancamentoComponent } from './registro-contabil/modal-lancamento/modal-lancamento.component';
import { ModalRegraComponent } from './registro-contabil/modals/modal-regra/modal-regra.component';
import { ModalAssociacaoContaComponent } from './registro-contabil/modals/modal-associacao-conta/modal-associacao-conta.component';
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroContabilComponent,
    ModalLancamentoComponent,
    ModalRegraComponent,
    ModalAssociacaoContaComponent,
    InicioComponent
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
