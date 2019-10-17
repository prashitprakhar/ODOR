import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShopsPage } from './all-shops.page';

describe('AllShopsPage', () => {
  let component: AllShopsPage;
  let fixture: ComponentFixture<AllShopsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllShopsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllShopsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
