import { TestBed } from '@angular/core/testing';

import { CurrentShopProfileService } from './current-shop-profile.service';

describe('CurrentShopProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentShopProfileService = TestBed.get(CurrentShopProfileService);
    expect(service).toBeTruthy();
  });
});
