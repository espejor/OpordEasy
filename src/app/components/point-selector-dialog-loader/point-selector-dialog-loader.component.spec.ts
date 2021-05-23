import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointSelectorDialogLoaderComponent } from './point-selector-dialog-loader.component';

describe('PointSelectorDialogLoaderComponent', () => {
  let component: PointSelectorDialogLoaderComponent;
  let fixture: ComponentFixture<PointSelectorDialogLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointSelectorDialogLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointSelectorDialogLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
