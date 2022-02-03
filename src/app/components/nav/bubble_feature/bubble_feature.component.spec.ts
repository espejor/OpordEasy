/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Bubble_featureComponent } from './bubble_feature.component';

describe('Bubble_featureComponent', () => {
  let component: Bubble_featureComponent;
  let fixture: ComponentFixture<Bubble_featureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bubble_featureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bubble_featureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
