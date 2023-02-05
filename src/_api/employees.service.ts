import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { EditItemInterface, EmployeesModel } from '../models/employees.model';

interface EmployeeState {
  ids: string[];
  entities: {[key: string]: EmployeesModel};
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  initialState: EmployeeState = {
    ids: [],
    entities: {},
    count: 0
  };

  employeeState$$: BehaviorSubject<EmployeeState> = new BehaviorSubject<EmployeeState>(this.initialState);
  employeeState$ = this.employeeState$$.asObservable();

  selectedEmployees$$: BehaviorSubject<EditItemInterface[]> = new BehaviorSubject<any>([]);
  selectedEmployees$ = this.selectedEmployees$$.asObservable();

  baseUrl = 'http://localhost:3000';

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * get employees list and create hashmap to commit faster and lighter actions to the entities
   */
  getEmployees(): Observable<{ ids: string[], entities: {[key: string]: EmployeesModel} }> {
      // ?_page=${page}&_limit=${limit}
    return this.httpClient.get<EmployeesModel[]>(`${this.baseUrl}/employees` )
      .pipe(
        map(_ => _.reduce((acc: {ids: string[], entities: {[key: string]: EmployeesModel}}, data) => {
          // const model: {ids: string[], entities: any} = {ids: [], entities: {}};
          if (!acc.ids) {
            acc.ids = [];
          }
          if (!acc.entities) {
            acc.entities = {};
          }
          acc.ids.push(data.id);
          acc.entities[data.id] = data;
          return acc;
        }, {ids: [], entities: {}})),
        tap(employeesMapped => {
          this.employeeState$$.next({
            ...employeesMapped,
            count: employeesMapped.ids.length
          });
        })
      );
  }

  patchEmployee(shift: EmployeesModel): Observable<EmployeesModel> {
    const {name, hourlyRate, hourlyRateOvertime, id} = shift;
    return this.httpClient.patch<EmployeesModel>(`${this.baseUrl}/employees/${id}`, {
      name,
      hourlyRate,
      hourlyRateOvertime
    });
  }
}
