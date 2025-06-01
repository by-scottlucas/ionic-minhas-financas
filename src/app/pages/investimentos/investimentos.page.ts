import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-investimentos',
  templateUrl: './investimentos.page.html',
  styleUrls: ['./investimentos.page.scss'],
})
export class InvestimentosPage {
  search!: string;

  movimentacoes!: IMovimentacao[];

  constructor(
    private financasService: FinancasService,
    private router: Router
  ) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  searchInput(event: any) {
    this.search = event.target.value.trim().toLowerCase();

    if (this.search === '') {
      this.movimentacoes = this.financasService.movimentacoes;
    } else {
      const filtroMovimentacoes = this.financasService.movimentacoes.filter(
        (movimentacao) => {
          return movimentacao.titulo.toLowerCase().includes(this.search);
        }
      );

      if (filtroMovimentacoes.length === 0) {
        alert('Nenhuma movimentação encontrada');
        this.search = '';
      } else {
        this.movimentacoes = filtroMovimentacoes;
      }
    }
  }
}
