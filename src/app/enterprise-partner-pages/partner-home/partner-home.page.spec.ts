import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerHomePage } from './partner-home.page';

describe('PartnerHomePage', () => {
  let component: PartnerHomePage;
  let fixture: ComponentFixture<PartnerHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
