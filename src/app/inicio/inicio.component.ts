import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  // Controle da sidebar retrátil
  sidebarRetraida = false;

  // Controle de favoritos
  favorito = false;

  constructor(private router: Router) { }

  toggleSidebar() {
    this.sidebarRetraida = !this.sidebarRetraida;
  }

  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }

  toggleFavorito() {
    this.favorito = !this.favorito;
    console.log('Favorito alterado:', this.favorito);
  }

  sair() {
    // Implementar lógica de logout
    console.log('Logout realizado');
    // Pode redirecionar para uma tela de login ou limpar sessão
    // this.router.navigate(['/login']);
  }
}