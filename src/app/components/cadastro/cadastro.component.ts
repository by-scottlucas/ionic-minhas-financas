import { Component, OnInit } from '@angular/core';
import { IMovimentacao } from 'src/app/models/IMovimentacao';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {

  dataAtual = new Date().toISOString();

  titulo!: string;
  data!: string;
  valor!: number;
  tipo!: number;
  categoria!: number;

  movimentacoes!: IMovimentacao[];

  modalDate = false;

  constructor() { }

  ngOnInit() { }


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

}
