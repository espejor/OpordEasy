import { TestBed } from '@angular/core/testing';

import { EntitySelectorService } from './entity-selector.service';

describe('EntitySelectorService', () => {
  let service: EntitySelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntitySelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
