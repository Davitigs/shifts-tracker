import * as moment from 'moment';

export type ShiftsModel = {
  id: string;
  employeeId: string;
  clockIn: number;
  clockOut: number
};

export interface Shift {[key: string]: {
    id: string;
    clockIn: string;
    clockOut: string;
    total: number
  }; }

interface Patch {
  id: string;
  clockIn: string;
  clockOut: string;
  total: number;
}


export function shiftPatchValue(val: Patch): Partial<ShiftsModel> {
  return {
    id: val.id,
    clockIn: moment(val.clockIn).valueOf(),
    clockOut: moment(val.clockOut).valueOf(),
  }
}


