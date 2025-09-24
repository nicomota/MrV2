import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-registro-contabil',
  templateUrl: './registro-contabil.component.html',
  styleUrls: ['./registro-contabil.component.scss']
})
export class RegistroContabilComponent implements OnInit {

  // Simula a persistência dos dados tornando a lista estática
  private static dadosLancamentosPersistidos: any[] = [
    {
      data: '02/04/2021',
      classificacao: '2.1.2.02.0021',
      debito: '7',
      credito: '',
      valor: 'R$ -250,00',
      historico: 'Pagamento Fornecedor',
      nota: '5464',
      cliente: '',
      status: 'vermelho',
      temContaAutomatica: false
    },
    {
      data: '03/04/2021',
      classificacao: '2.1.2.02.0021',
      debito: '',
      credito: '7',
      valor: 'R$ 354,00',
      historico: 'Recebimento PIX',
      nota: '654',
      cliente: '',
      status: 'vermelho',
      temContaAutomatica: false
    }
  ];

  dadosLancamentos: any[] = [];
  saldoInicial: number = 1250.00;
  saldoFinal: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Carrega os dados da lista estática para a instância do componente
    this.dadosLancamentos = RegistroContabilComponent.dadosLancamentosPersistidos;
    this.calcularSaldos();
  }

  calcularSaldos(): void {
    let saldoAcumulado = this.saldoInicial;

    this.dadosLancamentos.forEach((lancamento, index) => {
      // Converte o valor string para número (remove R$, espaços e vírgulas)
      const valorString = lancamento.valor.replace(/[R$\s]/g, '').replace(',', '.');
      const valor = parseFloat(valorString);

      // Soma ou subtrai do saldo acumulado
      saldoAcumulado += valor;

      // Adiciona o saldo ao lançamento
      lancamento.saldo = this.formatarMoeda(saldoAcumulado);
    });

    this.saldoFinal = saldoAcumulado;
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  lancamentoSelecionado: any = null;

  modalAberto = false;
  lancamentoSelecionadoIndex: number | null = null;

  // Controle da sidebar retrátil
  sidebarRetraida = false;

  // Para controlar se é associação de conta (diferente do modal de regra normal)
  modoAssociacaoConta = false;
  contaContabilInput: string = '';
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


  abrirModal(index: number) {
    // Cria uma cópia do lançamento para evitar mutação direta
    this.lancamentoSelecionado = { ...this.dadosLancamentos[index] };
  }

  onLancamentoGravado(dadosGravados: any) {
    // Encontra o índice do lançamento original usando o objeto que foi passado para o modal
    const index = RegistroContabilComponent.dadosLancamentosPersistidos.findIndex(
      l => l.data === this.lancamentoSelecionado.data && l.historico === this.lancamentoSelecionado.historico
    );

    if (index !== -1) {
      const lancamentoOriginal = this.dadosLancamentos[index];
      const lancamentoAtualizado = { ...lancamentoOriginal };

      // Extrai os novos valores de débito e crédito das linhas retornadas pelo modal
      const debitoLinha = dadosGravados.linhas.find((l: any) => l.tipo === 'debito');
      const creditoLinha = dadosGravados.linhas.find((l: any) => l.tipo === 'credito');

      if (debitoLinha) {
        lancamentoAtualizado.debito = debitoLinha.debitar || debitoLinha.conta;
      }
      if (creditoLinha) {
        lancamentoAtualizado.credito = creditoLinha.creditar || creditoLinha.conta;
      }

      // Se o lançamento agora tem débito e crédito, está conciliado
      if (lancamentoAtualizado.debito && lancamentoAtualizado.credito) {
        lancamentoAtualizado.status = 'verde';
      }

      // Atualiza a lista de dados na tela e a lista estática de persistência
      this.dadosLancamentos[index] = lancamentoAtualizado;
      RegistroContabilComponent.dadosLancamentosPersistidos[index] = lancamentoAtualizado;
    }

    this.lancamentoSelecionado = null; // Fecha o modal
  }


  abrirModalRegra() {
    this.modalAberto = true;
  }

  fecharModalRegra() {
    this.modalAberto = false;
    this.modoAssociacaoConta = false;
    this.lancamentoSelecionadoIndex = null;
  }

  toggleSidebar() {
    this.sidebarRetraida = !this.sidebarRetraida;
  }

  // Método específico para abrir modal de associação de conta
  abrirModalAssociacaoConta(index: number) {
    this.lancamentoSelecionadoIndex = index;
    this.modoAssociacaoConta = true;
    this.modalAberto = true;
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
    // Exibe o ícone apenas se a linha tiver um valor de débito (contrapartida)
    return !!linha.debito;
  }

  condicaoExibirIconeNaContaCredito(linha: any): boolean {
    // Exibe o ícone apenas se a linha tiver um valor de crédito (contrapartida)
    return !!linha.credito;
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


