import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackOrderPage } from './track-order.page';

describe('TrackOrderPage', () => {
  let component: TrackOrderPage;
  let fixture: ComponentFixture<TrackOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
