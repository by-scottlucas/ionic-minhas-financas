import { Injectable } from '@angular/core';
import { IMovimentacao } from '../models/IMovimentacao';
import { StorageService } from './storage.service';

const movimentacoesStorageKey = "Movimentacoes";

@Injectable({
  providedIn: 'root'
})
export class FinancasService {

  movimentacoes: IMovimentacao[] = [];

  constructor(private storageService: StorageService) {
    this.movimentacoes = this.storageService.getData(movimentacoesStorageKey) || [];
  }

  private save(): void {
    try {
      this.storageService.setData(movimentacoesStorageKey, this.movimentacoes);
    } catch (error) {
      console.log('Não foi possível salvar o evento. Erro: ', error);
    }
  }

  create(titulo: string, data: string, valor: number, tipo: number): void {
    const novaMovimentacao: IMovimentacao = { titulo, data, valor, tipo };
    this.movimentacoes.unshift(novaMovimentacao);
    this.save();
  }

  read(index: number): IMovimentacao {
    return this.movimentacoes[index];
  }

  update(index: number, titulo: string, data: string, valor: number, tipo: number): void {
    if (index >= 0 && this.movimentacoes.length) {
      this.movimentacoes[index] = { titulo, data, valor, tipo };
      this.save();
    }
  }

  delete(index: number): void {
    this.movimentacoes.splice(index, 1);
    this.save();
  }
}
