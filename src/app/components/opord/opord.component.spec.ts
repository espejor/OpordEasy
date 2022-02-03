import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpordComponent } from './opord.component';

describe('OpordComponent', () => {
  let component: OpordComponent;
  let fixture: ComponentFixture<OpordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
