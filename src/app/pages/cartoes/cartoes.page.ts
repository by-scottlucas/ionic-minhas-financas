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

  search!: string;
  imagem = "../../../assets/card1.png";

  movimentacoes!: IMovimentacao[];

  constructor(private financasService: FinancasService, private router: Router) {
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

}
