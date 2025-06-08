import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { AdvancedFilterComponent } from './advanced-filter.component';
import {
  MOCK_FILTERS_APPLY,
  MOCK_FILTERS_CLEAR,
  MOCK_FILTERS_INITIAL,
  MOCK_FILTERS_RESET,
} from './testing/advanced-filter.mock';

describe('AdvancedFilterComponent', () => {
  let component: AdvancedFilterComponent;
  let fixture: ComponentFixture<AdvancedFilterComponent>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AdvancedFilterComponent],
      imports: [ReactiveFormsModule, FormsModule, IonicModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalCtrlSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form with current filters on init', () => {
    const filters = MOCK_FILTERS_INITIAL;

    component.currentFilters = filters;
    component.ngOnInit();

    expect(component.form.value).toEqual(filters);
  });

  it('should emit apply event and dismiss modal on apply', () => {
    spyOn(component.apply, 'emit');

    component.form.setValue(MOCK_FILTERS_APPLY);
    component.onApplyFilters();

    expect(component.apply.emit).toHaveBeenCalledWith(component.form.value);
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith(component.form.value);
  });

  it('should reset form, emit cleared, and dismiss modal on clearFilters()', () => {
    spyOn(component.cleared, 'emit');

    component.form.setValue(MOCK_FILTERS_CLEAR);
    component.clearFilters();

    expect(component.form.value).toEqual(MOCK_FILTERS_RESET);

    expect(component.cleared.emit).toHaveBeenCalled();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith(null);
  });

  it('should dismiss modal without data on dismiss()', () => {
    component.dismiss();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalled();
  });
});
