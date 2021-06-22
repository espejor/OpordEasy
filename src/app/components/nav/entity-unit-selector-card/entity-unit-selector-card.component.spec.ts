import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityUnitSelectorCardComponent } from './entity-unit-selector-card.component';

describe('EntityFavoriteCardComponent', () => {
  let component: EntityUnitSelectorCardComponent;
  let fixture: ComponentFixture<EntityUnitSelectorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityUnitSelectorCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityUnitSelectorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
