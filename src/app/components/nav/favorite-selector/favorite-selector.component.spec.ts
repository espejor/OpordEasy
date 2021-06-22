import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteSelectorComponent } from './favorite-selector.component';

describe('FavoriteSelectorComponent', () => {
  let component: FavoriteSelectorComponent;
  let fixture: ComponentFixture<FavoriteSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
