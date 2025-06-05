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

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchChange(event: any) {
    if (!this.searchSubscription) {
      this.searchSubscription = this.searchSubject
        .pipe(debounceTime(300))
        .subscribe((term) => {
          this.search.emit(term);
        });
    }

    this.searchSubject.next(event.target.value);
  }

  async openAdvancedFilter() {
    if (!this.enableAdvancedFilter) return;

    const modal = await this.modalCtrl.create({
      component: AdvancedFilterComponent,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.filterApplied.emit(result.data);
      }
    });

    await modal.present();
  }
}
