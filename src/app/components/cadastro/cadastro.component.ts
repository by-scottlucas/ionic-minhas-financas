import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonAlert } from '@ionic/angular';
import { IMovimentacao } from 'src/app/models/IMovimentacao';
import { FinancasService } from 'src/app/services/financas.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {

  dataAtual = new Date().toISOString();

  titulo!: string;
  data: string = "dd/mm/yyyy";
  valor: number | null = null;
  tipo: number | null = null;
  categoria: number | null = null;

  movimentacoes!: IMovimentacao[];

  modal = false;
  modalDate = false;

  constructor(
    private router: Router,
    private financasService: FinancasService,
    private alert: AlertController
  ) {
    this.movimentacoes = this.financasService.movimentacoes;
  }

  ngOnInit() { }

  setOpen(open: boolean) {
    this.modal = open;
  }

  modalData(open: boolean) {
    this.modalDate = open;
  }

  selecionarData(): void {
    this.modalData(true);
  }

  salvarData(): void {

    const dataFormatada = this.dataAtual.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1');
    this.data = dataFormatada;


    if (this.data.length !== 0) {
      this.modalData(false);
    }
  }

  cadastrar() {

    if (this.titulo && this.data && this.valor && this.tipo && this.categoria) {

      const dataFormatada = this.data.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1');

      this.financasService.create(this.titulo, dataFormatada, this.valor, this.tipo, this.categoria);

      this.limparInputs();
      this.setOpen(false);

      this.alert.create({
        message: 'Movimentação registrada com sucesso!',
        buttons: ["Ok"]
      }).then(alert => alert.present());

    } else {
      alert('Por favor preencha todos os campos');
    }

  }

  cancelar() {
    this.limparInputs();
    this.setOpen(false);
  }

  limparInputs() {
    this.titulo = '';
    this.data = "dd/mm/yyyy";
    this.valor = null;
    this.tipo = null;
    this.categoria = null;
  }
}
