import { Component, OnInit } from '@angular/core';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-resumo-mes',
  templateUrl: './resumo-mes.page.html',
  styleUrls: ['./resumo-mes.page.scss'],
})
export class ResumoMesPage implements OnInit {

  saldo: number = 0;
  gastos: number = 0;
  search!: string;

  movimentacoes!: IMovimentacao[];

  constructor(private financasService: FinancasService) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() { }

  searchInput(event: any) {
    this.search = event.target.value.trim().toLowerCase();

    if (this.search === '') {
      this.movimentacoes = this.financasService.movimentacoes;
    } else {
      const filtroMovimentacoes = this.financasService.movimentacoes.filter((movimentacao) => {
        return movimentacao.titulo.toLowerCase().includes(this.search);
      });

      if (filtroMovimentacoes.length === 0) {
        alert("Nenhuma movimentação encontrada");
        this.search = '';
      } else {
        this.movimentacoes = filtroMovimentacoes;
      }
    }
  }

  obterSaldo() {

    this.saldo = this.movimentacoes
      .filter(movimentacao => movimentacao.tipo == 2)
      .reduce((total, movimentacao) => total + movimentacao.valor, 0);
    return true;
  }

  obterGastos() {

    this.gastos = this.movimentacoes
      .filter(movimentacao => movimentacao.tipo == 1)
      .reduce((total, movimentacao) => total + movimentacao.valor, 0);
    return true;
  }

}