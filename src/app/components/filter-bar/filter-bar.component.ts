import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TransactionDTO } from 'src/app/models/transaction.dto';

import { AdvancedFilterComponent } from './advanced-filter.component';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent implements OnInit, OnDestroy {
  @Input() data!: TransactionDTO;
  @Input() enableAdvancedFilter: boolean = true;
  @Output() search = new EventEmitter<string>();
  @Output() filterApplied = new EventEmitter<any>();

  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  advancedFilters: any = {};

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((term) => {
        this.search.emit(term || '');
      });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchChange(event: any) {
    const value = event.detail.value;
    this.searchSubject.next(value);
  }

  async openAdvancedFilter() {
    if (!this.enableAdvancedFilter) return;

    const modal = await this.modalCtrl.create({
      component: AdvancedFilterComponent,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
      componentProps: {
        currentFilters: this.advancedFilters,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data === null) {
        this.advancedFilters = {};
        this.filterApplied.emit(null);
      } else if (result.data) {
        this.advancedFilters = result.data;
        this.filterApplied.emit(result.data);
      }
    });

    await modal.present();
  }

  get appliedFiltersCount(): number {
    return Object.keys(this.advancedFilters || {}).filter(
      (key) =>
        this.advancedFilters[key] !== null &&
        this.advancedFilters[key] !== undefined &&
        this.advancedFilters[key] !== ''
    ).length;
  }
}
