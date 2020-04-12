import { TestBed } from '@angular/core/testing';

import { ShopProfileService } from './shop-profile.service';

describe('ShopProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopProfileService = TestBed.get(ShopProfileService);
    expect(service).toBeTruthy();
  });
});
