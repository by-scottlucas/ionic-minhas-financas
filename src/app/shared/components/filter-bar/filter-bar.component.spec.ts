import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';

import { FilterBarComponent } from './filter-bar.component';

describe('FilterBarComponent', () => {
  let component: FilterBarComponent;
  let fixture: ComponentFixture<FilterBarComponent>;
  let modalController: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    const modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create',
    ]);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [FilterBarComponent],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    modalController = TestBed.inject(
      ModalController
    ) as jasmine.SpyObj<ModalController>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search term after debounce', fakeAsync(() => {
    spyOn(component.search, 'emit');
    const event = { detail: { value: 'test' } };

    component.onSearchChange(event);
    tick(300);

    expect(component.search.emit).toHaveBeenCalledWith('test');
  }));

  it('should unsubscribe from search on destroy', () => {
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['searchSubscription'] = subscription;

    component.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should not open advanced filter if disabled', async () => {
    component.enableAdvancedFilter = false;

    await component.openAdvancedFilter();

    expect(modalController.create).not.toHaveBeenCalled();
  });

  it('should open advanced filter and emit filterApplied with result', async () => {
    const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', [
      'present',
      'onDidDismiss',
    ]);
    modalSpy.onDidDismiss.and.returnValue(
      Promise.resolve({ data: { year: 2024 } })
    );

    modalController.create.and.returnValue(Promise.resolve(modalSpy as any));
    spyOn(component.filterApplied, 'emit');

    await component.openAdvancedFilter();

    expect(component.advancedFilters).toEqual({ year: 2024 });
    expect(component.filterApplied.emit).toHaveBeenCalledWith({ year: 2024 });
  });

  it('should reset filters if modal returns null', async () => {
    const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', [
      'present',
      'onDidDismiss',
    ]);
    modalSpy.onDidDismiss.and.returnValue(Promise.resolve({ data: null }));

    modalController.create.and.returnValue(Promise.resolve(modalSpy as any));
    spyOn(component.filterApplied, 'emit');

    component['advancedFilters'] = { year: 2024 };

    await component.openAdvancedFilter();

    expect(component.advancedFilters).toEqual({});
    expect(component.filterApplied.emit).toHaveBeenCalledWith(null);
  });

  it('should return count of non-empty filters', () => {
    component['advancedFilters'] = {
      year: 2024,
      month: null,
      category: undefined,
      type: '',
      paymentMethod: PaymentMethodEnum.CREDIT_CARD,
    };

    expect(component.appliedFiltersCount).toBe(2);
  });
});
