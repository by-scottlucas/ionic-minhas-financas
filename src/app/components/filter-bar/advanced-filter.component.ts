import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  CATEGORY_SELECT_OPTIONS,
  PAYMENT_METHOD_SELECT_OPTIONS,
  TYPE_SELECT_OPTIONS,
} from 'src/app/shared/shared/constants/select-options.constants';

import {
  MONTH_SELECT_OPTIONS,
  YEAR_SELECT_OPTIONS,
} from './constants/advanced-filter.constants';
import { AdvancedFilterDTO } from './models/advaced-filter.dto';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss'],
})
export class AdvancedFilterComponent {
  @Output() apply = new EventEmitter<AdvancedFilterDTO>();
  @Output() cleared = new EventEmitter<void>();

  form: FormGroup;
  months = MONTH_SELECT_OPTIONS;
  years = YEAR_SELECT_OPTIONS;
  types = TYPE_SELECT_OPTIONS;
  categories = CATEGORY_SELECT_OPTIONS;
  paymentMethods = PAYMENT_METHOD_SELECT_OPTIONS;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.form = this.formBuilder.group({
      month: [''],
      year: [''],
      type: [''],
      category: [''],
      paymentMethod: [''],
      minValue: [null],
      maxValue: [null],
    });
  }

  onApplyFilters() {
    if (this.form.valid) {
      this.apply.emit(this.form.value);
      this.modalCtrl.dismiss(this.form.value);
    }
  }

  clearFilters() {
    this.form.reset();
    this.cleared.emit();
    this.modalCtrl.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
