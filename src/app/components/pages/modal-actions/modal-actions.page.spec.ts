import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalActionsPage } from './modal-actions.page';

describe('ModalActionsPage', () => {
  let component: ModalActionsPage;
  let fixture: ComponentFixture<ModalActionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalActionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
