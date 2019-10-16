import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/guard/auth.guard';

import { AdminComponent } from './admin/admin.component';
import { CashierManagementComponent } from './cashier-management/cashier-management.component';
import { RentManagementComponent } from './cashier-management/rent-management.component';
import { ManageReturnComponent } from './manage-return/manage-return.component';

const routes: Routes = [
    { path: 'admin', component: AdminComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cashierMangement', component: CashierManagementComponent },
    { path: 'rentManagement', component: RentManagementComponent },
    { path: 'manageReturn', component: ManageReturnComponent },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true }),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
