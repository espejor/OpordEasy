/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UtmService } from './utm.service';

describe('Service: Utm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtmService]
    });
  });

  it('should ...', inject([UtmService], (service: UtmService) => {
    expect(service).toBeTruthy();
  }));
});
