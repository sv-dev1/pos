import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule,FormGroup, FormBuilder, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './shared/guard/auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule} from '@angular/material/table';
import { MatInputModule} from '@angular/material';
import { MatCardModule} from '@angular/material/card';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatDialogModule} from '@angular/material/dialog';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AdminModule } from './admin/admin.module';
import { AdminService } from './shared/admin/admin.service';
import { CashierManagementComponent, AddCustomerDialog, AddNotesDialog } from './cashier-management/cashier-management.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { SearchProductsPipe } from './search-products.pipe';
import { CashierAddItemComponent } from './cashier-management/cashier-add-item/cashier-add-item.component';
import { RentManagementComponent, AddCustomerDialog2, AddNotesDialog2 } from './cashier-management/rent-management.component';
import { ManageReturnComponent } from './manage-return/manage-return.component';
import { HoldPopupComponent } from './cashier-management/hold-popup/hold-popup.component';
import { HoldListComponent } from './cashier-management/hold-list/hold-list.component';

// import { SlickModule } from 'ngx-slick';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {MatTabsModule} from '@angular/material/tabs';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CashierManagementComponent,
    CashierAddItemComponent,
    SearchProductsPipe,
    AddCustomerDialog,
    AddNotesDialog,
    RentManagementComponent,
    AddCustomerDialog2,
    AddNotesDialog2,
    ManageReturnComponent,
    HoldPopupComponent,
    HoldListComponent
  ],
  imports: [
    BrowserModule,
    NgMultiSelectDropDownModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
  	ReactiveFormsModule,
  	RouterModule,
  	BrowserAnimationsModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    AdminModule,
    MatAutocompleteModule,
    MultiSelectAllModule,
    HttpClientModule,
    // SlickModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatTabsModule
    
  ],
  providers: [
  DatePipe,
  {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  AdminService,
    AuthGuard
  ],
  entryComponents:[
    AddNotesDialog,
    AddCustomerDialog,
    CashierAddItemComponent,
    AddCustomerDialog2,
    AddNotesDialog2,
    HoldPopupComponent,
    HoldListComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
