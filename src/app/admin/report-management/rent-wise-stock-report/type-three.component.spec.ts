import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeThreeComponent } from './type-three.component';

describe('TypeThreeComponent', () => {
  let component: TypeThreeComponent;
  let fixture: ComponentFixture<TypeThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
