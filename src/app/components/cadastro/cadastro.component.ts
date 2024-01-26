import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {

  dataAtual = new Date().toISOString();

  titulo!: string;
  data: string = "dd/mm/yyyy";
  valor!: number;
  tipo!: number;

  movimentacoes!: IMovimentacao[];

  modal = false;
  modalDate = false;

  constructor(private router: Router, private financasService: FinancasService) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() { }

  setOpen(open: boolean) {
    this.modal = open;
  }

  cadastrar(): void {

    if (this.titulo && this.data && this.valor && this.tipo) {
      const dataFormatada = this.data.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1');

      this.financasService.create(this.titulo, dataFormatada, this.valor, this.tipo);

      this.setOpen(false);
      this.limparInputs();

      alert('Movimentação registrada com sucesso!');

    } else {
      alert('Por favor preencha todos os campos');
    }

  }

  limparInputs(): void {
    this.titulo;
    this.data = "dd/mm/yyyy";
    this.valor;
    this.tipo;
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

}
