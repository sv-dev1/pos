import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guard/auth.guard';

import { AdminComponent } from './admin.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListFranchiseComponent } from './franchiseManagement/list-franchise/list-franchise.component';
import { FranchiseUserComponent } from './franchiseManagement/franchise-user/franchise-user.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { CategoryComponent } from './categoryManagement/category/category.component';
import { SubCategoryComponent } from './categoryManagement/sub-category/sub-category.component';
import { CSVImportComponent } from './CSVImport/CSVImport.component';
import { CustomerListingComponent } from './customerManagement/customer-listing/customer-listing.component';
import { GeneralComponent } from './settings/general/general.component';
import { AddCouponComponent } from './add-coupon/add-coupon.component';

import { TaxManagementComponent } from './tax-management/tax-management.component';
import { UnitcategoryComponent } from './unitcategory/unitcategory.component';
import { UnitCategoryMeasurementComponent } from './unit-category-measurement/unit-category-measurement.component';
import { TypeOneComponent } from './report-management/date-wise-sales-report/type-one.component';
import { TypeTwoComponent } from './report-management/item-wise-stock-report/type-two.component';
import { TypeThreeComponent } from './report-management/rent-wise-stock-report/type-three.component';
import { SupplierComponent } from './supplier/supplier.component';

import { CustomerAddComponent } from './customerManagement/customer-add/customer-add.component';
import { ListCouponComponent } from './add-coupon/list-coupon/list-coupon.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { ProfileManagementComponent } from './profile-management/profile-management.component';
import { TypeFourComponent } from './report-management/date-wise-rent-report/type-four.component';
import { IncomingRentedReportComponent } from './report-management/incoming-rented-report/incoming-rented-report.component';
import { IncomingSaleReportComponent } from './report-management/incoming-sale-report/incoming-sale-report.component';
import { HigestSellingReportComponent } from './report-management/higest-selling-report/higest-selling-report.component';
import { TypeFiveComponent } from './report-management/customer-sale-report/type-five.component';
import { CustomerDateWiseRentReportComponent } from './report-management/customer-rent-report/customer-date-wise-rent-report.component';
import { GroupProductComponent } from './product/group-product/group-product.component';
import { SupplyReportComponent } from './report-management/supply-report/supply-report.component';
import { GroupProductListComponent } from './product/group-product-list/group-product-list.component';

const routes: Routes = [
  {
      path: 'admin',
      component: AdminComponent,
      children: [
          { path: 'dashboard',component: DashboardComponent },  
          { path: "franchise", component:ListFranchiseComponent},
          { path: "franchise-user/:id/:franchise_name", component:FranchiseUserComponent},
          { path: "category", component:CategoryComponent},
          { path: "sub-category", component:SubCategoryComponent},
          { path: "csvimport", component:CSVImportComponent},
          { path: "general-settings", component:GeneralComponent},
          { path: "TaxManagement", component: TaxManagementComponent },
          { path: "UnitCategory", component: UnitcategoryComponent },
          { path: "UnitCategoryMeasurement", component: UnitCategoryMeasurementComponent },
          { path: "sales-report", component: TypeOneComponent },
          { path: "sales-report/:month", component: TypeOneComponent },
          { path: "inventroy-report", component: TypeTwoComponent },
          { path: "rent-report", component: TypeThreeComponent },
          { path: "customer-listing", component:CustomerListingComponent},
          { path: "add-customer", component: CustomerAddComponent },
          { path: "add-coupon", component:AddCouponComponent},
          { path: "coupon-listing", component: ListCouponComponent },
          { path: "add-product", component:AddProductComponent},
          // { path: "add-item/:itemData", component:AddProductComponent},
          { path: "list-product", component: ListProductComponent },
          { path: "Profile", component:ProfileManagementComponent},
          { path: "date-wise-rent-report", component:TypeFourComponent},
          { path: "incoming_Rented", component:IncomingRentedReportComponent},
          { path: "customer_report", component: TypeFiveComponent },
          { path: "incoming_Rented", component:IncomingRentedReportComponent},
          { path: "incoming_Sale",component:IncomingSaleReportComponent},
          { path: "higest_sale",component:HigestSellingReportComponent},
          { path: "Supplier", component:SupplierComponent},
          { path: "customer-rent-report", component:CustomerDateWiseRentReportComponent},
          { path: "group-product", component:GroupProductComponent},
          { path: "group-product/:groupId" , component :GroupProductComponent},
          { path: "supply-report", component: SupplyReportComponent },
          { path: "group-item-list", component: GroupProductListComponent },
      ],
      canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{ useHash: true }),
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
