import { TestBed } from '@angular/core/testing';

import { CommonUtilityService } from './common-utility.service';

describe('CommonUtilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonUtilityService = TestBed.get(CommonUtilityService);
    expect(service).toBeTruthy();
  });
});
