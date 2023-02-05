import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';

import { AdminEmployeeData, EditItemInterface } from '../../models/employees.model';
import { EmployeesService } from '../../_api/employees.service';
import { ShiftsService } from '../../_api/shifts.service';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboardTable: MatTableDataSource<AdminEmployeeData>;
  displayedColumns = ['select', 'name', 'email', 'totalTime', 'totalRegularAmount', 'totalOvertimeAmount'];
  selection = new SelectionModel<AdminEmployeeData>(true, []);
  employeeState$ = this.employeeService.employeeState$;
  employeesCount$ = this.employeeState$.pipe(map(em => em.count));
  shifts$ = this.shiftsService.shifts$.pipe(map(sh => sh.shifts));
  mappedShifts$ = this.shiftsService.shifts$.pipe(map(sh => sh.mappedShifts));
  totalTime = 0;
  totalRegularAmount = 0;
  totalOvertimeAmount = 0;
  isLoading$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoading$$.asObservable();

  constructor(
    private employeeService: EmployeesService,
    private shiftsService: ShiftsService,
  ) {
    this.dashboardTable = new MatTableDataSource<AdminEmployeeData>([]);
  }

  ngOnInit(): void {
    combineLatest([this.employeeState$, this.mappedShifts$])
      .pipe(
        map(([employees, shifts]) => {
          return employees.ids.map((id: string) => ({
            ...employees.entities[id],
            shifts: shifts[id],
            ...Object.keys(shifts[id] ?
              shifts[id] : {})?.
            reduce((acc: {totalTime: number, totalRegularAmount: 0, totalOvertimeAmount: 0 }, date: string) => {
              const record = shifts[id];
              acc.totalTime += record[date].totalHours / 60;
              acc.totalRegularAmount +=
                (record[date].totalHours >= 480 ? 8 : record[date].totalHours / 60) * employees.entities[id].hourlyRate;
              acc.totalOvertimeAmount +=
                (record[date].totalHours > 480 ? ((record[date].totalHours - 480) / 60) : 0) * employees.entities[id].hourlyRateOvertime;
              this.totalTime += record[date].totalHours / 60;
              this.totalRegularAmount += (record[date].totalHours >= 480 ?
                8 : record[date].totalHours / 60) * employees.entities[id].hourlyRate;
              this.totalOvertimeAmount += (record[date].totalHours > 480 ?
                ((record[date].totalHours - 480) / 60) : 0) * employees.entities[id].hourlyRateOvertime;

              return acc;
            }, {totalTime: 0, totalRegularAmount: 0, totalOvertimeAmount: 0 })
          }));
        }),
      ).subscribe((data: any) => {
        this.isLoading$$.next(false);
        this.dashboardTable.data = data;
    }, error => {
        this.isLoading$$.next(false);
    });
    this.selection.changed.subscribe(selection =>
      this.employeeService.selectedEmployees$$.next(selection.source.selected as EditItemInterface[]));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dashboardTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dashboardTable.data);
  }

}
