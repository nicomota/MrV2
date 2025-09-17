import { Component, OnInit, HostListener } from '@angular/core';

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

  lancamentoSelecionado: any = null;

  modalAberto = false;
  mostrarModalConta = false;
  historicoSelecionado = '';
  abaSelecionada: string = 'lancamentos';
  mesSelecionado: string = 'Abril/2021';
  dropdownAberto: boolean = false;

  // Propriedades para o date picker customizado (modal)
  mostrarDatePicker: boolean = false;
  dataSelecionada: string = '';
  anoAtual: number = new Date().getFullYear();
  mesAtual: number = new Date().getMonth();
  diaAtual: number = new Date().getDate();

  // Propriedades para o calendário principal (mes-selector)
  mostrarCalendarioPrincipal: boolean = false;
  dataSelecionadaPrincipal: Date | null = null;
  anoCalendarioPrincipal: number = new Date().getFullYear();
  mesCalendarioPrincipal: number = new Date().getMonth();

  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  mesesAno: string[] = [
    'Janeiro/2021', 'Fevereiro/2021', 'Março/2021', 'Abril/2021',
    'Maio/2021', 'Junho/2021', 'Julho/2021', 'Agosto/2021',
    'Setembro/2021', 'Outubro/2021', 'Novembro/2021', 'Dezembro/2021'
  ];

  dadosLancamentos: any[] = [];

  abrirModal(index: number) {
    this.lancamentoSelecionado = this.dadosLancamentos[index];
  }

  onLancamentoGravado(dadosLancamento: any) {
    console.log('Dados do lançamento gravado:', dadosLancamento);
    this.lancamentoSelecionado = null;
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


  // Métodos para o date picker customizado
  abrirDatePicker() {
    this.mostrarDatePicker = true;
    // Se já há uma data selecionada, usar ela como base
    if (this.dataSelecionada) {
      const data = new Date(this.dataSelecionada);
      this.anoAtual = data.getFullYear();
      this.mesAtual = data.getMonth();
    }
  }

  // Métodos auxiliares para o template
  isToday(dia: number): boolean {
    const hoje = new Date();
    return dia === this.diaAtual &&
           this.mesAtual === hoje.getMonth() &&
           this.anoAtual === hoje.getFullYear();
  }

  fecharDatePicker() {
    this.mostrarDatePicker = false;
  }

  alterarAno(direcao: number) {
    this.anoAtual += direcao;
  }

  alterarMes(direcao: number) {
    this.mesAtual += direcao;
    if (this.mesAtual > 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    } else if (this.mesAtual < 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    }
  }

  getDiasDoMes(): number[] {
    const diasNoMes = new Date(this.anoAtual, this.mesAtual + 1, 0).getDate();
    const primeiroDiaSemana = new Date(this.anoAtual, this.mesAtual, 1).getDay();

    const dias: number[] = [];

    // Adiciona células vazias para os dias da semana anterior
    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push(0);
    }

    // Adiciona os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      dias.push(dia);
    }

    return dias;
  }

  selecionarDia(dia: number) {
    if (dia === 0) return; // Não faz nada para células vazias

    const data = new Date(this.anoAtual, this.mesAtual, dia);
    this.dataSelecionada = data.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.fecharDatePicker();
  }

  formatarDataExibicao(): string {
    if (!this.dataSelecionada) return 'Selecionar data';

    const data = new Date(this.dataSelecionada);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  }

  // Métodos para o calendário principal
  abrirCalendarioPrincipal() {
    this.mostrarCalendarioPrincipal = true;
  }

  fecharCalendarioPrincipal() {
    this.mostrarCalendarioPrincipal = false;
  }

  alterarAnoPrincipal(direcao: number) {
    this.anoCalendarioPrincipal += direcao;
  }

  alterarMesPrincipal(direcao: number) {
    this.mesCalendarioPrincipal += direcao;
    if (this.mesCalendarioPrincipal > 11) {
      this.mesCalendarioPrincipal = 0;
      this.anoCalendarioPrincipal++;
    } else if (this.mesCalendarioPrincipal < 0) {
      this.mesCalendarioPrincipal = 11;
      this.anoCalendarioPrincipal--;
    }
  }

  getMesesDoAno(): string[] {
    return this.meses;
  }

  selecionarMesPrincipal(mesIndex: number) {
    this.mesCalendarioPrincipal = mesIndex;
    this.dataSelecionadaPrincipal = new Date(this.anoCalendarioPrincipal, mesIndex, 1);
    this.fecharCalendarioPrincipal();

    // Atualiza a exibição
    this.mesSelecionado = `${this.meses[mesIndex]}/${this.anoCalendarioPrincipal}`;
  }

  formatarDataExibicaoPrincipal(): string {
    if (!this.dataSelecionadaPrincipal) {
      return 'Selecionar mês/ano';
    }
    const mes = this.meses[this.dataSelecionadaPrincipal.getMonth()];
    const ano = this.dataSelecionadaPrincipal.getFullYear();
    return `${mes}/${ano}`;
  }

  isMesAtualPrincipal(mesIndex: number): boolean {
    const hoje = new Date();
    return mesIndex === hoje.getMonth() &&
           this.anoCalendarioPrincipal === hoje.getFullYear() &&
           !this.isMesSelecionadoPrincipal(mesIndex); // Só mostra como atual se não estiver selecionado
  }

  isMesSelecionadoPrincipal(mesIndex: number): boolean {
    if (!this.dataSelecionadaPrincipal) return false;
    return mesIndex === this.dataSelecionadaPrincipal.getMonth() &&
           this.anoCalendarioPrincipal === this.dataSelecionadaPrincipal.getFullYear();
  }

  // Listener para fechar o date picker ao clicar fora dele
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.mostrarDatePicker) {
      const target = event.target as HTMLElement;
      const datePickerContainer = target.closest('.date-picker-container');

      if (!datePickerContainer) {
        this.fecharDatePicker();
      }
    }

    if (this.mostrarCalendarioPrincipal) {
      const target = event.target as HTMLElement;
      const calendarioContainer = target.closest('.calendario-principal-container');

      if (!calendarioContainer) {
        this.fecharCalendarioPrincipal();
      }
    }
  }
}


