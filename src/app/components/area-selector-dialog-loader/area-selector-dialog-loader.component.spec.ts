/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AreaSelectorDialogLoaderComponent } from './area-selector-dialog-loader.component';

describe('AreaSelectorDialogLoaderComponent', () => {
  let component: AreaSelectorDialogLoaderComponent;
  let fixture: ComponentFixture<AreaSelectorDialogLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaSelectorDialogLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSelectorDialogLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
