import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOneComponent } from './type-one.component';

describe('TypeOneComponent', () => {
  let component: TypeOneComponent;
  let fixture: ComponentFixture<TypeOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
