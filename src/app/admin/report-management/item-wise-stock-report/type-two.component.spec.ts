import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeTwoComponent } from './type-two.component';

describe('TypeTwoComponent', () => {
  let component: TypeTwoComponent;
  let fixture: ComponentFixture<TypeTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
