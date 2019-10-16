import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInformationsComponent } from './general-informations.component';

describe('GeneralInformationsComponent', () => {
  let component: GeneralInformationsComponent;
  let fixture: ComponentFixture<GeneralInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralInformationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
