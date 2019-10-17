import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomOrdersPage } from './add-custom-orders.page';

describe('AddCustomOrdersPage', () => {
  let component: AddCustomOrdersPage;
  let fixture: ComponentFixture<AddCustomOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomOrdersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
