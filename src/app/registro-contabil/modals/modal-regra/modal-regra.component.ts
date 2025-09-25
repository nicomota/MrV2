import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-regra',
  templateUrl: './modal-regra.component.html',
  styleUrls: ['./modal-regra.component.scss']
})
export class ModalRegraComponent implements OnInit {
  @Input() modalAberto: boolean = false;
  @Input() modoAssociacaoConta: boolean = false;
  @Input() lancamentoSelecionadoIndex: number | null = null;
  @Input() dadosLancamentos: any[] = [];
  @Input() contaContabilInput: string = '';
  @Input() historicoInput: string = '';

  @Output() fecharModal = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  fecharModalRegra(): void {
    this.fecharModal.emit();
  }

  getDataLancamentoSelecionado(): string {
    if (this.lancamentoSelecionadoIndex !== null) {
      return this.dadosLancamentos[this.lancamentoSelecionadoIndex]?.data || '';
    }
    return '';
  }

  getValorLancamentoSelecionado(): string {
    if (this.lancamentoSelecionadoIndex !== null) {
      return this.dadosLancamentos[this.lancamentoSelecionadoIndex]?.valor || '';
    }
    return '';
  }
}
