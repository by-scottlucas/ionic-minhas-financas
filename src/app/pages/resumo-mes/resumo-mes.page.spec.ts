import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumoMesPage } from './resumo-mes.page';

describe('ResumoMesPage', () => {
  let component: ResumoMesPage;
  let fixture: ComponentFixture<ResumoMesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResumoMesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
