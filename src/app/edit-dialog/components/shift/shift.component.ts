import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ShiftsModel } from '../../../../models/shifts.model';

import { MatTableDataSource } from '@angular/material/table';
import { MapperPipeFn } from '../../../../shared/mapper.pipe';
import * as moment from 'moment';

interface Shift {
  id: string;
  clockIn: string;
  clockOut: string;
  total: number;
}

enum shiftStartEnd {
  clockIn = 'clockIn',
  clockOut = 'clockOut',
}

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

  dateControl = new FormControl('');
  shiftDays: string[] = [];
  shiftsByDays: {[key: string]: Shift[]};
  shiftsEdited: {[key: string]: Shift} = {};
  shiftToggle = shiftStartEnd;

  dataSource: MatTableDataSource<Shift>;
  displayedColumns = ['shift', 'clockIn', 'clockOut', 'total'];

  @Input() set shiftsDates(value: {[key: string]: {totalHours: number}}) {
    this.shiftDays = Object.keys(value);
  }

  @Input() set shifts(value: ShiftsModel[]) {
    this.shiftsByDays = value.reduce((acc: {[key: string]: Shift[]}, shift) => {
      const today = moment(shift.clockIn).format('DD-MM-yyyy');
      const tomorrow = moment(today, 'DD-MM-yyyy').add(1, 'day');
      const tomorrowFormatted = tomorrow.format('DD-MM-yyyy');
      const sameDay = !moment(shift.clockOut).isAfter(shift.clockIn, 'day');

      if (!acc[today]) {
        acc[today] = [];
      }
      if (!acc[tomorrowFormatted]) {
        acc[tomorrowFormatted] = [];
      }
      if (sameDay) {
        acc[today].push({
          id: shift.id,
          clockIn: moment(shift.clockIn).format(),
          clockOut: moment(shift.clockOut).format(),
          total: moment(shift.clockOut).diff(shift.clockIn, 'minutes')
        });
      } else {
        acc[today].push({
          id: shift.id,
          clockIn: moment(shift.clockIn).format(),
          clockOut: moment(shift.clockIn).endOf('day').format(),
          total: moment(shift.clockIn).endOf('day').diff(shift.clockIn, 'minutes')
        });
        acc[tomorrowFormatted].push({
          id: shift.id,
          clockIn: moment(shift.clockOut).startOf('day').format(),
          clockOut: moment(shift.clockOut).format(),
          total: moment(shift.clockOut).diff(moment(shift.clockOut).startOf('day'), 'minutes')
        });
      }
      return acc;
    }, {});
  }

  @Output() emitEditedShifts: EventEmitter<{[key: string]: Shift}> = new EventEmitter<{[key: string]: Shift}>();

  getTotalFn: MapperPipeFn<Shift, number> = (el, ...editedItems) => {
    const elm = editedItems[0][el.id] || el;
    return moment(elm.clockOut).diff(elm.clockIn, 'minute');
  }

  constructor() {
    this.dataSource = new MatTableDataSource<Shift>([]);
  }

  edit(ev: any, prop: shiftStartEnd, el: Shift): void {
    if (moment(el[prop]).format('HH:mm') === ev) {
      if (this.shiftsEdited[el.id]) {
        delete this.shiftsEdited[el.id];
      }
      return;
    }
    const editedItem = {...el, [prop]: moment(el[prop]).set({
        hour: moment(ev, 'HH:mm').get('hour'),
        minute: moment(ev, 'HH:mm').get('minute'),
    }).format()};
    this.shiftsEdited = {...this.shiftsEdited, [el.id]: editedItem };
    this.emitEditedShifts.emit(this.shiftsEdited);
  }

  ngOnInit(): void {
    this.dateControl.valueChanges.subscribe(day => this.dataSource.data = this.shiftsByDays[day]);
  }

}
