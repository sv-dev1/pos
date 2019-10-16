import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierAddItemComponent } from './cashier-add-item.component';

describe('CashierAddItemComponent', () => {
  let component: CashierAddItemComponent;
  let fixture: ComponentFixture<CashierAddItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierAddItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierAddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
