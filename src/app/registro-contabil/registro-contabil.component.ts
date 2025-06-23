import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-contabil',
  templateUrl: './registro-contabil.component.html',
  styleUrls: ['./registro-contabil.component.scss']
})
export class RegistroContabilComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  mesSelecionado: string = 'Abril/2021';
  dropdownAberto: boolean = false;



mesesAno: string[] = [
  'Janeiro/2021', 'Fevereiro/2021', 'Março/2021', 'Abril/2021',
  'Maio/2021', 'Junho/2021', 'Julho/2021', 'Agosto/2021',
  'Setembro/2021', 'Outubro/2021', 'Novembro/2021', 'Dezembro/2021'
];

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

proximoMes() {
  const index = this.mesesAno.indexOf(this.mesSelecionado);
  if (index < this.mesesAno.length - 1) this.mesSelecionado = this.mesesAno[index + 1];
}

abaSelecionada: string = 'lancamentos';

selecionarAba(aba: string) {
  this.abaSelecionada = aba;
}

lancamentoSelecionado: any = null;

dadosLancamentos = [
  {
    data: '01/04/2021',
    classificacao: '1.1.1.02.0001',
    conta: '23',
    debito: '11',
    credito: '-',
    valor: 'R$ 285,71',
    historico: 'Recebimento Fornecedor',
    nota: '5154',
    cliente: '29109270000117',
    status: 'verde'
  },
  {
    data: '02/04/2021',
    classificacao: '2.1.2.02.0021',
    conta: '765',
    debito: '66',
    credito: '-',
    valor: 'R$ 8.798,71',
    historico: 'Pagamento Fornecedor',
    nota: '5464',
    cliente: '21576936000135',
    status: 'verde'
  },
  {
    data: '04/04/2021',
    classificacao: '2.1.2.02.0651',
    conta: '97',
    debito: '35',
    credito: '-',
    valor: 'R$ 541,71',
    historico: 'Pix Margaret Machado',
    nota: '11584',
    cliente: '19887163000166',
    status: 'vermelho'
  },
  {
    data: '05/04/2021',
    classificacao: '1.1.2.02.0141',
    conta: '78',
    debito: '10',
    credito: '-',
    valor: 'R$ 647,71',
    historico: 'Pix Lairton Silveira Junior',
    nota: '574',
    cliente: '12676375000155',
    status: 'verde'
  },
  {
    data: '05/04/2021',
    classificacao: '1.1.2.02.9874',
    conta: '70',
    debito: '114',
    credito: '-',
    valor: 'R$ 6.984,71',
    historico: 'Pagamento Forncedores',
    nota: '89749',
    cliente: '77451003000176',
    status: 'vermelho'
  }
];

abrirModal(index: number) {
  this.lancamentoSelecionado = this.dadosLancamentos[index];
}
modalAberto = false;

abrirModalRegra() {
  this.modalAberto = true;
}

fecharModalRegra() {
  this.modalAberto = false;
}
}
