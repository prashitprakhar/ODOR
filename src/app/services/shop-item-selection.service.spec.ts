import { TestBed } from '@angular/core/testing';

import { ShopItemSelectionService } from './shop-item-selection.service';

describe('ShopItemSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopItemSelectionService = TestBed.get(ShopItemSelectionService);
    expect(service).toBeTruthy();
  });
});
