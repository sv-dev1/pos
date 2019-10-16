import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProductListComponent } from './group-product-list.component';

describe('GroupProductListComponent', () => {
  let component: GroupProductListComponent;
  let fixture: ComponentFixture<GroupProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
