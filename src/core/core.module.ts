import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreRoutingModule } from './core-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreComponent } from './container/core/core.component';
import { HeaderComponent } from './components/header/header.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { BriefComponent } from '../app/brief/brief.component';
import { DashboardComponent } from '../app/dashboard/dashboard.component';
import { EditDialogComponent } from '../app/edit-dialog/edit-dialog.component';
import { EmployeeShiftWrapperComponent } from '../app/edit-dialog/container/employee-shift-wrapper/employee-shift-wrapper.component';
import { EmployeeComponent } from '../app/edit-dialog/components/employee/employee.component';
import { ShiftComponent } from '../app/edit-dialog/components/shift/shift.component';
import { SharedModule } from '../shared/shared.module';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IConfig, NgxMaskModule } from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    MainLayoutComponent,
    BriefComponent,
    DashboardComponent,
    EditDialogComponent,
    EmployeeShiftWrapperComponent,
    EmployeeComponent,
    ShiftComponent
  ],
  imports: [
    HttpClientModule,
    CoreRoutingModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    CommonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMaskModule.forRoot(maskConfig),
    SharedModule,
    FormsModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      } as MatFormFieldDefaultOptions
    },
  ],
  exports: []
})
export class CoreModule{}
