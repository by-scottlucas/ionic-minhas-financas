import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdvancedFilterComponent } from './advanced-filter.component';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  @Input() enableAdvancedFilter = true;

  @Output() search = new EventEmitter<string>();
  @Output() filterApplied = new EventEmitter<any>();

  searchTerm: string = '';

  constructor(private modalCtrl: ModalController) {}

  onSearchChange(event: any) {
    this.search.emit(event.detail.value);
  }

  async openAdvancedFilter() {
    if (!this.enableAdvancedFilter) return;

    const modal = await this.modalCtrl.create({
      component: AdvancedFilterComponent,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.filterApplied.emit(result.data);
      }
    });

    await modal.present();
  }
}
