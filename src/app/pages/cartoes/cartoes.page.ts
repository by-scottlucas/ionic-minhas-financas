import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-cartoes',
  templateUrl: './cartoes.page.html',
  styleUrls: ['./cartoes.page.scss'],
})
export class CartoesPage implements OnInit {

  saldo: number = 885;
  gastos: number = 0;

  search!: string;
  imagem = "https://2.bp.blogspot.com/-9qji2RliVpU/Wz4saQZV6JI/AAAAAAAAz6E/Mfxyx3NYfRQkz-JOCAOXpYiDY2u4TDG5ACLcBGAs/s1600/sodexo-meal-pass-card.png";

  movimentacoes!: IMovimentacao[];

  constructor(private financasService: FinancasService, private router: Router) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() { }

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
