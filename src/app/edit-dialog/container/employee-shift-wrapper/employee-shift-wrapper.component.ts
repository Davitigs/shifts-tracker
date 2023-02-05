import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditItemInterface, EmployeesModel } from '../../../../models/employees.model';
import { Shift, ShiftsModel } from '../../../../models/shifts.model';


@Component({
  selector: 'app-employee-shift-wrapper',
  templateUrl: './employee-shift-wrapper.component.html',
  styleUrls: ['./employee-shift-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeShiftWrapperComponent implements OnInit {

  @Input() employee: EditItemInterface;
  @Input() shifts: ShiftsModel[];
  @Output() emitEditedShifts: EventEmitter<Shift> = new EventEmitter<Shift>();
  @Output() emitEditedEmployees: EventEmitter<EmployeesModel> = new EventEmitter<EmployeesModel>();

  constructor() { }

  ngOnInit(): void {
  }

  getEditedShifts(ev: Shift): void {
    this.emitEditedShifts.emit(ev);
  }

  getEditedEmployee(ev: EmployeesModel): void {
    this.emitEditedEmployees.emit(ev);
  }

}
