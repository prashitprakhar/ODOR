import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverySchedulePage } from './delivery-schedule.page';

describe('DeliverySchedulePage', () => {
  let component: DeliverySchedulePage;
  let fixture: ComponentFixture<DeliverySchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverySchedulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverySchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
