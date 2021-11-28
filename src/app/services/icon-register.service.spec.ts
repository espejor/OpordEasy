/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IconRegisterService } from './icon-register.service';

describe('Service: IconRegister', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IconRegisterService]
    });
  });

  it('should ...', inject([IconRegisterService], (service: IconRegisterService) => {
    expect(service).toBeTruthy();
  }));
});
