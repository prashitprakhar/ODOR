import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewShopPage } from './add-new-shop.page';

describe('AddNewShopPage', () => {
  let component: AddNewShopPage;
  let fixture: ComponentFixture<AddNewShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewShopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
