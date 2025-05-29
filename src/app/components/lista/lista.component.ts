import { Component } from '@angular/core';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent {

  public loaded = false;

  dataAtual = new Date().toISOString();

  search!: string;

  index: number | null = null
  titulo!: string;
  data!: string;
  valor!: number;
  tipo!: number;
  categoria!: number;

  movimentacoes!: IMovimentacao[];

  modal = false;
  modalDate = false;

  constructor(private financasService: FinancasService) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() {}

  searchInput(event: any) {

    this.search = event.target.value;

    if (this.search === '') {
      this.movimentacoes = this.financasService.movimentacoes;

    } else if (this.search.length !== this.movimentacoes[0].titulo.length) {
      alert("Nenhuma movimentação encontrada");
      this.search = '';

    } else {
      this.movimentacoes = this.financasService.movimentacoes.filter((movimentacao) => {
        return movimentacao.titulo.toLowerCase().includes(this.search.toLowerCase());
      });
    }

  }

  modalEdicao(open: boolean) {
    this.modal = open;
  }

  modalData(open: boolean) {
    this.modalDate = open;
  }

  selecionarData(): void {
    this.modalData(true);
  }

  salvarData(): void {

    const dataFormatada = this.dataAtual.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1');
    this.data = dataFormatada;


    if (this.data.length !== 0) {
      this.modalData(false);
    }
  }

  editar(movimentacao: IMovimentacao): void {
    this.index = this.movimentacoes.indexOf(movimentacao);
    this.titulo = movimentacao.titulo;
    this.data = movimentacao.data;
    this.valor = movimentacao.valor;
    this.tipo = movimentacao.tipo;
    this.categoria = movimentacao.categoria;

    this.modalEdicao(true);
  }

  salvarEdicao(): void {

    if (this.index !== null && this.titulo) {
      this.financasService.update(this.index, this.titulo, this.data, this.valor, this.tipo, this.categoria);
    }
    this.modalEdicao(false);

  }

  excluir(index: number) {
    this.financasService.delete(index);
  }

  cancelar() {
    this.modalEdicao(false);
  }

}
