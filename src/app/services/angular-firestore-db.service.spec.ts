import { TestBed } from '@angular/core/testing';

import { AngularFirestoreDbService } from './angular-firestore-db.service';

describe('AngularFirestoreDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularFirestoreDbService = TestBed.get(AngularFirestoreDbService);
    expect(service).toBeTruthy();
  });
});
