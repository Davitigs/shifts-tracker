import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreComponent } from '../core/container/core/core.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./../core/core.module').then(m => m.CoreModule)
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
