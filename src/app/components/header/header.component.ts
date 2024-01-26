import { Component, OnInit } from '@angular/core';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  saldo: number = 0;
  gastos: number = 0;

  movimentacoes!: IMovimentacao[];

  constructor(private financasService: FinancasService) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() { }

  obterSaldo() {

    return this.movimentacoes.reduce((total, movimentacao) => total + movimentacao.valor, 0);

  }

  obterGastos() {

    return this.movimentacoes.reduce((total, movimentacao) => total + movimentacao.valor, 0);

  }
}
