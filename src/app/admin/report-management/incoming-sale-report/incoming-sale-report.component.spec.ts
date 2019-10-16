import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingSaleReportComponent } from './incoming-sale-report.component';

describe('IncomingSaleReportComponent', () => {
  let component: IncomingSaleReportComponent;
  let fixture: ComponentFixture<IncomingSaleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingSaleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
