import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ShiftsModel } from '../models/shifts.model';

import * as moment from 'moment';

interface MappedShiftsState {
  [key: string]: {
    [key: string]: {
      totalHours: number
    };
  };
}

interface ShiftsState {
  mappedShifts: MappedShiftsState;
  shifts: ShiftsModel[];
  ids: string[];
  entities: {[key: string]: ShiftsModel[]};
}

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  shifts$$: BehaviorSubject<ShiftsState> = new BehaviorSubject<ShiftsState>({mappedShifts: {}, shifts: [], ids: [], entities: {}});
  shifts$ = this.shifts$$.asObservable();

  baseUrl = 'http://localhost:3000';

  constructor(
    private httpClient: HttpClient
  ) { }


  getShifts(): Observable<ShiftsModel[]> {
    return this.httpClient.get<ShiftsModel[]>(`${this.baseUrl}/shifts`).pipe(
      tap(shifts => {
        const employeeShiftsData = this.getShiftDataByDays(shifts);
        this.shifts$$.next({
          shifts,
          mappedShifts: employeeShiftsData,
          ...shifts.reduce((acc: {ids: string[], entities: {[key: string]: ShiftsModel[]}}, data) => {
            // const model: {ids: string[], entities: any} = {ids: [], entities: {}};
            if (!acc.ids) {
              acc.ids = [];
            }
            if (!acc.entities) {
              acc.entities = {};
            }
            if (!acc.entities[data.employeeId]) {
              acc.entities[data.employeeId] = [];
            }
            if (!acc.ids.includes(data.employeeId)) {
              acc.ids.push(data.employeeId);
            }
            acc.entities[data.employeeId].push(data);
            return acc;
          }, {ids: [], entities: {}}),
        });
      })
    );
  }

  patchShift(shift: Partial<ShiftsModel>): Observable<ShiftsModel> {
    const {clockIn, clockOut, id} = shift;
    return this.httpClient.patch<ShiftsModel>(`${this.baseUrl}/shifts/${id}`, {
      clockIn,
      clockOut
    });
  }


  getShiftDataByDays(shifts: ShiftsModel[]): MappedShiftsState {
    const totalShifts = shifts.reduce((acc: MappedShiftsState, shift) => {

      const today = moment(shift.clockIn).format('DD-MM-yyyy');
      const tomorrow = moment(today, 'DD-MM-yyyy').add(1, 'day');
      const tomorrowFormatted = tomorrow.format('DD-MM-yyyy');
      if (!acc[shift.employeeId]) {
        acc = {
          ...acc,
          [shift.employeeId]: {
            ...acc[shift.employeeId],
            [today]: {
              totalHours: 0
            },
            [tomorrowFormatted]: {
              totalHours: 0
            },
          }
        };
      }
      if (!acc[shift.employeeId][today]) {
        acc = {
          ...acc,
          [shift.employeeId]: {
            ...acc[shift.employeeId],
            [today]: {
              totalHours: 0
            }
          }
        };
      }

      if (!acc[shift.employeeId][tomorrowFormatted]) {
        acc = {
          ...acc,
          [shift.employeeId]: {
            ...acc[shift.employeeId],
            [tomorrowFormatted]: {
              totalHours: 0
            },
          }
        };
      }
      const sameDay = !moment(shift.clockOut).isAfter(shift.clockIn, 'day');
      if (sameDay) {
        acc[shift.employeeId][today].totalHours += moment(shift.clockOut).diff(shift.clockIn, 'minutes');
      } else {
        acc[shift.employeeId][today].totalHours += moment(shift.clockIn).endOf('day').diff(shift.clockIn, 'minutes');
        acc[shift.employeeId][tomorrowFormatted].totalHours += moment(shift.clockOut).diff(moment(tomorrow).startOf('day'), 'minutes');
      }
      // moment(shift.clockOut).diff(moment(tomorrow).startOf('day'), 'minutes');
      return acc;
    }, {});
    return totalShifts;
  }
}
