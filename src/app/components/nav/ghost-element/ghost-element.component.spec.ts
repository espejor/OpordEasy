/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GhostElementComponent } from './ghost-element.component';

describe('GhostElementComponent', () => {
  let component: GhostElementComponent;
  let fixture: ComponentFixture<GhostElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhostElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
