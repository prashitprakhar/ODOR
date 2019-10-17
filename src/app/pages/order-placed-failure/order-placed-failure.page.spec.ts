import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlacedFailurePage } from './order-placed-failure.page';

describe('OrderPlacedFailurePage', () => {
  let component: OrderPlacedFailurePage;
  let fixture: ComponentFixture<OrderPlacedFailurePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPlacedFailurePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlacedFailurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
