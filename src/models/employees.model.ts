export type EmployeesModel = {
  id: string;
  name: string;
  email?: string;
  hourlyRate: number;
  hourlyRateOvertime: number;
};

export interface EmployeeTableData extends EmployeesModel {
  clockIn: number;
  clockOut: number;
}


export interface AdminEmployeeData {
  name: string;
  email: string;
  totalTime: number;
  totalRegularAmount: number;
  totalOvertimeAmount: number;
}

export interface EditItemInterface extends EmployeesModel{
  shifts: {[key: string]: {totalHours: number}};
  totalOvertimeAmount: number;
  totalRegularAmount: number;
  totalTime: number;
}
