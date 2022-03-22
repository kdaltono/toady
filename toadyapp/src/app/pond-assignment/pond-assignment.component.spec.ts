import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondAssignmentComponent } from './pond-assignment.component';

describe('PondAssignmentComponent', () => {
  let component: PondAssignmentComponent;
  let fixture: ComponentFixture<PondAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
