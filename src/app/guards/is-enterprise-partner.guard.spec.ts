import { TestBed, async, inject } from '@angular/core/testing';

import { IsEnterprisePartnerGuard } from './is-enterprise-partner.guard';

describe('IsEnterprisePartnerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsEnterprisePartnerGuard]
    });
  });

  it('should ...', inject([IsEnterprisePartnerGuard], (guard: IsEnterprisePartnerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
