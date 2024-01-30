import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
=======
>>>>>>> parent of 9ee7fea (Corrigindo bugs no SearchBar)
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  public loaded = false;

  dataAtual = new Date().toISOString();

  index: number | null = null
  titulo!: string;
  data!: string;
  valor!: number;
  tipo!: number;


  search!: string;

  movimentacoes!: IMovimentacao[];

<<<<<<< HEAD
  constructor(
    private financasService: FinancasService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
=======
  search: string = '';
  resultado;

  modal = false;
  modalDate = false;

  constructor(private financasService: FinancasService) {
>>>>>>> parent of 9ee7fea (Corrigindo bugs no SearchBar)
    this.movimentacoes = this.financasService.movimentacoes;
    this.resultado = this.movimentacoes;
  }

  ngOnInit() { }

  searchInput(event: any) {
    this.search = event.target.value;
    this.resultado = this.movimentacoes.filter((movimentacao) => {
      return movimentacao.titulo.toLowerCase().includes(this.search.toLowerCase());
    })
  }

  editar(movimentacao: IMovimentacao): void {
    this.index = this.movimentacoes.indexOf(movimentacao);
    this.titulo = movimentacao.titulo;
    this.data = movimentacao.data;
    this.valor = movimentacao.valor;
    this.tipo = movimentacao.tipo;

<<<<<<< HEAD
    this.router.navigate(['/modal-actions'])
=======
    this.modalEdicao(true);
  }

  salvarEdicao(): void {

    if (this.index !== null && this.titulo) {
      this.financasService.update(this.index, this.titulo, this.data, this.valor, this.tipo);
    }
    this.modalEdicao(false);

  }

  excluir(index: number): void {
    this.financasService.delete(index);
  }

  cancelar() {
    this.modalEdicao(false);
>>>>>>> parent of 9ee7fea (Corrigindo bugs no SearchBar)
  }

}
