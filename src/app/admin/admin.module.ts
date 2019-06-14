import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule,FormGroup, FormBuilder, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListFranchiseComponent, EditFormDialog } from './franchiseManagement/list-franchise/list-franchise.component';
import { DeleteConfirmationComponent } from './Alerts/delete-confirmation/delete-confirmation.component';
import { FranchiseUserComponent } from './franchiseManagement/franchise-user/franchise-user.component';
import { AddInventoryComponent } from './inventory/add-inventory/add-inventory.component';
import { ListInventoryComponent } from './inventory/list-inventory/list-inventory.component';


@NgModule({
  	declarations: [
	  	AdminComponent,
	  	DashboardComponent,
	    ListFranchiseComponent, 
	    DeleteConfirmationComponent,
	    EditFormDialog,
	    FranchiseUserComponent,
	    AddInventoryComponent,
	    ListInventoryComponent
  	],
  	imports: [
	    CommonModule,
	    AdminRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatTableModule,
		MatInputModule,
		MatCardModule,
		MatPaginatorModule,
		MatDialogModule,
		MatSelectModule
  	],
  	providers : [],
  	entryComponents : [
  		DeleteConfirmationComponent,
  		EditFormDialog
  	]

})
export class AdminModule { }
