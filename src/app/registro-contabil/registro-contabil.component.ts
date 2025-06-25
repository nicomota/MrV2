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
    credito: '66',
    valor: 'R$ 250,00',
    historico: 'Pagamento Fornecedor',
    nota: '5464',
    cliente: '21576936000135',
    status: 'vermelho'
  };

  const novoLancamento = {
    data: '03/04/2021',
    classificacao: '2.1.2.02.0021',
    debito: '21',
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

    if (temDebito && !temCredito) {
      this.tiposDisponiveis = [
        'Um Débito p/ um Crédito',
        'Um Débito p/ vários Créditos'
      ];
    } else if (temCredito && !temDebito) {
      this.tiposDisponiveis = [
        'Um Crédito p/ um Débito',
        'Um Crédito p/ vários Débitos'
      ];
    } else {
      this.tiposDisponiveis = [
        'Um Débito p/ um Crédito',
        'Um Crédito p/ um Débito',
        'Um Débito p/ vários Créditos',
        'Um Crédito p/ vários Débitos'
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

  if (this.tipoSelecionado === 'Um Débito p/ um Crédito') {
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
  } else if (this.tipoSelecionado === 'Um Crédito p/ um Débito') {
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
  } else if (this.tipoSelecionado === 'Um Débito p/ vários Créditos') {
    // Primeiro: linha fixa de débito
    this.linhasSubtabela.push({
      tipo: 'debito',
      debitar: dados.debito,
      conta: dados.debito,
      editavel: false,
      ...linhaBase
    });

    // Segundo: linha de crédito vazia editável
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
  } else if (this.tipoSelecionado === 'Um Crédito p/ vários Débitos') {
    // Primeiro: linha fixa de crédito
    this.linhasSubtabela.push({
      tipo: 'credito',
      creditar: dados.credito,
      conta: dados.credito,
      editavel: false,
      ...linhaBase
    });

    // Segundo: linha de débito vazia editável
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
  }
}

adicionarLinha() {
  let tipo: 'debito' | 'credito' = 'debito';

  if (this.tipoSelecionado === 'Um Débito p/ vários Créditos') {
    tipo = 'credito';
  } else if (this.tipoSelecionado === 'Um Crédito p/ vários Débitos') {
    tipo = 'debito';
  } else {
    tipo = this.tipoSelecionado.includes('Débito') ? 'debito' : 'credito';
  }

  this.linhasSubtabela.unshift({
    tipo: tipo,
    [tipo]: '',
    conta: '',
    classificacao: '',
    descricao: '',
    valor: '',
    historico: '',
    editavel: true
  });
}


  removerLinha(index: number) {
    if (this.linhasSubtabela[index]?.editavel) {
      this.linhasSubtabela.splice(index, 1);
    }
  }
}
