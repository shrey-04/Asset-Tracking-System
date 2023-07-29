import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPrivilegeComponent } from './assign-privilege.component';

describe('AssignPrivilegeComponent', () => {
  let component: AssignPrivilegeComponent;
  let fixture: ComponentFixture<AssignPrivilegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignPrivilegeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
