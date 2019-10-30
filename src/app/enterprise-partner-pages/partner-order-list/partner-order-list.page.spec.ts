import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerOrderListPage } from './partner-order-list.page';

describe('PartnerOrderListPage', () => {
  let component: PartnerOrderListPage;
  let fixture: ComponentFixture<PartnerOrderListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerOrderListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerOrderListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
