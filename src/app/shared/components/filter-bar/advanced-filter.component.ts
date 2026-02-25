import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  CATEGORY_SELECT_OPTIONS,
  PAYMENT_METHOD_SELECT_OPTIONS,
  TYPE_SELECT_OPTIONS,
} from 'src/app/shared/constants/select-options.constants';

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
export class AdvancedFilterComponent implements OnInit {
  @Input() currentFilters: any;
  @Output() apply = new EventEmitter<AdvancedFilterDTO>();
  @Output() cleared = new EventEmitter<void>();

  form: FormGroup;
  readonly months = MONTH_SELECT_OPTIONS;
  readonly years = YEAR_SELECT_OPTIONS;
  readonly types = TYPE_SELECT_OPTIONS;
  readonly categories = CATEGORY_SELECT_OPTIONS;
  readonly paymentMethods = PAYMENT_METHOD_SELECT_OPTIONS;

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

  ngOnInit() {
    if (this.currentFilters) {
      this.form.patchValue(this.currentFilters);
    }
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
    this.modalCtrl.dismiss(null);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
