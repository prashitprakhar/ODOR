import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMyShopPage } from './partner-my-shop.page';

describe('PartnerMyShopPage', () => {
  let component: PartnerMyShopPage;
  let fixture: ComponentFixture<PartnerMyShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerMyShopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMyShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
