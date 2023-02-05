import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeShiftWrapperComponent } from './employee-shift-wrapper.component';

describe('EmployeeShiftWrapperComponent', () => {
  let component: EmployeeShiftWrapperComponent;
  let fixture: ComponentFixture<EmployeeShiftWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeShiftWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeShiftWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
