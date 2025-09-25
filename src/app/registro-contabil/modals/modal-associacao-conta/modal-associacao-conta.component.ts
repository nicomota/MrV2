import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-associacao-conta',
  templateUrl: './modal-associacao-conta.component.html',
  styleUrls: ['./modal-associacao-conta.component.scss']
})
export class ModalAssociacaoContaComponent implements OnInit {
  @Input() modalAberto: boolean = false;
  @Input() lancamentoSelecionadoIndex: number | null = null;
  @Input() dadosLancamentos: any[] = [];
  @Input() contaContabilInput: string = '';
  @Input() historicoInput: string = '';

  @Output() fecharModalEvento = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  fecharModal(): void {
    this.fecharModalEvento.emit();
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
