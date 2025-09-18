import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

export interface Lancamento {
  data: string;
  classificacao: string;
  debito: string;
  credito: string;
  valor: string;
  historico: string;
  nota: string;
  cliente: string;
  status: string;
}

export interface LinhaSubtabela {
  tipo: 'debito' | 'credito';
  debitar?: string;
  creditar?: string;
  conta: string;
  classificacao: string;
  descricao: string;
  valor: string;
  historico: string;
  editavel: boolean;
}

@Component({
  selector: 'app-modal-lancamento',
  templateUrl: './modal-lancamento.component.html',
  styleUrls: ['./modal-lancamento.component.scss']
})
export class ModalLancamentoComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() lancamento!: Lancamento;
  @Output() fechado = new EventEmitter<void>();
  @Output() regrapressed = new EventEmitter<void>();
  @Output() gravado = new EventEmitter<any>();

  tipoSelecionado: string = '';
  linhasSubtabela: LinhaSubtabela[] = [];
  tiposDisponiveis: string[] = [];

  totalDebito: number = 0;
  totalCredito: number = 0;
  diferenca: number = 0;

  constructor() { }

  ngOnInit(): void {
    if (this.lancamento) {
      this.configurarTiposDisponiveis();
    }
  }

  ngOnChanges(): void {
    if (this.lancamento && this.isVisible) {
      this.tipoSelecionado = ''; // Reset dropdown
      this.linhasSubtabela = []; // Reset tabela
      this.configurarTiposDisponiveis();
    }
  }

  configurarTiposDisponiveis(): void {
    const temDebito = !!this.lancamento.debito;
    const temCredito = !!this.lancamento.credito;

    this.tiposDisponiveis = [];

    if (temDebito && !temCredito) {
      this.tiposDisponiveis = [
        'Um Débito p/ um Crédito',
        'Um Débito p/ vários Créditos',
        'N Débito p/ N Crédito'
      ];
    } else if (temCredito && !temDebito) {
      this.tiposDisponiveis = [
        'Um Crédito p/ um Débito',
        'Um Crédito p/ vários Débitos',
        'N Crédito p/ N Débito'
      ];
    } else {
      this.tiposDisponiveis = [
        'Um Débito p/ um Crédito',
        'Um Crédito p/ um Débito',
        'Um Débito p/ vários Créditos',
        'Um Crédito p/ vários Débitos',
        'N Débito p/ N Crédito',
        'N Crédito p/ N Débito'
      ];
    }
  }



  onTipoSelecionado(): void {
    this.linhasSubtabela = [];

    if (!this.lancamento) return;

    const linhaBase = {
      classificacao: this.lancamento.classificacao,
      descricao: this.lancamento.historico,
      valor: this.lancamento.valor,
      historico: this.lancamento.historico
    };


    switch (this.tipoSelecionado) {
      case 'Um Débito p/ um Crédito':
        this.linhasSubtabela.push(
          {
            tipo: 'debito',
            debitar: this.lancamento.debito,
            conta: this.lancamento.debito,
            editavel: false,
            ...linhaBase
          },
          {
            tipo: 'credito',
            creditar: '',
            conta: '',
            editavel: true,
            ...linhaBase,
            descricao: '',
            valor: '',
            historico: ''
          }
        );
        break;

      case 'Um Crédito p/ um Débito':
        this.linhasSubtabela.push(
          {
            tipo: 'debito',
            debitar: '',
            conta: '',
            editavel: true,
            ...linhaBase,
            descricao: '',
            valor: '',
            historico: ''
          },
          {
            tipo: 'credito',
            creditar: this.lancamento.credito,
            conta: this.lancamento.credito,
            editavel: false,
            ...linhaBase
          }
        );
        break;

      case 'Um Débito p/ vários Créditos':
        this.linhasSubtabela.push({
          tipo: 'debito',
          debitar: this.lancamento.debito,
          conta: this.lancamento.debito,
          editavel: false,
          ...linhaBase
        });
        this.linhasSubtabela.push({
          tipo: 'credito',
          creditar: '',
          conta: '',
          editavel: true,
          classificacao: '',
          descricao: '',
          valor: '',
          historico: ''
        });
        break;

      case 'Um Crédito p/ vários Débitos':
        this.linhasSubtabela.push({
          tipo: 'credito',
          creditar: this.lancamento.credito,
          conta: this.lancamento.credito,
          editavel: false,
          ...linhaBase
        });
        this.linhasSubtabela.push({
          tipo: 'debito',
          debitar: '',
          conta: '',
          editavel: true,
          classificacao: '',
          descricao: '',
          valor: '',
          historico: ''
        });
        break;

      case 'N Débito p/ N Crédito':
        this.linhasSubtabela.push(
          {
            tipo: 'debito',
            debitar: this.lancamento.debito,
            conta: this.lancamento.debito,
            editavel: false,
            ...linhaBase
          },
          {
            tipo: 'credito',
            creditar: '',
            conta: '',
            editavel: true,
            classificacao: '',
            descricao: '',
            valor: '',
            historico: ''
          }
        );
        break;

      case 'N Crédito p/ N Débito':
        this.linhasSubtabela.push(
          {
            tipo: 'credito',
            creditar: this.lancamento.credito,
            conta: this.lancamento.credito,
            editavel: false,
            ...linhaBase
          },
          {
            tipo: 'debito',
            debitar: '',
            conta: '',
            editavel: true,
            classificacao: '',
            descricao: '',
            valor: '',
            historico: ''
          }
        );
        break;

      default:
        break;
    }
    this.atualizarTotais();
  }

  adicionarLinha(tipo: 'debito' | 'credito'): void {
    const novaLinha: LinhaSubtabela = {
      tipo,
      conta: '',
      classificacao: '',
      descricao: '',
      valor: '',
      historico: '',
      editavel: true
    };

    if (tipo === 'debito') {
      novaLinha.debitar = '';
    } else {
      novaLinha.creditar = '';
    }

    this.linhasSubtabela.push(novaLinha);
    this.atualizarTotais();
  }

  removerLinha(index: number): void {
    if (this.linhasSubtabela[index]?.editavel) {
      this.linhasSubtabela.splice(index, 1);
      this.atualizarTotais();
    }
  }

  atualizarTotais(): void {
    let debito = 0;
    let credito = 0;

    for (const linha of this.linhasSubtabela) {
      const valorNumerico = this.converterValorParaNumero(linha.valor);

      if (linha.tipo === 'debito') {
        debito += valorNumerico;
      } else if (linha.tipo === 'credito') {
        credito += valorNumerico;
      }
    }

    this.totalDebito = debito;
    this.totalCredito = credito;
    this.diferenca = debito - credito; // A diferença deve ser a subtração direta
  }

  converterValorParaNumero(valor: string | number): number {
    if (typeof valor === 'number') {
      return valor;
    }
    if (!valor) {
      return 0;
    }

    // Remove "R$", espaços, e troca a vírgula por ponto
    const valorLimpo = valor.toString().replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
    
    const parsed = parseFloat(valorLimpo);
    return isNaN(parsed) ? 0 : Math.abs(parsed);
  }

  fechar(): void {
    this.fechado.emit();
  }

  criarRegra(): void {
    this.regrapressed.emit();
  }

  gravar(): void {
    const dadosLancamento = {
      lancamento: this.lancamento,
      tipo: this.tipoSelecionado,
      linhas: this.linhasSubtabela,
      totais: {
        debito: this.totalDebito,
        credito: this.totalCredito,
        diferenca: this.diferenca
      }
    };
    this.gravado.emit(dadosLancamento);
  }
}