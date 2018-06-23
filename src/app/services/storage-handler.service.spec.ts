import { TestBed, inject } from '@angular/core/testing';

import { StorageHandlerService } from './storage-handler.service';

describe('StorageHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageHandlerService]
    });
  });

  it('should be created', inject([StorageHandlerService], (service: StorageHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
