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

export interface ParcelaData {
  numeroEmpresa: string;
  dtParcela: string;
  valorNota: number;
  parcela: string;
}

export interface NFSeData {
  numero: string;
  razaoSocial: string;
  cnpj: string;
  dataParcela: string;
  valorParcela: number;
  valorLiquido: number;
  iss: number;
  ir: number;
  inss: number;
  pis: number;
  cofins: number;
  csll: number;
  desconto: number;
  parcela: string;
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
  parcelasData: ParcelaData[] = [];
  nfseData: NFSeData[] = [];
  notasFiscaisVisiveis: boolean = false;
  associarContaVisivel: boolean = false;
  notasFiscaisClosing: boolean = false;
  associarContaClosing: boolean = false;
  abaSelecionada: string = 'nfe';
  termoPesquisa: string = '';
  filtroSelecionado: string = 'numero';

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
      this.carregarParcelasData();
      this.carregarNFSeData();
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
      const rawValor = typeof linha.valor === 'string' ? linha.valor : String(linha.valor);
      const valorNumerico = this.converterValorParaNumero(rawValor);

      if (linha.tipo === 'debito') {
        debito += Math.abs(valorNumerico);
      } else if (linha.tipo === 'credito') {
        credito += Math.abs(valorNumerico);
      }
    }

    this.totalDebito = debito;
    this.totalCredito = credito;
    this.diferenca = Math.abs(debito - credito);
  }

  converterValorParaNumero(valor: string): number {
    if (!valor) return 0;

    // Remove "R$" e qualquer caractere que não seja número, vírgula ou ponto
    const valorLimpo = valor.replace(/[^\d,.-]/g, '').replace(',', '.');

    const parsed = parseFloat(valorLimpo);
    return isNaN(parsed) ? 0 : parsed;
  }

  fechar(): void {
    this.fechado.emit();
  }

  criarRegra(): void {
    this.regrapressed.emit();
  }

  selecionarAba(aba: string): void {
    this.abaSelecionada = aba;
  }

  toggleNotasFiscais(): void {
    if (this.notasFiscaisVisiveis) {
      // Fechar notas fiscais
      this.notasFiscaisClosing = true;
      setTimeout(() => {
        this.notasFiscaisVisiveis = false;
        this.notasFiscaisClosing = false;
      }, 250); // Sincronizado com animação slideUp (0.25s)
    } else {
      // Fechar associar conta se estiver aberta
      if (this.associarContaVisivel) {
        this.associarContaClosing = true;
        setTimeout(() => {
          this.associarContaVisivel = false;
          this.associarContaClosing = false;

          // Abrir notas fiscais após fechar a outra seção
          this.notasFiscaisVisiveis = true;
          this.notasFiscaisClosing = false;
        }, 250);
      } else {
        // Abrir notas fiscais imediatamente
        this.notasFiscaisVisiveis = true;
        this.notasFiscaisClosing = false;
      }
    }
  }

  toggleAssociarConta(): void {
    if (this.associarContaVisivel) {
      // Fechar associar conta
      this.associarContaClosing = true;
      setTimeout(() => {
        this.associarContaVisivel = false;
        this.associarContaClosing = false;
      }, 250); // Sincronizado com animação slideUp (0.25s)
    } else {
      // Fechar notas fiscais se estiver aberta
      if (this.notasFiscaisVisiveis) {
        this.notasFiscaisClosing = true;
        setTimeout(() => {
          this.notasFiscaisVisiveis = false;
          this.notasFiscaisClosing = false;

          // Abrir associar conta após fechar a outra seção
          this.associarContaVisivel = true;
          this.associarContaClosing = false;
        }, 250);
      } else {
        // Abrir associar conta imediatamente
        this.associarContaVisivel = true;
        this.associarContaClosing = false;
      }
    }
  }

  pesquisar(): void {
    console.log('Pesquisando:', this.termoPesquisa, 'por', this.filtroSelecionado);
    // Implementar lógica de pesquisa aqui
  }

  carregarParcelasData(): void {
    // Dados de exemplo - substitua pela lógica real de carregamento
    this.parcelasData = [
      {
        numeroEmpresa: '001',
        dtParcela: '2024-12-15',
        valorNota: 1500.00,
        parcela: '1/3'
      },
      {
        numeroEmpresa: '001',
        dtParcela: '2025-01-15',
        valorNota: 1500.00,
        parcela: '2/3'
      },
      {
        numeroEmpresa: '001',
        dtParcela: '2025-02-15',
        valorNota: 1500.00,
        parcela: '3/3'
      }
    ];
  }

  carregarNFSeData(): void {
    // Dados de exemplo NFSe - substitua pela lógica real de carregamento
    this.nfseData = [
      {
        numero: '000001',
        razaoSocial: 'Empresa ABC Ltda',
        cnpj: '12.345.678/0001-90',
        dataParcela: '2024-12-15',
        valorParcela: 2000.00,
        valorLiquido: 1800.00,
        iss: 100.00,
        ir: 50.00,
        inss: 30.00,
        pis: 10.00,
        cofins: 8.00,
        csll: 2.00,
        desconto: 0.00,
        parcela: '1/2'
      },
      {
        numero: '000002',
        razaoSocial: 'Serviços XYZ S/A',
        cnpj: '98.765.432/0001-10',
        dataParcela: '2025-01-15',
        valorParcela: 1500.00,
        valorLiquido: 1350.00,
        iss: 75.00,
        ir: 45.00,
        inss: 20.00,
        pis: 7.50,
        cofins: 2.50,
        csll: 0.00,
        desconto: 0.00,
        parcela: '2/2'
      }
    ];
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