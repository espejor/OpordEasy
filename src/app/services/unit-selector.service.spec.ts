import { TestBed } from '@angular/core/testing';

import { UnitSelectorService } from './unit-selector.service';

describe('UnitSelectorService', () => {
  let service: UnitSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
