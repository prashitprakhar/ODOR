import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerAddProductsPage } from './partner-add-products.page';

describe('PartnerAddProductsPage', () => {
  let component: PartnerAddProductsPage;
  let fixture: ComponentFixture<PartnerAddProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerAddProductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerAddProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
