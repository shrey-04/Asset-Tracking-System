import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutApplicationComponent } from './about-application.component';

describe('AboutApplicationComponent', () => {
  let component: AboutApplicationComponent;
  let fixture: ComponentFixture<AboutApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
