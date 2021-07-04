import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPhaseDialogComponent } from './new-phase-dialog.component';

describe('NewPhaseDialogComponent', () => {
  let component: NewPhaseDialogComponent;
  let fixture: ComponentFixture<NewPhaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPhaseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPhaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
