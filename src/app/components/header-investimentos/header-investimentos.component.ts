import { Component, OnInit } from '@angular/core';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-header-investimentos',
  templateUrl: './header-investimentos.component.html',
  styleUrls: ['./header-investimentos.component.scss'],
})
export class HeaderInvestimentosComponent implements OnInit {

  saldo: number = 0;
  gastos: number = 0;

  movimentacoes!: IMovimentacao[];

  constructor(private financasService: FinancasService) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() { }

  obterSaldo() {

    this.saldo = this.movimentacoes
      .filter(movimentacao => movimentacao.tipo == 2 && movimentacao.categoria == 2)
      .reduce((total, movimentacao) => total + movimentacao.valor, 0);
    return true;
  }

  obterGastos() {

    this.gastos = this.movimentacoes
      .filter(movimentacao => movimentacao.tipo == 1 && movimentacao.categoria == 2)
      .reduce((total, movimentacao) => total + movimentacao.valor, 0);
    return true;
  }

}
