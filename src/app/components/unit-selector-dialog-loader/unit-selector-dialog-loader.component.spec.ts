import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSelectorDialogLoaderComponent } from './unit-selector-dialog-loader.component';

describe('UnitSelectorDialogLoaderComponent', () => {
  let component: UnitSelectorDialogLoaderComponent;
  let fixture: ComponentFixture<UnitSelectorDialogLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitSelectorDialogLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitSelectorDialogLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
