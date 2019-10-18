import { TestBed } from '@angular/core/testing';

import { CustomOrderService } from './custom-order.service';

describe('CustomOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomOrderService = TestBed.get(CustomOrderService);
    expect(service).toBeTruthy();
  });
});
