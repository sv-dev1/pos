import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitcategoryComponent } from './unitcategory.component';

describe('UnitcategoryComponent', () => {
  let component: UnitcategoryComponent;
  let fixture: ComponentFixture<UnitcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
