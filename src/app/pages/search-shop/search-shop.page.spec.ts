import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchShopPage } from './search-shop.page';

describe('SearchShopPage', () => {
  let component: SearchShopPage;
  let fixture: ComponentFixture<SearchShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchShopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
