import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-investimentos',
  templateUrl: './investimentos.page.html',
  styleUrls: ['./investimentos.page.scss'],
})
export class InvestimentosPage implements OnInit {

  search!: string;
  
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

}
