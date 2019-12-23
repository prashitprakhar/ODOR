import { TestBed } from '@angular/core/testing';

import { AdminFunctionsService } from './admin-functions.service';

describe('AdminFunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminFunctionsService = TestBed.get(AdminFunctionsService);
    expect(service).toBeTruthy();
  });
});
