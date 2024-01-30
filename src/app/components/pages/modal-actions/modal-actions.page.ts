import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-modal-actions',
  templateUrl: './modal-actions.component.html',
  styleUrls: ['./modal-actions.component.scss'],
})
export class ModalActionsComponent implements OnInit {


  dataAtual = new Date().toISOString();

  index: number | null = null
  titulo!: string;
  data!: string;
  valor!: number;
  tipo!: number;

  movimentacoes!: IMovimentacao[];

  modal = false;
  modalDate = false;

  constructor(
    private financasService: FinancasService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
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

  excluir(index: number) {
    this.financasService.delete(index);
  }

  cancelar() {
    this.modalEdicao(false);
  }

}