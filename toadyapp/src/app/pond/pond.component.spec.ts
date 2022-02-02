import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondComponent } from './pond.component';

describe('PondComponent', () => {
  let component: PondComponent;
  let fixture: ComponentFixture<PondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
