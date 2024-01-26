import { Component, OnInit } from '@angular/core';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  public loaded = false;

  dataAtual = new Date().toISOString();

  index: number | null = null
  titulo!: string;
  data!: string;
  valor!: number;
  tipo!: number;

  movimentacoes!: IMovimentacao[];

  modal = false;
  modalDate = false;

  constructor(private financasService: FinancasService) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() { }

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

    this.modalEdicao(true);
  }

  salvarEdicao(): void {

    if (this.index !== null && this.titulo) {
      this.financasService.update(this.index, this.titulo, this.data, this.valor, this.tipo);
    }
    this.modalEdicao(false);

  }

  excluir(index: number): void {
    this.financasService.delete(index);
  }

  formatarData(event: any): void {
    let input = event.target.value;

    // Remover caracteres não numéricos
    input = input.replace(/\D/g, '');

    // Adicionar a máscara
    if (input.length <= 2) {
      this.data = input;
    } else if (input.length <= 4) {
      this.data = `${input.substring(0, 2)}/${input.substring(2)}`;
    } else if (input.length <= 8) {
      this.data = `${input.substring(0, 2)}/${input.substring(2, 4)}/${input.substring(4, 8)}`;
    } else {
      // Lidar com entrada maior que 8 caracteres (opcional)
      input = input.substring(0, 8);
      this.data = `${input.substring(0, 2)}/${input.substring(2, 4)}/${input.substring(4, 8)}`;
    }
  }

}
