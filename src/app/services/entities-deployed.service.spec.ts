import { TestBed } from '@angular/core/testing';

import { EntitiesDeployedService } from './entities-deployed.service';

describe('EntitiesDeployedService', () => {
  let service: EntitiesDeployedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntitiesDeployedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
