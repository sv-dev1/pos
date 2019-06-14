import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/guard/auth.guard';

import { AdminComponent } from './admin/admin.component';


// const routes: Routes = [
//   { path: '', loadChildren: 'app/admin/admin.module#AdminModule' },
//   { path: '', redirectTo: 'admin', pathMatch: 'full' },
//   { path: '**', redirectTo: 'admin' },
// ]
const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent },
   {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [ 
  RouterModule.forRoot(routes,{ useHash: true }),
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
