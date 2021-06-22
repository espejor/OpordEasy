import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSelectorComponent } from './recent-selector.component';

describe('RecentSelectorComponent', () => {
  let component: RecentSelectorComponent;
  let fixture: ComponentFixture<RecentSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
