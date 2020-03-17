import { TestBed } from '@angular/core/testing';

import { CartUtilityService } from './cart-utility.service';

describe('CartUtilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CartUtilityService = TestBed.get(CartUtilityService);
    expect(service).toBeTruthy();
  });
});
