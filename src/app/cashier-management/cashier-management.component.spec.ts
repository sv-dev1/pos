import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierManagementComponent } from './cashier-management.component';

describe('CashierManagementComponent', () => {
  let component: CashierManagementComponent;
  let fixture: ComponentFixture<CashierManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
