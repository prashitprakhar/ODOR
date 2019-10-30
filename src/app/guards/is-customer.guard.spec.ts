import { TestBed, async, inject } from '@angular/core/testing';

import { IsCustomerGuard } from './is-customer.guard';

describe('IsCustomerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsCustomerGuard]
    });
  });

  it('should ...', inject([IsCustomerGuard], (guard: IsCustomerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
