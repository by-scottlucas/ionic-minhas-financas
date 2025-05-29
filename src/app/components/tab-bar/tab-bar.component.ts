import { Component } from '@angular/core';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent {
  tabs = [
    {
      page: 'home',
      label: 'Carteira',
      icon: 'wallet-outline',
    },
    {
      page: 'cards',
      label: 'Cartões',
      icon: 'card-outline',
    },
    {
      page: 'investments',
      label: 'Investimentos',
      icon: 'stats-chart-outline',
    },
    {
      page: 'profile',
      label: 'Perfil',
      icon: 'person-outline',
    },
  ];
}
