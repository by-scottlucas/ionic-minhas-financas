import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BalanceHeaderComponent } from './balance-header.component';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import {
  CommonModule,
  CurrencyPipe,
  registerLocaleData,
} from '@angular/common';
import localePt from '@angular/common/locales/pt';

describe('BalanceHeaderComponent', () => {
  let component: BalanceHeaderComponent;
  let fixture: ComponentFixture<BalanceHeaderComponent>;

  beforeAll(() => {
    registerLocaleData(localePt);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [CurrencyPipe],
      declarations: [BalanceHeaderComponent],
      imports: [IonicModule.forRoot(), CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceHeaderComponent);
    component = fixture.componentInstance;

    component.balanceTitle = 'Saldo';
    component.balanceValue = 500;
    component.balanceIcon = 'cash-outline';
    component.firstTitle = 'Entradas';
    component.firstValue = 1000;
    component.firstValuePositive = true;
    component.secondTitle = 'Saídas';
    component.secondValue = 500;
    component.secondValuePositive = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all balance values and titles correctly', () => {
    const balanceTitleEl = fixture.debugElement.query(
      By.css('.balance-title')
    ).nativeElement;
    const balanceValueEl = fixture.debugElement.query(
      By.css('.balance-value')
    ).nativeElement;

    const transactionTitles = fixture.debugElement.queryAll(
      By.css('.transaction-title')
    );
    const transactionValues = fixture.debugElement.queryAll(
      By.css('.transaction-value')
    );

    expect(balanceTitleEl.textContent).toContain('Saldo');
    expect(balanceValueEl.textContent).toContain('R$');

    expect(transactionTitles[0].nativeElement.textContent).toContain(
      'Entradas'
    );
    expect(transactionTitles[1].nativeElement.textContent).toContain('Saídas');

    expect(transactionValues[0].nativeElement.textContent).toContain('R$');
    expect(transactionValues[1].nativeElement.textContent).toContain('R$');
  });

  it('should apply correct classes based on value positivity', () => {
    const balanceValueEl = fixture.debugElement.query(
      By.css('.balance-value')
    ).nativeElement;
    const firstValueEl = fixture.debugElement.queryAll(
      By.css('.transaction-value')
    )[0].nativeElement;
    const secondValueEl = fixture.debugElement.queryAll(
      By.css('.transaction-value')
    )[1].nativeElement;

    expect(balanceValueEl.classList).toContain('positive-value');
    expect(firstValueEl.classList).toContain('positive-value');
    expect(secondValueEl.classList).toContain('negative-value');
  });
});
