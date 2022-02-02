import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondListComponent } from './pond-list.component';

describe('PondListComponent', () => {
  let component: PondListComponent;
  let fixture: ComponentFixture<PondListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
