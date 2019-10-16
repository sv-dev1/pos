import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldPopupComponent } from './hold-popup.component';

describe('HoldPopupComponent', () => {
  let component: HoldPopupComponent;
  let fixture: ComponentFixture<HoldPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
