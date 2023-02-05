import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EditItemInterface, EmployeesModel } from '../../../../models/employees.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeComponent implements OnInit, OnDestroy {

  destroyed$$: Subject<void> = new Subject<void>();

  selectedEmployee: EditItemInterface;
  form: FormGroup;
  @Input() set employee(value: EditItemInterface) {
    this.selectedEmployee = value;
    this.form = this.fb.group({
      id: value.id,
      name: value.name,
      hourlyRate: value.hourlyRate,
      hourlyRateOvertime: value.hourlyRateOvertime
    });
  }

  @Output() emitEditedEmployee: EventEmitter<EmployeesModel> = new EventEmitter<EmployeesModel>();

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroyed$$)).subscribe(value => {
      const updatedValue = value;
      if (updatedValue.name !== this.selectedEmployee.name ||
        updatedValue.hourlyRate !== this.selectedEmployee.hourlyRate ||
        updatedValue.hourlyRateOvertime !== this.selectedEmployee.hourlyRateOvertime
      ){
        this.emitEditedEmployee.emit(this.form.value);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

}
