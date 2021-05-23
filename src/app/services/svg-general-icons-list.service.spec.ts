import { TestBed } from '@angular/core/testing';

import { SvgGeneralIconsListService } from './svg-general-icons-list.service';

describe('SvgGeneralIconsListService', () => {
  let service: SvgGeneralIconsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvgGeneralIconsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
