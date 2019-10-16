import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCategoryMeasurementComponent } from './unit-category-measurement.component';

describe('UnitCategoryMeasurementComponent', () => {
  let component: UnitCategoryMeasurementComponent;
  let fixture: ComponentFixture<UnitCategoryMeasurementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitCategoryMeasurementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitCategoryMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
