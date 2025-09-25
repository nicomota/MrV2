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

  constructor(private router: Router) { }

  toggleSidebar() {
    this.sidebarRetraida = !this.sidebarRetraida;
  }

  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }

  sair() {
    // Implementar lógica de logout
    console.log('Logout realizado');
    // Pode redirecionar para uma tela de login ou limpar sessão
    // this.router.navigate(['/login']);
  }
}