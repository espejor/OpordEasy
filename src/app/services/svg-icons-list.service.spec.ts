import { TestBed } from '@angular/core/testing';

import { SvgIconsListService } from './svg-icons-list.service';

describe('SvgIconsListService', () => {
  let service: SvgIconsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvgIconsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
