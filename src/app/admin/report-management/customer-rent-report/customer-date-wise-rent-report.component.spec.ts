import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDateWiseRentReportComponent } from './customer-date-wise-rent-report.component';

describe('CustomerDateWiseRentReportComponent', () => {
  let component: CustomerDateWiseRentReportComponent;
  let fixture: ComponentFixture<CustomerDateWiseRentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDateWiseRentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDateWiseRentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
