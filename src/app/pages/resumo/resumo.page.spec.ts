import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumoPage } from './resumo.page';

describe('ResumoPage', () => {
  let component: ResumoPage;
  let fixture: ComponentFixture<ResumoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResumoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
