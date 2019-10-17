import { TestBed } from '@angular/core/testing';

import { DeliveryTimeService } from './delivery-time.service';

describe('DeliveryTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryTimeService = TestBed.get(DeliveryTimeService);
    expect(service).toBeTruthy();
  });
});
