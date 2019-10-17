import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SomethingWentWrongPage } from './something-went-wrong.page';

describe('SomethingWentWrongPage', () => {
  let component: SomethingWentWrongPage;
  let fixture: ComponentFixture<SomethingWentWrongPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SomethingWentWrongPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SomethingWentWrongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
