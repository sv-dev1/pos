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
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListFranchiseComponent, EditFormDialog } from './franchiseManagement/list-franchise/list-franchise.component';
import { DeleteConfirmationComponent } from './Alerts/delete-confirmation/delete-confirmation.component';
import { FranchiseUserComponent } from './franchiseManagement/franchise-user/franchise-user.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { CategoryComponent } from './categoryManagement/category/category.component';
import { SubCategoryComponent } from './categoryManagement/sub-category/sub-category.component';
import { CSVImportComponent } from './CSVImport/CSVImport.component';
import { CustomerListingComponent } from './customerManagement/customer-listing/customer-listing.component';
import {MatSortModule} from '@angular/material/sort';
import {MatRadioModule} from '@angular/material/radio';
import { NgxEchartsModule } from 'ngx-echarts';
import { GeneralComponent } from './settings/general/general.component';
import {MatTabsModule} from '@angular/material/tabs';
import { GeneralInformationsComponent } from './settings/general/general-informations/general-informations.component';
import { CurrencyComponent } from './settings/general/currency/currency.component';
import { AddCouponComponent } from './add-coupon/add-coupon.component';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { TaxManagementComponent } from './tax-management/tax-management.component';
import { UnitcategoryComponent } from './unitcategory/unitcategory.component';
import { UnitCategoryMeasurementComponent } from './unit-category-measurement/unit-category-measurement.component';
import { TypeOneComponent } from './report-management/date-wise-sales-report/type-one.component';
import { TypeTwoComponent } from './report-management/item-wise-stock-report/type-two.component';
import { TypeThreeComponent } from './report-management/rent-wise-stock-report/type-three.component';
import { SupplierComponent } from './supplier/supplier.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CustomerAddComponent } from './customerManagement/customer-add/customer-add.component';
import { ListCouponComponent } from './add-coupon/list-coupon/list-coupon.component';
import { ProfileManagementComponent } from './profile-management/profile-management.component';
import { TypeFourComponent } from './report-management/date-wise-rent-report/type-four.component';
import { IncomingRentedReportComponent } from './report-management/incoming-rented-report/incoming-rented-report.component';
import { TypeFiveComponent } from './report-management/customer-sale-report/type-five.component';
import { IncomingSaleReportComponent } from './report-management/incoming-sale-report/incoming-sale-report.component';
import { HigestSellingReportComponent } from './report-management/higest-selling-report/higest-selling-report.component';
import { CustomerDateWiseRentReportComponent } from './report-management/customer-rent-report/customer-date-wise-rent-report.component';
import { GroupProductComponent } from './product/group-product/group-product.component';
import { SupplyReportComponent } from './report-management/supply-report/supply-report.component';
import { GroupProductListComponent } from './product/group-product-list/group-product-list.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { BillViewComponent } from './report-management/bill-view/bill-view.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  	declarations: [
	  	AdminComponent,
	  	IncomingSaleReportComponent,
	  	HigestSellingReportComponent,
	  	DashboardComponent,
	    ListFranchiseComponent, 
	    DeleteConfirmationComponent,
	    EditFormDialog,
	    FranchiseUserComponent,
	    AddProductComponent,
	    ListProductComponent,
	    CategoryComponent,
	    SubCategoryComponent,
	    CSVImportComponent,
	    CustomerListingComponent,
	    GeneralComponent,
	    GeneralInformationsComponent,
        CurrencyComponent,
        TaxManagementComponent,
        UnitcategoryComponent,
        UnitCategoryMeasurementComponent,
        AddCouponComponent,
        TypeOneComponent,
        TypeTwoComponent,
        TypeThreeComponent,
        TypeFiveComponent,
        SupplierComponent,
        CustomerAddComponent,
        ListCouponComponent,
        ProfileManagementComponent,
        TypeFourComponent,
        SupplyReportComponent,
        IncomingRentedReportComponent,
        CustomerDateWiseRentReportComponent,
        GroupProductComponent,
        GroupProductListComponent,
        BillViewComponent
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
		MatSelectModule,
		MatSortModule,
		MatRadioModule,
		NgxEchartsModule,
		MatTabsModule,
		MultiSelectAllModule,
		MatSlideToggleModule,
		NgMultiSelectDropDownModule.forRoot(),
	    HttpClientModule,
	    TranslateModule.forRoot({
	      loader: {
	        provide: TranslateLoader,
	        useFactory: HttpLoaderFactory,
	        deps: [HttpClient]
	      }
	    })
  	],
  	providers : [],
  	entryComponents : [
  		DeleteConfirmationComponent,
  		EditFormDialog,
  		BillViewComponent
  	]

})
export class AdminModule { }
