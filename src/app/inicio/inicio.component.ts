import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  animations: [
    trigger('favoritoAnimation', [
      transition('false => true', [
        style({ transform: 'scale(1)' }),
        animate('400ms ease-out', style({ transform: 'scale(1.05)' })),
        animate('200ms ease-in', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class InicioComponent {
  // Controle da sidebar retrátil
  sidebarRetraida = false;

  // Lista de empresas
  empresas = [
    {
      id: 1,
      razaoSocial: 'Empresa Modelo Mister Contador',
      cnpj: '37489544000179',
      integracoes: [
        { icon: 'bx-file', color: '#ebebeb' },
        { icon: 'bx-buildings', color: '#1800AD' },
        { icon: 'bx-credit-card', color: '#1800AD' }
      ],
      progressoConciliacao: 75,
      tickets: 'Tickets',
      exportacao: '25/08/2025 / 72025',
      usuario: 'nicolas.mota@equipe.mistercontador.com.br',
      favorito: false
    },
    {
      id: 2,
      razaoSocial: 'Tech Solutions Ltda',
      cnpj: '12345678000199',
      integracoes: [
        { icon: 'bx-file', color: '#1800AD' },
        { icon: 'bx-buildings', color: '#1800AD' },
        { icon: 'bx-credit-card', color: '#1800AD' }
      ],
      progressoConciliacao: 100,
      tickets: 'Nenhum',
      exportacao: '26/09/2025 / 82025',
      usuario: 'admin@techsolutions.com.br',
      favorito: false
    }
  ];

  constructor(private router: Router) { }

  toggleSidebar() {
    this.sidebarRetraida = !this.sidebarRetraida;
  }

  // Getter para empresas ordenadas (favoritos primeiro)
  get empresasOrdenadas() {
    return [...this.empresas].sort((a, b) => {
      if (a.favorito && !b.favorito) return -1;
      if (!a.favorito && b.favorito) return 1;
      return 0;
    });
  }

  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }

  empresaAnimando: number | null = null;

  toggleFavorito(empresaId: number) {
    const empresa = this.empresas.find(e => e.id === empresaId);
    if (empresa) {
      if (!empresa.favorito) {
        // Está favoritando - animar subida
        this.empresaAnimando = empresaId;

        // Primeiro aplica a classe de animação
        setTimeout(() => {
          empresa.favorito = true;

          // Remove a animação após completar
          setTimeout(() => {
            this.empresaAnimando = null;
          }, 800);
        }, 100);
      } else {
        // Está desfavoritando - sem animação especial
        empresa.favorito = false;
      }

      console.log(`Favorito alterado para empresa ${empresaId}:`, empresa.favorito);
    }
  }

  trackByEmpresa(index: number, empresa: any): number {
    return empresa.id;
  }

  visualizarEmpresa() {
    console.log('Visualizar empresa clicado');
    // Implementar lógica para visualizar detalhes da empresa
    // this.router.navigate(['/empresa/detalhes']);
  }

  sair() {
    // Implementar lógica de logout
    console.log('Logout realizado');
    // Pode redirecionar para uma tela de login ou limpar sessão
    // this.router.navigate(['/login']);
  }
}