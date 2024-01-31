import { Component, OnInit } from '@angular/core';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-resumo',
  templateUrl: './resumo.page.html',
  styleUrls: ['./resumo.page.scss'],
})
export class ResumoPage implements OnInit {

  movimentacoes: IMovimentacao[] = [];

  constructor(private financasService: FinancasService) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() { }

}