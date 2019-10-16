import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/Rx';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Subject } from 'rxjs';
import { branch } from '../common_class/branch';
import { user } from '../common_class/user';
import { sale } from '../common_class/sale';
import { saledetails } from '../common_class/saledetails';
import { rent } from '../common_class/rent';
declare var qz: any;
declare var RSVP: any;
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js

const httpOptions = { headers: new HttpHeaders() };
httpOptions.headers.append('Access-Control-Allow-Headers', 'Content-Type');
httpOptions.headers.append('Access-Control-Allow-Methods', 'GET');
httpOptions.headers.append('Access-Control-Allow-Origin', '*');

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    franchiseAddedOrUpdate = new Subject();
    dashboardChangeForDiffAdmin = new Subject();
    settingEditFranchise = new Subject();
    printersData = new Subject();
    franchiseNameUpdate = new Subject();

    public messageSource = new BehaviorSubject(null);
    currentMessage = this.messageSource.asObservable();

    url = environment.apiUrl

    errorHandler
    loginData
    constructor(private http: HttpClient) {
        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            // this.UpdateCurrency(this.loginData.franchiseId);
        }
    }

    playEventSound(type) {
        let audio = new Audio();
        audio.src = `../assets/sounds/${type}.mp3`;
        audio.load();
        audio.play();
        return;
    }

    getCurrencyNew() {
        let encrypData = localStorage['loginUserData']
        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
        this.loginData = JSON.parse(userData);
        // console.log(this.loginData)
        return this.loginData.currency
    }

    getProductDatacurrency(franchiseId): Observable<any> {
        console.log(franchiseId)
        let api = this.url + "AllBranchDetails?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }

    // getPrinters(): Observable<any> {
    //   return Observable
    //     .fromPromise(
    //       qz.websocket.connect().then(() => qz.printers.find())
    //     )
    //     .map((printers) => printers)
    //     .catch(this.errorHandler);
    // }

    changeMessage(message) {
        this.messageSource.next(message)
    }


    insertBranch(branch): Observable<any> {
        let api = this.url + "addFranchiseDetails";
        return this.http.post(api, branch, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    AddSale(sale: sale) {
        // debugger;
        let api = this.url + "AddSale";
        return this.http.post<any>(api, sale, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    AddRent(rent: rent) {
        // debugger;
        let api = this.url + "AddRent";
        return this.http.post<any>(api, rent, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetRentGroupByDetails(): Observable<any> {
        let api = this.url + "GetRentGroupByDetails";
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getFranchiseDetails(): Observable<any> {
        let api = this.url + "AllBranchDetails";
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    // uploadFranchiseLogo(body : FormData): Observable<any>{
    //     console.log(body)
    //     let api = environment.apiUrl+"uploadImage";
    //     
    //     return this.http.post(api, body)
    //     .map(response =>{
    //         return response;
    //     }).catch(error =>{
    //         return error;
    //     })
    // }
    onDeleteFranchise(id): Observable<any> {
        let api = this.url + "DeleteFranchise?franchiseId=" + id;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onLogin(body): Observable<any> {
        let api = this.url + "LoginUser";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                alert(error.text)
                return error;
            })
    }
    GetUserDetails(id): Observable<any> {
        let api = environment.apiUrl + "GetUserDetails?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    AddUser(user: user): Observable<any> {
        let api = environment.apiUrl + "AddEditUserDetail";
        return this.http.post(api, user, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetUserRecord(id): Observable<any> {
        let api = this.url + "GetUserRec?userId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    EditUserProfile(user: user): Observable<any> {
        let api = environment.apiUrl + "EditProfileDetail";
        return this.http.post(api, user, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getListingOfAllSubCategory(categoryId, franchiseId): Observable<any> {
        let api = this.url + "GetListingSubCategory?CategoryId=" + categoryId + "&FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onDeleteFranchiseUser(id): Observable<any> {
        let api = this.url + "DeleteUser?userid=" + id;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetFranchiseUserRoles(): Observable<any> {
        let api = this.url + "GetUserRoles";
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }

    // -- Items Management Starts -- //

    getCategoryAndSubCategory(categoryId, franchiseId): Observable<any> {
        let api = this.url + "AllCategoryDetails?CategoryId=" + categoryId + "&FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getStockListing(franchiseId): Observable<any> {
        let api = this.url + "GetStockAlert?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getSubCategory(categoryId, franchiseId, itemId): Observable<any> {
        let api = this.url + "AllCategoryDetails?CategoryId=" + categoryId + "&FranchiseId=" + franchiseId + "&ItemId=" + itemId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetUnitCategory(): Observable<any> {
        let api = this.url + "GetUnitCategory";
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetUnitCategoryMeasurement(id): Observable<any> {
        let api = this.url + "GetUnitCategoryMeasurement?UnitCategoryId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    // GetSupplier(): Observable<any>{
    //     let api = this.url + "GetSupplier";
    //     return this.http.get(api,httpOptions)
    //     .map(response =>{
    //         return response;
    //     }).catch(error =>{
    //         return error;
    //     })
    // }
    AddEditItemProduct(body): Observable<any> {
        let api = this.url + "AddEditItemProduct";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    DeleteItem(id): Observable<any> {
        let api = this.url + "DeleteItem?ItemId=" + id;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetItemsProducts(id): Observable<any> {
        let api = this.url + "GetItemsProducts?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetItemsProductsByCategory(CategoryId, id): Observable<any> {
        let api = this.url + "GetItemsProductsByCategory?CategoryId=" + CategoryId + "&&FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetItemsProductsAccToSaleOrRent(data): Observable<any> {
        let api = this.url + "GetItemsProducts?FranchiseId=" + data.franchiseId + '&SaleType=' + data.type;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetAllItemsProducts(id): Observable<any> {
        let api = this.url + "GetAllItemsProducts?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    activateItem(itemId): Observable<any> {
        let api = this.url + "ActivateItem?ItemId=" + itemId;
        return this.http.put(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetFrenchiesDetail(id): Observable<any> {
        let api = this.url + "AllBranchDetails?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    uploadFile(uploadData, franchiseId, SupplierId, SupplyName, CreatedBy): Observable<any> {
        let api = this.url + "UploadExcel?franchiseId=" + franchiseId + "&SupplierId=" + SupplierId + "&SupplyName=" + SupplyName + "&CreatedBy=" + CreatedBy;
        return this.http.post(api, uploadData, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetItemsProductsBySupplyName(supplyName, From, To): Observable<any> {
        let api = this.url + "GetItemsProductsBySupplyName?supplyName=" + supplyName + '&From=' + From + '&To=' + To;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }

    // -- Items Management Ends -- //

    // -- Category Management Starts -- //
    AddEditCategory(body): Observable<any> {
        let api = this.url + "AddEditCategory";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    deleteCategory(id): Observable<any> {
        let api = this.url + "DeleteCategory?CategoryId=" + id;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getListingOfCategortOrSubCategory(categoryId, franchiseId): Observable<any> {
        let api = this.url + "GetCategorySubCategory?CategoryId=" + categoryId + "&FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getListingOfSubCategory(categoryId, franchiseId): Observable<any> {
        let api = this.url + "GetSubCategory?CategoryId=" + categoryId + "&FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }

    // -- Category Management Ends -- //

    // -- Customer Management Starts -- //
    getCustomerListing(franchiseId): Observable<any> {
        let api = this.url + "GetCustomers?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onAddAndAditCoustomerData(body): Observable<any> {
        let api = this.url + "AddEditCustomers";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onDeleteCustomer(customerId): Observable<any> {
        let api = this.url + "DeleteCustomer?CustomerId=" + customerId;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    // -- Customer Management Ends -- //

    onDashBoardRentedData(franchiseId): Observable<any> {
        let api = this.url + "GetReturnableProduct?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    AddCoupon(body, createdBy): Observable<any> {
        let api = this.url + "AddEditCoupon";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    deleteCoupon(couponId): Observable<any> {
        let api = this.url + "DeleteCoupon?couponId=" + couponId;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    activateCoupon(couponcode): Observable<any> {
        let api = this.url + "ActivateCoupon?couponCode=" + couponcode;
        return this.http.put(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getListOfCoupon(id): Observable<any> {
        let api = this.url + "GetCouponRec?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getproductdata_currency(franchiseId): Observable<any> {
        let api = this.url + "AllBranchDetails?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onAddEditHoldOrder(body): Observable<any> {
        let api = this.url + "AddEditHoldOrder";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getcoupondata(id): Observable<any> {
        let api = this.url + "GetCoupon?CouponId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    gettaxdata(franchiseId): Observable<any> {
        let api = this.url + "GetTaxes?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    AddEditTax(body): Observable<any> {
        let api = this.url + "AddEditTaxes";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onDeleteTax(TaxId): Observable<any> {
        let api = this.url + "DeleteTax?TaxId=" + TaxId;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    AddEditUnitCategory(body): Observable<any> {
        let api = this.url + "AddEditUnitCategory";
        return this.http.post(api, body, httpOptions)
            .map(response => {

                return response;
            }).catch(error => {
                return error;
            })
    }
    getAllUnitCategory(): Observable<any> {
        let api = this.url + "GetUnitCategory";
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onDeleteUnitCategory(unitCategoryId): Observable<any> {
        let api = this.url + "DeleteUnitCategory?UnitCategoryId=" + unitCategoryId;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getAllUnitMeasurement(): Observable<any> {
        let api = this.url + "GetUnitCategoryMeasurement";
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    AddEditUnitMeasurement(body): Observable<any> {
        let api = this.url + "AddEditUnitMeasurement";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onDeleteUnitMeasurement(unitMeasurementId): Observable<any> {
        let api = this.url + "DeleteUnitMeasurement?unitMeasurementId=" + unitMeasurementId;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getHoldOrderList(franchiseId, holdBy, isRented): Observable<any> {
        let api = this.url + "GetHoldOrder?FranchiseId=" + franchiseId + '&HoldBy=' + holdBy + '&IsRent=' + isRented;
        console.log(api)
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    billUnholdOrDeleteForUnholdList(orderId): Observable<any> {
        let api = this.url + "UnHoldOrder?OrderId=" + orderId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    checkcouponvalidations(body): Observable<any> {
        let api = this.url + "GetCoupon";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onDeletecoupon(ProductId, CouponId): Observable<any> {
        let api = this.url + "ExpirationCoupon?ProductId=" + ProductId + "&CouponId=" + CouponId;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getReportTypeOne(data): Observable<any> {
        let api = this.url + "DateWiseReport?From=" + data.fromDate + "&to=" + data.todate + "&FranchiseId=" + data.franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getReportTypeTwo(data): Observable<any> {
        let api = this.url + "GetInventories?FranchiseId=" + data.franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onGetRentListOfAllFranchise(data): Observable<any> {
        let api = this.url + "GetRentInventories?FranchiseId=" + data.franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getReportTypeFour(data): Observable<any> {
        let api = this.url + "DateWiseRentReport?From=" + data.fromDate + "&to=" + data.todate + "&FranchiseId=" + data.franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    // Report Manegement Ends //

    // Dashboard card service Starts //
    getDashboardCardsData(data): Observable<any> {
        let api = this.url + "GetDashSaleReport?FranchiseId=" + data.franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetGraphPieChartSalesData(data): Observable<any> {
        let api = this.url + "GetMonthlySaleofFranchiseandSalesAgentReport?FranchiseId=" + data.franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetGraphPieChartRentData(data): Observable<any> {
        let api = this.url + "GetMonthlyRentofFranchiseandRentAgentReport?FranchiseId=" + data.franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    // Dashboard card service Ends //

    GetSupplier(FranchiseId): Observable<any> {
        let api = this.url + "GetSupplier?franchiseId=" + FranchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    AddEditSupplier(body): Observable<any> {
        let api = this.url + "AddEditSupplier";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    DeleteSupplier(id): Observable<any> {
        let api = this.url + "DeleteSupplier?SupplierId=" + id;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getFranchiseDetails1(id): Observable<any> {
        let api = this.url + "AllBranchDetails?franchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }

    // Dashboard Highest Selling Items STARTS //
    GetDashboardHighestSellingProduct(id): Observable<any> {
        let api = this.url + "GetHighestSellingProduct?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    // Dashboard Highest Selling Items ENDS //

    // Dashboard Monthly Sell Report STARTS //
    GetDashboardMonthlySaleReport(id): Observable<any> {
        let api = this.url + "GetMonthlySaleReport?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetDashboardMonthlyRentReport(id): Observable<any> {
        let api = this.url + "GetMonthlyRentReport?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetRentDataByBillNumber(billnumber): Observable<any> {
        let api = this.url + "GetRentDataByBillNumber?billnumber=" + billnumber;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    EditRentDetailsQuantity(billnumber, reason, charges, latecharges) {
        let api = this.url + "EditRentDetailsQuantity?billnumber=" + billnumber + '&reason=' + reason + '&charges=' + charges + '&latecharges=' + latecharges;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }

    // Dashboard Monthly Sell Report ENDS //
    GetCustomerSaleReport(data): Observable<any> {
        let api = this.url + "GetCustomerReport?From=" + data.fromDate + '&To=' + data.todate + '&FranchiseId=' + data.franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetCustomerRentReport(data): Observable<any> {
        let api = this.url + "GetCustomerRentReport?From=" + data.fromDate + '&To=' + data.todate + '&FranchiseId=' + data.franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onDashBoardRentedDatareportbrief(franchiseId): Observable<any> {
        let api = this.url + "GetALLReturnableProduct?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getStockListingbrief(franchiseId): Observable<any> {
        let api = this.url + "GetAllStockAlerts?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getHighestSellingReportList(franchiseId): Observable<any> {
        let api = this.url + "GetHighestSellingReportProduct?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetGuestCustomerByFranchiseId(id): Observable<any> {
        let api = this.url + "GetGuestCustomerByFranchiseId?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    AddEditProductsGroupedItems(body): Observable<any> {
        let api = this.url + "AddEditGroupedItems";
        return this.http.post(api, body, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    activateCustomer(customerId): Observable<any> {
        let api = this.url + "ActivateCustomer?CustomerId=" + customerId;
        return this.http.put(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    activateCategoryOrSubcategory(categoryId): Observable<any> {
        let api = this.url + "ActivateCategoryOrSubCategory?CategoryId=" + categoryId;
        return this.http.put(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    activateSupplier(supplierId): Observable<any> {
        let api = this.url + "ActivateSupplier?SupplierId=" + supplierId;
        return this.http.put(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    activateUnitCategory(unitCategoryId): Observable<any> {
        let api = this.url + "ActivateUnitCategory?UnitCategoryId=" + unitCategoryId;
        return this.http.put(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    activateUnitCategoryMeasurement(UnitMeasurementId): Observable<any> {
        let api = this.url + "ActivateUnitCategoryMeasure?UnitMeasurementId=" + UnitMeasurementId;
        return this.http.put(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    activateTax(taxId): Observable<any> {
        let api = this.url + "ActivateTax?TaxId=" + taxId;
        return this.http.put(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getListingOfCategorySubCategory(categoryId, franchiseId): Observable<any> {
        let api = this.url + "GetCategoryList?CategoryId=" + categoryId + "&FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetAllCustomers(franchiseId): Observable<any> {
        let api = this.url + "GetCustomers?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    GetALLSupplier(FranchiseId): Observable<any> {
        let api = this.url + "GetALLSupplier?franchiseId=" + FranchiseId;

        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getAllUnitCategoryList(): Observable<any> {
        let api = this.url + "GetAllUnitCategory";
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getAllUnitCategoryMeasurement(): Observable<any> {
        let api = this.url + "GetAllUnitCategoryMeasurement";
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getAllTaxes(franchiseId): Observable<any> {
        let api = this.url + "GetAllTaxes?FranchiseId=" + franchiseId;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    getAllGroupProducts(id): Observable<any> {
        let api = this.url + "GetGroupItems?FranchiseId=" + id;
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onDeleteGroupItem(id): Observable<any> {
        let api = this.url + "DeleteGroupItem?ItemId=" + id;
        return this.http.delete(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
    onopeneditGroupItems(id): Observable<any> {
        let api = this.url + "GetGroupEditItems?ItemId=" + id;
        console.log(api)
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }
}
