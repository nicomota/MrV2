import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-contabil',
  templateUrl: './registro-contabil.component.html',
  styleUrls: ['./registro-contabil.component.scss']
})
export class RegistroContabilComponent implements OnInit {

  constructor() {}

ngOnInit(): void {
  // adiciona o primeiro lançamento à tabela
  const primeiroLancamento = {
    data: '02/04/2021',
    classificacao: '2.1.2.02.0021',
    debito: '',
    credito: '7',
    valor: 'R$ 250,00',
    historico: 'Pagamento Fornecedor',
    nota: '5464',
    cliente: '21576936000135',
    status: 'vermelho'
  };

  const novoLancamento = {
    data: '03/04/2021',
    classificacao: '2.1.2.02.0021',
    debito: '7',
    credito: '',
    valor: 'R$ 354,00',
    historico: 'Recebimento PIX',
    nota: '654',
    cliente: '21576936000135',
    status: 'vermelho'
  };

  this.dadosLancamentos = [primeiroLancamento, novoLancamento];
}

  tipoSelecionado: string = '';
  linhasSubtabela: any[] = [];
  tiposDisponiveis: string[] = [];
  lancamentoSelecionado: any = null;

  totalDebito: number = 0;
  totalCredito: number = 0;
  diferenca: number = 0;

  modalAberto = false;
  mostrarModalConta = false;
  historicoSelecionado = '';
  abaSelecionada: string = 'lancamentos';
  mesSelecionado: string = 'Abril/2021';
  dropdownAberto: boolean = false;

  mesesAno: string[] = [
    'Janeiro/2021', 'Fevereiro/2021', 'Março/2021', 'Abril/2021',
    'Maio/2021', 'Junho/2021', 'Julho/2021', 'Agosto/2021',
    'Setembro/2021', 'Outubro/2021', 'Novembro/2021', 'Dezembro/2021'
  ];

  dadosLancamentos = [this.lancamentoSelecionado];

  abrirModal(index: number) {
    this.lancamentoSelecionado = this.dadosLancamentos[index];

    const temDebito = !!this.lancamentoSelecionado.debito;
    const temCredito = !!this.lancamentoSelecionado.credito;

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


  abrirModalRegra() {
    this.modalAberto = true;
  }

  fecharModalRegra() {
    this.modalAberto = false;
  }

  abrirModalConta(historico: string) {
    this.historicoSelecionado = historico;
    this.mostrarModalConta = true;
  }

  fecharModalConta() {
    this.mostrarModalConta = false;
  }

  selecionarAba(aba: string) {
    this.abaSelecionada = aba;
  }

  toggleDropdown() {
    this.dropdownAberto = !this.dropdownAberto;
  }

  selecionarMes(mes: string) {
    this.mesSelecionado = mes;
    this.dropdownAberto = false;
  }

  anteriorMes() {
    const index = this.mesesAno.indexOf(this.mesSelecionado);
    if (index > 0) this.mesSelecionado = this.mesesAno[index - 1];
  }

  condicaoExibirIconeNaContaDebito(linha: any): boolean {
    // Exibe o ícone apenas se a linha tiver crédito preenchido
    return !!linha.credito;
  }

  condicaoExibirIconeNaContaCredito(linha: any): boolean {
    // Exibe o ícone apenas se a linha não tiver crédito (recebimento)
    return !linha.credito && !!linha.debito;
  }

  proximoMes() {
    const index = this.mesesAno.indexOf(this.mesSelecionado);
    if (index < this.mesesAno.length - 1) this.mesSelecionado = this.mesesAno[index + 1];
  }

  atualizarTotais() {
    let debito = 0;
    let credito = 0;

    for (const linha of this.linhasSubtabela) {
      const rawValor = typeof linha.valor === 'string' ? linha.valor : String(linha.valor);
      const valorNumerico = this.converterValorParaNumero(rawValor);

      if (linha.tipo === 'debito') {
        debito += valorNumerico;
      } else if (linha.tipo === 'credito') {
        credito += valorNumerico;
      }
    }

    this.totalDebito = debito;
    this.totalCredito = credito;
    this.diferenca = Math.abs(debito - credito);
    this.atualizarTotais();
  }

  converterValorParaNumero(valor: string): number {
    if (!valor) return 0;

    // Remove "R$" e qualquer caractere que não seja número, vírgula ou ponto
    const valorLimpo = valor.replace(/[^\d,.-]/g, '').replace(',', '.');

    const parsed = parseFloat(valorLimpo);
    return isNaN(parsed) ? 0 : parsed;
  }


  onTipoSelecionado() {
    this.linhasSubtabela = [];

    const dados = this.lancamentoSelecionado;
    if (!dados) return;

    const linhaBase = {
      classificacao: dados.classificacao,
      descricao: dados.historico,
      valor: dados.valor,
      historico: dados.historico
    };

  switch (this.tipoSelecionado) {
    case 'Um Débito p/ um Crédito':
      this.linhasSubtabela.push(
        {
          tipo: 'debito',
          debitar: dados.debito,
          conta: dados.debito,
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
          creditar: dados.credito,
          conta: dados.credito,
          editavel: false,
          ...linhaBase
        }
      );
      break;

    case 'Um Débito p/ vários Créditos':
      this.linhasSubtabela.push({
        tipo: 'debito',
        debitar: dados.debito,
        conta: dados.debito,
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
        creditar: dados.credito,
        conta: dados.credito,
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
      // Começa com 1 linha débito e 1 linha crédito, ambas editáveis
      this.linhasSubtabela.push(
        {
          tipo: 'debito',
          debitar: dados.debito,
          conta: dados.debito,
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
      // Começa com 1 linha crédito e 1 linha débito, ambas editáveis
      this.linhasSubtabela.push(
        {
          tipo: 'credito',
          creditar: dados.credito,
          conta: dados.credito,
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


adicionarLinha(tipo: 'debito' | 'credito') {
  const novaLinha: any = {
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


  removerLinha(index: number) {
    if (this.linhasSubtabela[index]?.editavel) {
      this.linhasSubtabela.splice(index, 1);
      this.atualizarTotais();
    }
  }
}


