import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegeMasterComponent } from './privilege-master.component';

describe('PrivilegeMasterComponent', () => {
  let component: PrivilegeMasterComponent;
  let fixture: ComponentFixture<PrivilegeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivilegeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
