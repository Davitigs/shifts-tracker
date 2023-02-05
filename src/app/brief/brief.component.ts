import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { EmployeesModel } from '../../models/employees.model';
import { EmployeesService } from '../../_api/employees.service';
import { ShiftsService } from '../../_api/shifts.service';
import { ShiftsModel } from '../../models/shifts.model';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-brief',
  templateUrl: './brief.component.html',
  styleUrls: ['./brief.component.scss']
})
export class BriefComponent implements OnInit, OnDestroy {

  destroyed$: Subject<void> = new Subject();
  employeesTable: MatTableDataSource<EmployeesModel>;
  shiftsTable: MatTableDataSource<ShiftsModel>;
  displayedColumns = ['id', 'name', 'email', 'hourlyRate', 'hourlyRateOvertime'];
  shiftsDisplayedColumns = ['id', 'employeeId', 'clockIn', 'clockOut'];
  employeeState$ = this.employeeService.employeeState$;
  shifts$ = this.shiftsService.shifts$.pipe(map(sh => sh.shifts));

  isLoading$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoading$$.asObservable();

  dataTrackByFn: TrackByFunction<EmployeesModel> = (index, item) => item.id;
  shiftsDataTrackByFn: TrackByFunction<ShiftsModel> = (index, item) => item.id;

  constructor(
    private employeeService: EmployeesService,
    private shiftsService: ShiftsService
  ) {
    this.employeesTable = new MatTableDataSource<EmployeesModel>([]);
    this.shiftsTable = new MatTableDataSource<ShiftsModel>([]);
  }

  ngOnInit(): void {
    this.shifts$.subscribe(shifts => this.shiftsTable.data = shifts.slice(0, 10));
    combineLatest([this.employeeState$, this.shifts$])
      .pipe(
        tap(([employees, shifts]) => {
          this.shiftsTable.data = shifts.slice(0, 10);
        }),
        map(([employees, shifts]) => {
          return employees.ids.map((id: string) => ({
            ...employees.entities[id],
          }));
        }),
      ).subscribe((entities) => {
        this.isLoading$$.next(false);
        this.employeesTable.data = entities;
    }, error => {
      this.isLoading$$.next(false);
    });
    // this.employeeService.getEmployees()
    //   .pipe()
    //   .subscribe(employees => this.employeesTable.data = employees.map(e => e.entity));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
