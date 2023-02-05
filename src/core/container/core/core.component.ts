import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';

import { EmployeesService } from '../../../_api/employees.service';
import { ShiftsService } from '../../../_api/shifts.service';
import { EditDialogComponent } from '../../../app/edit-dialog/edit-dialog.component';
import { EmployeesModel } from '../../../models/employees.model';
import { ShiftsModel } from '../../../models/shifts.model';


import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit, OnDestroy {

  selectedServices$ = this.employeeService.selectedEmployees$;
  destroyed$$: Subject<void> = new Subject<void>();

  constructor(
    private employeeService: EmployeesService,
    private shiftsService: ShiftsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe();
    this.shiftsService.getShifts().subscribe();
  }

  openPopup(): void {
    this.dialog.open(EditDialogComponent, {
      minWidth: '60vw'
    }).afterClosed()
      .pipe(
        takeUntil(this.destroyed$$),
        filter(resp => !!resp),
        mergeMap(res => {
          const sections = [];
          if (res.employees) {
            sections.push(this.updateEmployees(res.employees));
          }
          if (res.shifts) {
            sections.push(this.updateShifts(res.shifts));
          }
          return combineLatest([...sections]);
        }),
        mergeMap(res => combineLatest([
          // Would be nice to do single updates here of the items that were updated, but now I am just getting them again
          this.shiftsService.getShifts(),
          this.employeeService.getEmployees()
        ]))
      ).subscribe(d => {
        this.snackBar.open('Bulk changes saved', 'close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          announcementMessage: 'Success',
          panelClass: 'success-text'
        });
    });
  }

  updateEmployees(employees: {[key: string]: EmployeesModel}): Observable<any> {
    const keys = Object.keys(employees);
    return combineLatest([...keys.map(key => this.employeeService.patchEmployee(employees[key]))]);
  }

  updateShifts(shifts: { [key: string]: Partial<ShiftsModel> }): Observable<any> {
    const keys = Object.keys(shifts);
    return combineLatest([...keys.map(key => this.shiftsService.patchShift(shifts[key]))]);
  }

  ngOnDestroy(): void {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

}
