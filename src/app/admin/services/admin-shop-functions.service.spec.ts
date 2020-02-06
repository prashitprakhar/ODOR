import { TestBed } from '@angular/core/testing';

import { AdminShopFunctionsService } from './admin-shop-functions.service';

describe('AdminShopAdditionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminShopFunctionsService = TestBed.get(AdminShopFunctionsService);
    expect(service).toBeTruthy();
  });
});
