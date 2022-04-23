import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundPageComponent } from './background-page.component';

describe('BackgroundPageComponent', () => {
  let component: BackgroundPageComponent;
  let fixture: ComponentFixture<BackgroundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
