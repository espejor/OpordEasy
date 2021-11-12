import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineSelectorDialogLoaderComponent } from './line-selector-dialog-loader.component';

describe('LineSelectorDialogLoaderComponent', () => {
  let component: LineSelectorDialogLoaderComponent;
  let fixture: ComponentFixture<LineSelectorDialogLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineSelectorDialogLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineSelectorDialogLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
