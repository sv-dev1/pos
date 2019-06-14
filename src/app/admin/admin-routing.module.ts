import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guard/auth.guard';

import { AdminComponent } from './admin.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListFranchiseComponent } from './franchiseManagement/list-franchise/list-franchise.component';
import { FranchiseUserComponent } from './franchiseManagement/franchise-user/franchise-user.component';
import { AddInventoryComponent } from './inventory/add-inventory/add-inventory.component';
import { ListInventoryComponent } from './inventory/list-inventory/list-inventory.component';


const routes: Routes = [
  {
      path: 'admin',
      component: AdminComponent,
      children: [
          { path: 'dashboard',component: DashboardComponent },  
          {path: "franchise", component:ListFranchiseComponent},
          {path: "franchise-user/:id/:franchise_name", component:FranchiseUserComponent},
          {path: "add-inventory", component:AddInventoryComponent},
          {path: "list-inventory", component:ListInventoryComponent},

          { path: '',redirectTo: '/dashboard', pathMatch: 'full' },          
      ],
      canActivate: [AuthGuard]
  }
];

// const routes: Routes = [{
//   path: 'admin',
//   component: AdminComponent,
//   children: [
//   {
//     path: 'addFranchise',
//     component: AddfranchiseComponent,
//   },
//   // {
//   //   path: 'franchise',
//   //   component: POSSelfComponent,
//   // },{
//   //   path: 'franchiseListing',
//   //   component: UserListingComponent,
//   // },{
//   //   path: 'addUser',
//   //   component: AddUserComponent,
//   // },
//   {
//     path: 'dashboard',
//     component: DashboardComponent,
//   }, {
//     path: '',
//     redirectTo: 'dashboard',
//     pathMatch: 'full',
//   }, 
//   // {
//   //   path: '**',
//   //   component: NotFoundComponent,
//   // }
//   ],
// }];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{ useHash: true }),
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
