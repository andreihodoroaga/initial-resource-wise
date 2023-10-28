import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorPageComponent } from './donor-page.component';

describe('DonorPageComponent', () => {
  let component: DonorPageComponent;
  let fixture: ComponentFixture<DonorPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DonorPageComponent]
    });
    fixture = TestBed.createComponent(DonorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
