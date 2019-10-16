import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingRentedReportComponent } from './incoming-rented-report.component';

describe('IncomingRentedReportComponent', () => {
  let component: IncomingRentedReportComponent;
  let fixture: ComponentFixture<IncomingRentedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingRentedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingRentedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
