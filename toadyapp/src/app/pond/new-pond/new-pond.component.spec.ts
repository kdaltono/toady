import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPondComponent } from './new-pond.component';

describe('NewPondComponent', () => {
  let component: NewPondComponent;
  let fixture: ComponentFixture<NewPondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPondComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
