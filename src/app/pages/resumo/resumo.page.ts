import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-resumo',
  templateUrl: './resumo.page.html',
  styleUrls: ['./resumo.page.scss'],
})
export class ResumoPage implements OnInit {

  movimentacoes: IMovimentacao[] = [];

  constructor(private financasService: FinancasService, private router: Router) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() { }


  // janeiro() {
  //   alert("Janeiro!!");
  //   this.router.navigate(["/resumo-mes"]);
  // }

}