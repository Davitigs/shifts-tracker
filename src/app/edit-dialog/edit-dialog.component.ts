import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { EmployeesService } from '../../_api/employees.service';
import { ShiftsService } from '../../_api/shifts.service';
import { Shift, shiftPatchValue, ShiftsModel } from '../../models/shifts.model';
import { EmployeesModel } from '../../models/employees.model';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  selectedEmployees$ = this.employeeService.selectedEmployees$;
  shifts$ = this.shiftService.shifts$.pipe(map(sh => sh.entities));

  shiftsToEdit$$: BehaviorSubject<{ [key: string]: Partial<ShiftsModel> } | null> =
    new BehaviorSubject<{ [key: string]: Partial<ShiftsModel> } | null>(null);
  employeesToEdit$$: BehaviorSubject<{[key: string]: EmployeesModel} | null> =
    new BehaviorSubject<{[key: string]: EmployeesModel} | null>(null);
  isLoading$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  constructor(
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private employeeService: EmployeesService,
    private shiftService: ShiftsService
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    this.dialogRef.close({
      employees: this.employeesToEdit,
      shifts: this.shiftsToEdit
    });
  }

  get shiftsToEdit(): { [key: string]: Partial<ShiftsModel> } | null {
    return this.shiftsToEdit$$.getValue();
  }

  get employeesToEdit(): {[key: string]: EmployeesModel} | null {
    return this.employeesToEdit$$.getValue();
  }

  getEditedShifts(ev: Shift): void {
    const keys = Object.keys(ev);
    this.shiftsToEdit$$.next({
      ...this.shiftsToEdit$$.getValue(),
      ...keys.reduce((acc: { [key: string]: Partial<ShiftsModel> }, shiftKey: string) => {
        acc[ev[shiftKey].id] = shiftPatchValue(ev[shiftKey]);
        return acc;
      }, {})
    });
  }

  getEditedEmployee(ev: EmployeesModel): void {
    this.employeesToEdit$$.next({
      ...this.employeesToEdit,
      [ev.id]: ev
    });
  }

}
