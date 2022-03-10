import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondSettingsComponent } from './pond-settings.component';

describe('PondSettingsComponent', () => {
  let component: PondSettingsComponent;
  let fixture: ComponentFixture<PondSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
