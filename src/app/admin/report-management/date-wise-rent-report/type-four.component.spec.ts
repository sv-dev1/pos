import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFourComponent } from './type-four.component';

describe('TypeFourComponent', () => {
  let component: TypeFourComponent;
  let fixture: ComponentFixture<TypeFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
