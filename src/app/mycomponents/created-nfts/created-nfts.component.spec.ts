import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedNftsComponent } from './created-nfts.component';

describe('CreatedNftsComponent', () => {
  let component: CreatedNftsComponent;
  let fixture: ComponentFixture<CreatedNftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedNftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedNftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
