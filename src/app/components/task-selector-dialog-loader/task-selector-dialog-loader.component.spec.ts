/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaskSelectorDialogLoaderComponent } from './task-selector-dialog-loader.component';

describe('TaskSelectorDialogLoaderComponent', () => {
  let component: TaskSelectorDialogLoaderComponent;
  let fixture: ComponentFixture<TaskSelectorDialogLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSelectorDialogLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSelectorDialogLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
