import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRoleComponent } from './approve-role.component';

describe('ApproveRoleComponent', () => {
  let component: ApproveRoleComponent;
  let fixture: ComponentFixture<ApproveRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
