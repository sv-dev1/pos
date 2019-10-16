import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HigestSellingReportComponent } from './higest-selling-report.component';

describe('HigestSellingReportComponent', () => {
  let component: HigestSellingReportComponent;
  let fixture: ComponentFixture<HigestSellingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HigestSellingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HigestSellingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
