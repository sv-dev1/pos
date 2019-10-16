import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../shared/admin/admin.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CashierAddItemComponent } from './cashier-add-item/cashier-add-item.component';
import { sale } from '../shared/common_class/sale';
import { saledetails } from '../shared/common_class/saledetails';
import { rent } from '../shared/common_class/rent';
import { rentdetails } from '../shared/common_class/rentdetails';
import {TranslateService} from '@ngx-translate/core';

import { parse } from 'url';
declare var $: any;
export interface State {
    createdDate: string,
    customerAddress: string
    customerContactNo: string
    customerId: number
    customerName: string
    dateOfBirth: null
    deletedDate: string
    franchiseId: number
    franchiseName: string
    isActive: boolean
    isDeleted: boolean
}
import * as moment from 'moment'; //https://www.npmjs.com/package/moment
import { debug } from 'util';
import { HoldListComponent } from './hold-list/hold-list.component';
import { HoldPopupComponent } from './hold-popup/hold-popup.component';

@Component({
    selector: 'app-rent-management',
    templateUrl: './rent-management.component.html',
    styleUrls: ['./rent-management.component.scss']
})
export class RentManagementComponent implements OnInit {
   
    myDate = new Date();
    searchString: string;
    backupProductdata: any;
    productData: any;
    categoryData: any;
    product = [];
    dataHtml: string = "";
    qty: number = 1;
    totalValue: number = 0;
    productCount: number = 0;
    discountVal: number = 0;
    discountVal2: number = 0;
    discountVal1: string = "";
    totalNetPayable: number = 0;
    fixedValue: number = 1;
    currency;
    percentage: string = "%";
    paymentVal1: string = "";
    paymentVal: number = 0;
    paidBal: number = 0;
    customerInfo: any;
    productCountTotal: number = 0;
    stateCtrl = new FormControl();
    filteredStates: Observable<State[]>;
    states: State[] = []
    loginData: any;
    sale: any;
    rent: any;
    saleDetails: saledetails[] = [];
    rentDetails: any;
    rentFilterDetails: any;
    notesData1: any;
    Rent: number = 0;
    superAdmin: boolean = false;
    AdminFranchiseData: any;
    allrentDetails: rentdetails[] = [];
    frenchiseid: any;
    currencydata: any;
    dateofIssue: string = "";
    dateofreturn: string = "";
    currentdate = moment(new Date()).format('L');
    systemTime = moment(new Date()).format('LT');
    CouponCode1: any;
    productids: any;
    body: { "ProductId": any; "CouponCode": any; };
    result_pop: any;
    couponId: number = 0;
    couponid: number = 0;
    finalvalue: number;
    couponcodes;
    customerPhone: string = "-";
    customerNme: string = "-";
    customerAddres: any;
    couponAmount: number = 0;
    securityAmount: number = 0;
    shippingAmount: number = 0;
    elements: any;
    BalAmount: number = 0;
    securityAmt: number = 0;
    flagSecurity: number = 0;
    doi = new FormControl();
    dor = new FormControl();
    cstId: any;
    billresult:any;
    couponchecked:boolean;
    cashPopUpSelectedTabs: string = 'payment';
    productpricevalue: any;
    discountInit: boolean = false;
    barcode:any;
    showProgress:any;
    totalpricerent_bill:any;
    latecharge:any = 0;
    additionalcharge: any = 0;
    slides = [
        {img: "http://placehold.it/350x150/000000"},
        {img: "http://placehold.it/350x150/111111"},
        {img: "http://placehold.it/350x150/333333"},
        {img: "http://placehold.it/350x150/666666"}
    ];
    slideConfig = {"slidesToShow": 4, "slidesToScroll": 1,autoplay: false};

    dateSelect
    slideToGo = 0
    constructor(public translate:TranslateService,private datePipe: DatePipe, private route: ActivatedRoute, private _snackBar: MatSnackBar,
        public router: Router, private AdminService: AdminService, public dialog: MatDialog,
        private formbulider: FormBuilder) {
            translate.addLangs(['en', 'sp']);
            const browserLang = translate.getBrowserLang();
            translate.use(browserLang.match(/en|sp/) ? browserLang : 'en');
            this.dateSelect = {}
            this.sale = new sale();
            this.rent = new rent();
        this.filteredStates = this.stateCtrl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterStates(state) : this.states.slice())
            );

        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            this._getSingleFranchiseDetail(this.loginData.franchiseId);
            this.frenchiseid = this.loginData.franchiseId;
        }

        if (localStorage.getItem('isCashierLoggedin')) {
        } else {
            this.router.navigate(['/login']);
        }

        if (localStorage['superAdminChange']) {
            this.superAdmin = true
        }
    }

    ngOnInit() {
        this.translate.setDefaultLang('sp');
        // this.translate.setDefaultLang('sp');
        this.translate.use('sp');
        $(".content111").mCustomScrollbar();
        this.showProgress = true;
        this.currency = this.AdminService.getCurrencyNew();
        this.getRentDetails();
        this.getItemProducts();
        this.getCategoryAndSubCategory();
        this._getCustomerListing();
        this.updateLocalDateAndTime();
        this.bindCustomerData();
        this.getSeletedDates();
      setTimeout(function() {    
         let b =document.getElementsByClassName("mat-tab-header")[0].classList.add("mat-tab-header-pagination-controls-enabled")
      }, 1000);
    }

    tabClick(evt){
      if(evt.index == 0){
        this.showcategories(0)
      }else{
        this.showcategories(this.categoryData[evt.index].categoryId)
      }
    }

    async getSeletedDates(){
        let today = new Date();
        let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() );
        this.dateSelect.doiMin = await moment(today).format("YYYY-MM-DD");
        this.dateSelect.dorMin = await moment(tomorrow).format("YYYY-MM-DD");
    }

    afterChange(e) {
        if(this.slideToGo == 0){
            $(".cstm-carousel").removeClass("expand");
            this.slideToGo++;
        }
    }

    Searchbill() {
        var billno = ((document.getElementById("txtBillNumber") as HTMLInputElement).value);
        this.AdminService.GetRentDataByBillNumber(billno).subscribe(data => {
        this.elements = data.result[0];
        for(let i=0;i<data.result.length;i++){
        this.billresult = data.result[i].rentDetails;
       this.totalpricerent_bill = data.result[0].receivedAmount + (parseInt(this.latecharge) + parseInt(this.additionalcharge));
        }
        if (this.elements) {
        this.securityAmt = this.elements.security;
        }
        if (this.elements) {
        this.flagSecurity = 1;
        }
        else {
        this.flagSecurity = 2;
        }
        });
    }
    bindCustomerData() {
        if (this.stateCtrl.value != null) {
            this.customerInfo = this._filterStates(this.stateCtrl.value);
            this.customerNme = this.customerInfo[0].customerName;
            this.customerPhone = this.customerInfo[0].customerContactNo;
            this.customerAddres = this.customerInfo[0].customerAddress;
        }
        else {
            this.customerNme = 'Guest';
            this.customerPhone = '-';
            this.customerAddres = '-';
        }
    }
    EditRentDetails() {
        var billnumber = ((document.getElementById("txtBillNumber") as HTMLInputElement).value);
        var latecharges = ((document.getElementById("txtLateCharges") as HTMLInputElement).value);
        var charges = ((document.getElementById("txtAdditionalCharges") as HTMLInputElement).value);
        var reason = ((document.getElementById("txtReason") as HTMLInputElement).value);
        this.totalpricerent_bill = this.elements.receivedAmount + (parseInt(latecharges) + parseInt(charges));
        this.AdminService.EditRentDetailsQuantity(billnumber, reason, charges, latecharges).subscribe(data => { console.log("charges",data); });
        this.elements = null;
        (<HTMLInputElement>document.getElementById('txtBillNumber')).value = '0';
        $('#managereturn_pay').modal('hide');
        this.printmanagereturn();
        this.checkBal()

    }

    printmanagereturn(): void {
        let printContents, popupWin;
        printContents = document.getElementById('print-contentsmanagereturn').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <head>
        <title>Invoice</title>
        <style>
        //........Customized style.......
        </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
        </html>`
        );
        popupWin.document.close();
         location.reload();
    }


    checkBal() {
        var latecharges = ((document.getElementById("txtLateCharges") as HTMLInputElement).value);
        this.latecharge = latecharges
        debugger
        var charges = ((document.getElementById("txtAdditionalCharges") as HTMLInputElement).value);
        this.additionalcharge = charges
        this.totalpricerent_bill = this.elements.receivedAmount + (parseInt(latecharges) + parseInt(charges));
        if(this.latecharge == "" && this.additionalcharge == ""){
            this.totalpricerent_bill = this.elements.receivedAmount + (parseInt(latecharges) + parseInt(charges));
        }else{
            this.totalpricerent_bill = this.elements.receivedAmount + (parseInt(latecharges) + parseInt(charges));
        }
    }



    paycheck() {
        $("#container_pay").dialog('close');
    }
    updateLocalDateAndTime() {
        this.systemTime = moment(new Date()).format('LT');
        this.currentdate = moment(new Date()).format('L');
        setTimeout(() => {
            this.updateLocalDateAndTime();
        }, 1000);
    }
   
    //  checkcoupon(couponcodes) {
    //     // debugger;
    //     if( couponcodes == undefined || couponcodes == ''){
    //      this.openSnackBar('Please enter coupon code', 'Thanks!')
    //     }
    //     this.CouponCode1 = couponcodes;
    //     for (let i = 0; i < this.product.length; i++) {
    //     this.productids = this.product[i].Id;
    //     this.productpricevalue = this.product[i].Price;
    //     this.body = {
    //     "ProductId": this.productids,
    //     "CouponCode": couponcodes
    //     }

    //     this.AdminService.checkcouponvalidations(this.body).subscribe(res => {
    //     // console.log(this.body);
    //     if (res.statusCode == 200) {
    //     this.result_pop = res.result;
    //     // debugger;
    //     this.openSnackBar(res.message, 'Thanks!')
    //     if (this.result_pop.length > 0) {
    //     // debugger;
    //     this.couponchecked = true;

    //     for (let i = 0; i < this.result_pop.length; i++) {
    //     // debugger;
    //     this.couponid = this.result_pop[i].couponId;
    //     this.couponAmount = this.result_pop[i].value;
    //     // if (this.result_pop[i].couponCode == this.CouponCode1) {
    //     // // this.AdminService.onDeletecoupon(this.productids, this.couponid).subscribe(res => {
    //     // // console.log("deleted sucessfully")
    //     // // })

    //     // }

    //     if(this.result_pop[i].couponType == 1){
    //     let productvalue = this.totalNetPayable / 100 * this.result_pop[i].value;
    //     this.couponAmount = this.totalNetPayable / 100 * this.result_pop[i].value;
    //     this.finalvalue = this.totalNetPayable - productvalue;
    //     this.paidBal = this.totalNetPayable - productvalue;
    //     this.totalNetPayable = this.paidBal;
    //     }else{
    //     this.couponid = this.result_pop[i].couponId;
    //     this.couponAmount = this.result_pop[i].value;
    //     this.finalvalue = this.totalNetPayable - this.result_pop[i].value;
    //     this.paidBal = this.totalNetPayable - this.result_pop[i].value;
    //     this.totalNetPayable = this.paidBal;
    //     }
    //     if (this.paidBal == 0)
    //     document.getElementById('btnCheckout').removeAttribute("disabled");
    //     else if (this.paidBal < 0 && this.paidBal > 0) {
    //     document.getElementById('btnCheckout').setAttribute("disabled", "disabled");
    //     }

    //     }
    //     }
    //     else {

    //     this.finalvalue = this.totalNetPayable;
    //     this.couponid = 0;
    //     }
    //     // this.finalvalue = this.totalValue - couponvalue;

    //     } else {
    //     this.finalvalue = this.totalNetPayable;
    //     //this.openSnackBar(res.message, 'Thanks!!');
    //     this.openSnackBar(res.message, 'Thanks!')
    //     this.couponchecked = false;
    //     }
    //     }, error => {
    //     this.couponchecked = false;
    //     })

    //     }
    // }
    checkcoupon(couponcodes) {
        if( couponcodes == undefined || couponcodes == ''){
         this.openSnackBar('Please enter coupon code', 'Thanks!')
        }
        this.CouponCode1 = couponcodes;
        var addedItemIds = []
        this.product.filter(data=>{
            addedItemIds.push(data.Id)
            this.productpricevalue = data.Price;
        })
        this.body = {
            ProductId: addedItemIds.toString(),
            CouponCode: couponcodes
        }
        console.log(this.body)
        this.AdminService.checkcouponvalidations(this.body).subscribe(res => {
            console.log(res)
            if (res.statusCode == 200) {
                this.result_pop = res.result;
                this.openSnackBar(res.message, 'Thanks!')
                this.AdminService.playEventSound('success')
                if (this.result_pop.length > 0) {
                    this.couponchecked = true;

                    this.couponid = this.result_pop[0].couponId;
                    this.couponAmount = this.result_pop[0].value;
                    let amount1 = this.totalNetPayable - this.shippingAmount
                    console.log(this.totalNetPayable, this.shippingAmount)
                    if(this.result_pop[0].couponType == 1 || this.result_pop[0].couponType == '1'){
                        this.couponAmount = (amount1 * this.result_pop[0].value) / 100;
                        let amount2 = amount1 - ((amount1 * this.result_pop[0].value) / 100);
                        console.log(this.couponAmount)
                        this.finalvalue = amount2 + this.shippingAmount;
                        this.paidBal = amount2 + this.shippingAmount;
                        this.totalNetPayable = amount2 + this.shippingAmount;
                        // let productvalue = this.totalNetPayable / 100 * this.result_pop[0].value;
                        // this.couponAmount = this.totalNetPayable / 100 * this.result_pop[0].value;
                        // this.finalvalue = this.totalNetPayable - productvalue;
                        // this.paidBal = this.totalNetPayable - productvalue;
                        // this.totalNetPayable = this.paidBal;
                    }else{
                        this.finalvalue = (amount1 - this.result_pop[0].value) + this.shippingAmount;
                        this.paidBal = (amount1 - this.result_pop[0].value) + this.shippingAmount;
                        this.totalNetPayable = (amount1 - this.result_pop[0].value) + this.shippingAmount;
                    }
                    if (this.paidBal == 0){
                        document.getElementById('btnCheckout').removeAttribute("disabled");
                    }else if (this.paidBal < 0 && this.paidBal > 0) {
                        document.getElementById('btnCheckout').setAttribute("disabled", "disabled");
                    }
                }
                else {
                    this.finalvalue = this.totalNetPayable;
                    this.couponid = 0;
                }
            } else {
                this.finalvalue = this.totalNetPayable;
                this.openSnackBar(res.message, 'Thanks!')
                this.AdminService.playEventSound('success')
                this.couponchecked = false;
            }
        }, error => {
            this.couponchecked = false;
        })
    }
    
    openpay(){
        this.finalvalue = this.totalNetPayable;
        if(this.doi.value == null || this.dor.value == null){
            this.openSnackBar('Date of issue and Date of Return are required fields.', 'Error');
        }else{
            if (this.product.length && this.product.length > 0) {
                $('#container_pay').modal('show');
            }
            else {
                this.openSnackBar("No Item added!", 'Error');
                this.AdminService.playEventSound('error')
                $('#container_pay').modal('hide');
            }
        } 
    }

    clearFilters() {
        this.totalNetPayable = this.totalNetPayable + this.couponAmount
        this.clearpaymentVal();
        this.finalvalue = this.totalNetPayable;

        this.couponcodes = '';
        this.couponchecked = false;
        
        this.totalNetPayable = this.totalNetPayable + this.securityAmount;
        this.paidBal = 0 - this.totalNetPayable;
        this.discountInit = true;
        this.addDiscount(null);
        this.couponAmount = 0;
    }


    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    private _filterStates(value: string): State[] {
        const filterValue = value.toLowerCase();
        return this.states.filter(state => state.customerContactNo.toLowerCase().indexOf(filterValue) === 0 || state.customerName.toLowerCase().indexOf(filterValue) === 0);
    }

    _getCustomerListing() {
        let sendFranchiseId = 0
        if (this.loginData.userRole != 1) {
            sendFranchiseId = this.loginData.franchiseId
        }
        this.AdminService.getCustomerListing(sendFranchiseId).subscribe(data => {
            // console.log(data)
            if (data.statusCode == 200) {
                this.states = data.result
            } else {
                // this.openSnackBar(data.message,'Error')
            }
        }, err => {
            console.log(err)
            // this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
        })
    }

    getCategoryAndSubCategory() {
        this.AdminService.getCategoryAndSubCategory(0, 0).subscribe(res => {
            // console.log(res)
            if(res.statusCode == 200){
                this.categoryData = res.result;
                let obj = {
                    categoryId: 0, 
                    categoryName: "All",
                }
                let tempArr = []
                tempArr.push(obj)
                this.categoryData.filter(it=>{
                    tempArr.push(it)
                })
                this.categoryData = tempArr
            }
        }, err => {
            let noavailability = "no products are available"
            // this.toastr.error('Something went wrong, please try after some time', 'Error');
        })
    }
    showcategories(id) {
        if (id == 0) {
            return this.productData = this.backupProductdata;
        }
        for (let i = 0; i < this.backupProductdata.length; i++) {
            this.productData = this.backupProductdata.filter(
                data => data.categoryId == id);
        }
    }

    //filterRented() {
    //    this.productData = this.productData.filter(
    //        data => data.isRented == true);
    //    document.getElementById("divRent").style.display = "block";

    //}
    getItemProducts() {
        let sendObj = {
            franchiseId : this.loginData.franchiseId,
            type : 'Rent'
        }
        this.AdminService.GetItemsProductsAccToSaleOrRent(sendObj).subscribe(data => {
            this.showProgress = false;
            // console.log(data.result.length,"===========================================")
            this.backupProductdata = data.result.filter(data => data.isRented == true);
            // console.log(this.backupProductdata.length,"tttttttttttttttttttttttttttttttttttttttttt")
            this.productData = this.backupProductdata;
            // console.log(this.productData);
            for (var i = 0; i < this.productData.length; i++) {
                this.rentFilterDetails = this.rentDetails.filter(data1 => data1.itemId == this.productData[i].itemId);
                // console.log(this.rentFilterDetails);
                if (this.rentFilterDetails.length > 0) {
                    this.productData[i].returnDate = this.rentFilterDetails[0].returnDate;
                    if (this.productData[i].quantityStock != 0 && this.productData[i].quantityStock > 0)
                        this.productData[i].quantityStock = parseInt(this.productData[i].quantityStock) - parseInt(this.rentFilterDetails[0].quantity);
                }
            }
        }, err => {
            this.showProgress = false;
            console.log(err)
        })
    }
    getRentDetails() {
        // debugger;
        this.AdminService.GetRentGroupByDetails().subscribe(data => { this.rentDetails = data.result; });

    }
    onLogout() {
        // console.log("jjjjjjjjjj")
        localStorage.removeItem('isCashierLoggedin');
        this.router.navigate(['/login']);
        if (localStorage['superAdminChange']) {
            localStorage.removeItem('superAdminChange');
        }
    }



    removeItem(id, name, security) {
        this.AdminService.playEventSound('success')
        // debugger;
        // debugger;
        for (var i = 0; i < this.product.length; i++) {
            if (id === this.product[i].Id) {
                // debugger;
                if (this.product[i].Qty > 1) {
                    // debugger;
                    this.qty = this.product[i].Qty - 1;
                    this.product[i].Qty = this.qty;

                }
                else {
                    this.clearVal();
                    this.product.splice(i, 1);
                    this.shippingAmount = 0;
                }
                this.securityAmount = this.securityAmount - security;
            }
        }
        this.getTotal();
    }

    cancelItemDetails() {
        // debugger;
        for (var i = 0; i < this.product.length; i++) {
            if (i > -1) {
                this.product.splice(i);
            }
        }
        // this.product = []
        (<HTMLInputElement>document.getElementById('txtshipping')).value = '0';
        (<HTMLInputElement>document.getElementById('txtissuedate')).value = null;
        (<HTMLInputElement>document.getElementById('txtreturndate')).value = null;
        (<HTMLInputElement>document.getElementById('txtrentNotes')).value = null;
        (<HTMLInputElement>document.getElementById('txtBust')).value = null;
        (<HTMLInputElement>document.getElementById('txtHips')).value = null;
        (<HTMLInputElement>document.getElementById('txtSkirtlength')).value = null;
        (<HTMLInputElement>document.getElementById('txtwaist')).value = null;
        this.doi.reset();
        this.dor.reset();
        this.qty = 1;
        this.clearVal();
        this.shippingAmount = 0;
        this.securityAmount = 0;
        this.getTotal();
        this.clearpaymentVal();
        

        // this.totalValue =
        // this.securityAmount =
        // this.totalNetPayable =

    }
    addItem(id, name, price, image, quantity, security) {
        // debugger;
        var flag = 0,  sflag=0;
         if (quantity <= 0)
        {
            this.AdminService.playEventSound('error')  
            return;
        }
        if (this.product.length > 0) {
            for (var i = 0; i < this.product.length; i++) {
                if (id === this.product[i].Id && quantity > this.product[i].Qty) {
                    this.qty = this.product[i].Qty + 1;
                    this.product[i].Qty = this.qty;
                    this.product[i].Security = security;
                    sflag=1;

                    flag = 1;
                    this.AdminService.playEventSound('success')   
                    this.securityAmount += security;
                    break;
                }
                else {
                    let v = this.product.filter(p => p.Id == id);
                    if (v.length == 0) {
                        flag = 0;
                    }
                    else {
                        flag = 1;
                          // this.AdminService.playEventSound('error') 
                    }

                }
            }
            if (flag === 0) {
                this.qty = 1;
            }
            if (this.qty < 2 && flag == 0) {
                this.product.push({ Id: id, Name: name, Price: price, Qty: this.qty, image: image, Quantity: quantity, Security: security });
                  this.AdminService.playEventSound('success')   
                  sflag=1;
                this.securityAmount += security;
                // console.log("Added" + this.securityAmount);
            }
        }
        else {
            this.product.push({ Id: id, Name: name, Price: price, Qty: this.qty, image: image, Quantity: quantity, Security: security });
              this.AdminService.playEventSound('success')   
              sflag=1;
            this.securityAmount += security;
            // console.log("Added" + this.securityAmount);
        }

           if(sflag==0)
           this.AdminService.playEventSound('error')  

        this.getTotal();
    }



    clearVal() {
        this.discountVal1 = "";
        this.discountVal = 0;
        this.discountVal2 = 0;
        this.totalNetPayable = this.totalValue - this.discountVal;
        this.totalNetPayable = this.totalNetPayable + this.shippingAmount + this.securityAmount;
        this.paidBal = 0 - this.totalNetPayable;
        if (this.paidBal == 0)
            document.getElementById('btnCheckout').removeAttribute("disabled");
        else if (this.paidBal < 0 && this.paidBal > 0) {
            document.getElementById('btnCheckout').setAttribute("disabled", "disabled");
        }
    }
    clearpaymentVal() {
        this.paymentVal1 = "";
        this.paymentVal = 0;
        this.paymentVal = 0;
        //this.totalNetPayable = this.totalValue - this.discountVal + this.securityAmount + this.shippingAmount;
        if (this.fixedValue == 1) {
            this.totalNetPayable = this.totalValue - this.discountVal;
        }
        else {
            this.totalNetPayable = this.totalValue - (this.totalValue * (this.discountVal / 100));
        }
        this.totalNetPayable = this.totalNetPayable + this.securityAmount + this.shippingAmount;
        this.paidBal = 0 - this.totalNetPayable;
        document.getElementById('btnCheckout').setAttribute("disabled", "disabled");
        document.getElementById('btnAdd').removeAttribute("disabled");
        document.getElementById('btnAddFullPayment').removeAttribute("disabled");
        //  this.totalNetPayable = this.totalValue - this.discountVal;
    }
    onChange(event: any) {
        this.addDiscount(event.target.value);
    };
    onChangePayment(event: any) {
        this.paymentVal1 = this.paymentVal1 + event.target.value;
    }
    async onChangeissueDate(event: any) {
        // console.log(event.target.value)
        let date = new Date(event.target.value)
        let date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() );
        this.dor.reset();
        this.dateSelect.dorMin = await moment(date2).format("YYYY-MM-DD");
        
        this.dateofIssue = event.target.value;
        if (this.dateofIssue == "" || this.dateofreturn == "") {
            this.openSnackBar('Date of issue and Date of Return are required fields.', 'Error');
            this.AdminService.playEventSound('error')
            document.getElementById('aPaylink').setAttribute("disabled", "disabled");
            return;
        }
        else
            document.getElementById('aPaylink').removeAttribute("disabled");
    }
    onChangereturnDate(event: any) {
        this.dateofreturn = event.target.value;
        if (this.dateofIssue == "" || this.dateofreturn == "") {
            this.openSnackBar('Date of issue and Date of Return are required fields.', 'Error');
            this.AdminService.playEventSound('error')
            document.getElementById('aPaylink').setAttribute("disabled", "disabled");
            return;
        }
        else
            document.getElementById('aPaylink').removeAttribute("disabled");
    }
    addPayment(val) {
        if(val == '←' && this.paymentVal1.length > 0){
            this.paymentVal1 = this.paymentVal1.slice(0, -1)
        }else if(val != '←'){        
            this.paymentVal1 = this.paymentVal1 + val;
            document.getElementById('btnAdd').removeAttribute("disabled");
            document.getElementById('btnAddFullPayment').removeAttribute("disabled");
        }
        this.finalvalue = this.paidBal;
    }
    addPaymentTotal() {
        // debugger;
        if (this.paymentVal1 == '')
            this.paymentVal = 0;
        else
            this.paymentVal = parseInt(this.paymentVal1);
        if (this.paymentVal > this.totalNetPayable) {
            this.paidBal = this.paymentVal - this.totalNetPayable;
        }
        else {
            this.paidBal = this.paymentVal - this.totalNetPayable;
        }
        //this.paidBal = this.totalNetPayable - this.paymentVal;
        if (this.paidBal == 0) {
            document.getElementById('btnCheckout').removeAttribute("disabled");
            document.getElementById('btnAdd').setAttribute("disabled", "disabled");
            document.getElementById('btnAddFullPayment').setAttribute("disabled", "disabled");
        }
        else if (this.paidBal < 0 && this.paidBal > 0) {
            document.getElementById('btnCheckout').setAttribute("disabled", "disabled");
        }
        this.finalvalue = this.paidBal;
        //this.totalNetPayable = this.paidBal;
    }

    addFullPayment() {
        this.paymentVal = this.totalNetPayable;
        this.paidBal = this.totalNetPayable - this.paymentVal;
        if (this.paidBal == 0) {
            document.getElementById('btnCheckout').removeAttribute("disabled");
            document.getElementById('btnAdd').setAttribute("disabled", "disabled");
            document.getElementById('btnAddFullPayment').setAttribute("disabled", "disabled");
        }
        else if (this.paidBal < 0 && this.paidBal > 0) {
            document.getElementById('btnCheckout').setAttribute("disabled", "disabled");
        }
        this.finalvalue = this.paidBal;
    }
    fixedVal(val) {
        this.fixedValue = val;
        if (val == 1) {
            document.getElementById('percentVal').classList.remove("active");
            document.getElementById('fixedVal').classList.add("active");
        }
        else {
            document.getElementById('fixedVal').classList.remove("active");
            document.getElementById('percentVal').classList.add("active");

        }
          this.discountInit = true;
        this.addDiscount(null);
    }
    getTotal() {
        //this.customerInfo = this._filterStates(this.stateCtrl.value);
        //console.log(this.customerInfo);
        var tot = 0;
        var productTotal = 0;
        for (var i = 0; i < this.product.length; i++) {
            tot += (this.product[i].Price * this.product[i].Qty)
            for (var j = 0; j < this.product[i].Qty; j++) {
                productTotal += 1;
            }
        }
        this.productCountTotal = productTotal;
        this.totalValue = tot;
        this.productCount = this.product.length;
        if (this.fixedValue == 1) {
            this.totalNetPayable = this.totalValue - this.discountVal;
        }
        else {
            this.totalNetPayable = this.totalValue - (this.totalValue * (this.discountVal / 100));
        }
        this.totalNetPayable = this.totalNetPayable + this.securityAmount;
        this.paidBal = 0 - this.totalNetPayable;
          this.discountInit = true;
        this.addDiscount(null);
    }

    
    addDiscount(val1) {
        if (val1 != null && val1 != '←') {
            this.discountVal1 = this.discountVal1 + val1;
        }
        else if(val1 != null && val1 == '←'){
            let disTemp = this.discountVal1.toString();
            if(this.discountVal1.length > 1){
                this.discountVal1 = disTemp.slice(0, -1)
            }else{
                this.discountVal1 = "0";
            }
        }
        else if (this.discountVal==0) {
            this.discountVal1 = "0";
        } 
        this.discountVal = parseInt(this.discountVal1);
        if (this.fixedValue == 2) {
            if (this.discountVal > 100) {
                this.discountVal = 100;
            }
            this.discountVal2 = Number((this.totalValue * (this.discountVal / 100)).toFixed(2));
        }
        if (this.fixedValue == 1) {
            if (this.discountVal > this.totalNetPayable) {
                this.discountVal = this.totalValue;
            }
            this.totalNetPayable = this.totalValue - this.discountVal;
        }
        else {
            this.totalNetPayable = this.totalValue - (this.totalValue * (this.discountVal / 100));
        }
        this.totalNetPayable = this.totalNetPayable + this.shippingAmount + this.securityAmount;
        this.paidBal = 0 - this.totalNetPayable;
    }  

    openCity(evt, cityName) {
        this.cashPopUpSelectedTabs = cityName
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }
    applyShippingAmount() {
        // debugger;
        var shippingAmt = ((document.getElementById("txtshipping") as HTMLInputElement).value);
        this.totalNetPayable = this.totalNetPayable - this.shippingAmount;
        if (shippingAmt == "") {
            shippingAmt = "0";
        }
        this.shippingAmount = parseInt(shippingAmt);
        this.totalNetPayable = this.totalNetPayable + this.shippingAmount;
        this.paidBal = 0 - this.totalNetPayable;
        $('#shippingpopup').modal('hide');
    }

    getCashPaymentTabFocus(type) {
        if (type == this.cashPopUpSelectedTabs) {
            return 'tab-focused';
        } else {
            return '';
        }
    }


    matchbarcode(searchString){
  
        for(let i =0;i<this.productData.length;i++){
            this.barcode = this.productData[i].barcode;
        // console.log(this.barcode)
            if(searchString == this.productData[i].barcode){
            // console.log("hello");
            // let id = this.productData[i].itemId;
            // let quantity = this.productData[i].quantityStock ;
            this.addItem(this.productData[i].itemId, this.productData[i].itemName, this.productData[i].itemSalePrice, this.productData[i].productLogo, this.productData[i].quantityStock,this.productData[i].security);

            }
        }

    }

    
    openCashPayContainer() {
        this.cashPopUpSelectedTabs = 'payment';

        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById('payment').style.display = "block";

        $('#container_pay').modal('show');
    }
    proceedCheckout() {
        // debugger;
        if (this.result_pop) {
              this.AdminService.playEventSound('success')   
            if (this.result_pop.length > 0) {
                for (let i = 0; i < this.result_pop.length; i++) {
                    this.couponid = this.result_pop[i].couponId;
                    this.couponAmount = this.result_pop[i].value;
                    this.finalvalue = this.paidBal - this.result_pop[i].value;
                    // if (this.result_pop[i].couponCode == this.CouponCode1) {
                    //     this.AdminService.onDeletecoupon(this.productids, this.couponid).subscribe(res => {
                    //         // debugger
                    //         console.log("deleted sucessfully");
                    //     })
                    // }
                    this.AdminService.onDeletecoupon(this.productids, this.couponid).subscribe(res => {
                        // debugger
                        // console.log("xyz",this.productids,this.couponId);
                         // console.log("deleted sucessfully")
                     })
                }
            }
        }
        // debugger;
        if (this.paidBal != 0) {
            this.openSnackBar('Cannot proceed with  zero amount paid.', 'Error')
            this.AdminService.playEventSound('error')
            // alert('Cannot proceed with  zero amount paid');
        }
        else {
            var issueDate = ((document.getElementById("txtissuedate") as HTMLInputElement).value);
            var returDate = ((document.getElementById("txtreturndate") as HTMLInputElement).value);
            if (issueDate == "" || returDate == "") {
                this.openSnackBar('Date of issue and Date of Return are required fields.', 'Error');
                this.AdminService.playEventSound('error')
                return;
            }
            this.rent.Amount = this.totalNetPayable;
            this.rent.RentTotalPrice = this.totalValue;
            this.rent.ReceivedAmount = this.paymentVal;
            this.rent.BalanceAmount = this.paidBal;
            this.rent.Quantity = this.productCountTotal;
            this.rent.RentedOn = issueDate;
            this.rent.ReturnDate = returDate;
            this.rent.Hips = ((document.getElementById("txtHips") as HTMLInputElement).value);
            this.rent.SkirtLength = ((document.getElementById("txtSkirtlength") as HTMLInputElement).value);
            this.rent.Waist = ((document.getElementById("txtwaist") as HTMLInputElement).value);
            this.rent.Bust = ((document.getElementById("txtBust") as HTMLInputElement).value);
            if (this.fixedValue == 1)
                this.rent.Discount = this.discountVal;
            else
                this.rent.Discount = this.discountVal2;
            if (this.stateCtrl.value != null) {
                this.customerInfo = this._filterStates(this.stateCtrl.value);
                this.rent.CustomerId = this.customerInfo[0].customerId;
                this.customerNme = this.customerInfo[0].customerName;
                this.customerPhone = this.customerInfo[0].customerContactNo;
                this.customerAddres = this.customerInfo[0].customerAddress;
            }
            else {
                this.AdminService.GetGuestCustomerByFranchiseId(this.loginData.franchiseId).subscribe(data => {
                    this.cstId = data.result.customerId;
                });
                this.rent.CustomerId = this.cstId;
                this.customerNme = 'Guest';
                this.customerPhone = '-';
                this.customerAddres = '-';
            }
            this.rent.CouponCode = this.CouponCode1;
            this.rent.CouponValue = this.couponAmount;
            this.rent.FranchiseId = this.loginData.franchiseId;
            this.rent.IssuedBy = this.loginData.userId;
            this.rent.ShippingAmount = this.shippingAmount;
            this.rent.Security = this.securityAmount;
            this.rent.Notes = ((document.getElementById("txtrentNotes") as HTMLInputElement).value);
            var tot = 0;
            var secr = 0;
            for (var i = 0; i < this.product.length; i++) {
                tot = (this.product[i].Price * this.product[i].Qty)
                secr = (this.product[i].Security * this.product[i].Qty)
                this.allrentDetails.push({ ItemId: this.product[i].Id, Quantity: this.product[i].Qty, UnitPrice: this.product[i].Price, TotalPrice: tot, ReturnDate: null, Security: this.product[i].Security, TotalSecurity: secr });
            }
            this.rent.rentDetails = this.allrentDetails;
            this.AdminService.AddRent(this.rent).subscribe(data => this.openSnackBar(data.message, 'Success'));
            this.AdminService.playEventSound('success')
            $('#container_pay').modal('hide');
            this.print();
            this.cancelItemDetails();
            this.ngOnInit();
            //document.getElementById("txtissuedate").value = "";
            // document.getElementById("txtreturndate").value = "";
        }
    }

    print(): void {
        // debugger;
        let printContents, popupWin;
        printContents = document.getElementById('print-contents').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Invoice</title>
              <style>
              //........Customized style.......
              </style>
            </head>
            <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
        // location.reload();
    }
    addCustomer() {
        let dialogRef = this.dialog.open(AddCustomerDialog2, {
            width: '1000px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // console.log(result)
                this.states.push(result)
                this.openSnackBar("Customer Inserted Successfully!", 'Success')
                this.AdminService.playEventSound('success')
            }
        });
    }

    onClickAddNotes() {
        let dialogRef = this.dialog.open(AddNotesDialog2, {
            width: '700px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.notesData1 = result;
                // console.log(this.notesData1);
            }
        });
    }

    goBackToAdminDashboard() {
        this.loginData.userRole = 2
        let userData = JSON.stringify(this.loginData);
        let encrypData = CryptoJS.AES.encrypt(userData, 'pos_masRetail').toString()
        localStorage.setItem('loginUserData', encrypData);
        localStorage.removeItem('isCashierLoggedin');
        localStorage.setItem('isLoggedin', 'true');
        this.router.navigate(['/admin/dashboard']);
    }

    _getSingleFranchiseDetail(franchiseId) {
        this.AdminService.GetFrenchiesDetail(franchiseId).subscribe(data => {
            // console.log(data);
            if (data.statusCode == 200) {
                this.AdminFranchiseData = data.result[0]
                // console.log(this.AdminFranchiseData)
            }
        }, err => {
            console.log(err)
        })
    }

    onAddItems() {
        this.finalvalue = this.totalNetPayable;
        const dialogRef = this.dialog.open(CashierAddItemComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.openSnackBar("Item Inserted Successfully!", 'Success');
                this.AdminService.playEventSound('success')
                // console.log(result)
                this.backupProductdata.push(result);
            }
        });
    }

    onPuttingHold() {
        if (this.product.length && this.product.length > 0) {
            let dialogRef = this.dialog.open(HoldPopupComponent, {
                width: '700px',
                data: {
                    currency: this.currency,
                    totalValue: this.totalValue,
                    totalNetPayable: this.totalNetPayable,
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let sendData = this.createObjToSaveForHold(result.orderName)
                    // console.log(sendData)
                    this.AdminService.onAddEditHoldOrder(sendData).subscribe(res => {
                        if (res.statusCode == 200) {
                            this.cancelItemDetails();
                            this.openSnackBar(res.message, 'Success');
                            this.AdminService.playEventSound('success')
                            this.stateCtrl.reset();
                        } else {
                            this.openSnackBar(res.message, 'Error');
                            this.AdminService.playEventSound('error')
                        }
                    }, err => {
                        this.openSnackBar("Server Encountered with some error, please try after some time.", 'Error');
                        this.AdminService.playEventSound('error')
                    })
                    // this.openSnackBar("Item Inserted Successfully!", 'Success');
                }
            });
        } else {
            this.openSnackBar("No Item added!", 'Error');
            this.AdminService.playEventSound('error')
        }
    }

    createObjToSaveForHold(OrderName) {
        let tempItem = []
        for (var i = 0; i < this.product.length; i++) {
            let tempObj = {
                ItemId: this.product[i].Id,
                UnitPrice: this.product[i].Price,
                Quantity: this.product[i].Qty,
                SubTotal: this.product[i].Qty * this.product[i].Price,
                securityAmount: this.product[i].Security
            }
            tempItem.push(tempObj)
            if (i == this.product.length - 1) {
                if (this.stateCtrl.value != null) {
                    this.customerInfo = this._filterStates(this.stateCtrl.value);
                    this.sale.CustomerId = this.customerInfo[0].customerId;
                }
                else {
                    this.sale.CustomerId = 31;
                }
                let discount = 0
                if (this.fixedValue == 1) {
                    discount = this.discountVal
                } else if (this.fixedValue == 2) {
                    discount = this.discountVal2
                }
                // let date = new Date();
                let cbObj = {
                    HoldBy: this.loginData.userId,
                    FranchiseId: this.loginData.franchiseId,
                    // OrderDate : date,
                    CustomerId: this.sale.CustomerId,
                    Amount: this.totalNetPayable,
                    DiscountType: this.fixedValue,
                    Discount: discount,
                    OrderCode: null,
                    OrderName: OrderName,
                    HoldOrderDetailList: tempItem,
                    shippingCharges: ((document.getElementById("txtshipping") as HTMLInputElement).value),
                    isRent: true,
                    RentedOn: this.doi.value,
                    ReturnDate: this.dor.value,
                    Notes: ((document.getElementById("txtrentNotes") as HTMLInputElement).value)
                }
                return cbObj;
            }
        }
    }

    //emptyCart() {
    //    this.product = []
    //    this.totalValue = 0
    //    this.discountVal = 0
    //    this.discountVal2 = 0
    //    this.totalNetPayable = 0
    //}

    // onUnholdListPopUp() {
    //     let dialogRef = this.dialog.open(HoldListComponent, {
    //         width: '1400px',
    //         height: '600px',
    //         data: {
    //             userData: this.loginData,
    //             currencySymbol: this.currency,
    //             isRent: true
    //         }
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             console.log(result)
    //             this.cancelItemDetails();
    //             this._deleteBillFromHoldList(result.orderId);
    //             // this.fixedValue = result.discountType
    //             // this.totalNetPayable = result.amount
    //             if (this.fixedValue == 1) {
    //                 this.discountVal = result.discount
    //             } else if (this.fixedValue == 2) {
    //                 this.discountVal2 = result.discount
    //             }
    //             this.sale.CustomerId = result.customerId
    //             console.log('fffffffffffffffffffff :', result.holdOrderDetailList.length)
    //             var itemList = result.holdOrderDetailList
    //             for (var i = 0; i < itemList.length; i++) {
    //                 // addItem(id, name, price, image, quantity)
    //                 let Qty = parseInt(itemList[i].quantity)
    //                 console.log(itemList[i].itemId, itemList[i].itemName, itemList[i].unitPrice, itemList[i].itemLogo, itemList[i].quantity)
    //                 for (var j = 0; j < Qty; j++) {
    //                     this.addItem(itemList[i].itemId, itemList[i].itemName, itemList[i].unitPrice, itemList[i].itemLogo, itemList[i].remainingItem, itemList[i].securityAmount)
    //                 }
    //             }
    //             (<HTMLInputElement>document.getElementById('txtshipping')).value = result.shippingCharges;
    //             if(result.rentedOn != null && result.rentedOn != ''){
    //                 (<HTMLInputElement>document.getElementById('txtissuedate')).value = result.rentedOn.split('T')[0];
    //             }
    //             if(result.returnDate != null && result.returnDate != ''){
    //                 (<HTMLInputElement>document.getElementById('txtreturndate')).value = result.returnDate.split('T')[0];
    //             }
    //             (<HTMLInputElement>document.getElementById('txtrentNotes')).value = result.notes;
    //             (<HTMLInputElement>document.getElementById('txtDiscount')).value = result.discount;

    //             this.shippingAmount = result.shippingCharges;
    //             this.totalNetPayable = this.totalNetPayable + this.shippingAmount;
    //         }
    //     });
    // }
    onUnholdListPopUp() {
        let dialogRef = this.dialog.open(HoldListComponent, {
            width: '1400px',
            // height: '600px',
            data: {
                userData: this.loginData,
                currencySymbol: this.currency,
                isRent: true
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // console.log(result)
                this.cancelItemDetails();
                this._deleteBillFromHoldList(result.orderId);
                // this.fixedValue = result.discountType
                // this.totalNetPayable = result.amount
                this.fixedValue = result.discountType
                this.sale.CustomerId = result.customerId
                // console.log('fffffffffffffffffffff :', result.holdOrderDetailList.length)
                var itemList = result.holdOrderDetailList
                for (var i = 0; i < itemList.length; i++) {
                    // addItem(id, name, price, image, quantity)
                    let Qty = parseInt(itemList[i].quantity)
                    // console.log(itemList[i].itemId, itemList[i].itemName, itemList[i].unitPrice, itemList[i].itemLogo, itemList[i].quantity)
                    for (var j = 0; j < Qty; j++) {
                       this.addItem(itemList[i].itemId, itemList[i].itemName, itemList[i].unitPrice, itemList[i].itemLogo, itemList[i].remainingItem, itemList[i].securityAmount)
                    }
                }
                this.discountVal = result.discount
                var tempDiscount = result.discount.toString()
                if (this.fixedValue == 2) {
                    // console.log("oooooooooooooooooooooooooo")
                    this.discountVal2 = result.discount
                    tempDiscount = (result.discount * 100)/this.totalValue
                    // console.log(result.discount, this.totalValue, tempDiscount)
                }
                (<HTMLInputElement>document.getElementById('txtshipping')).value = result.shippingCharges;
                this.shippingAmount = result.shippingCharges;
                this.totalNetPayable = this.totalNetPayable + this.shippingAmount;
                // console.log("rrrrrrrrrrrrrrrrrrrrrrrrr",this.discountVal)
                // this.discountVal1 = tempDiscount
                // (<HTMLInputElement>document.getElementById('txtDiscount')).value  = tempDiscount
                this.updateFewThings(tempDiscount);
                if(result.rentedOn != null && result.rentedOn != ''){
                    this.doi.setValue(result.rentedOn.split("T")[0])
                }
                if(result.returnDate != null && result.returnDate != ''){
                    this.dor.setValue(result.returnDate.split("T")[0])
                }
                if(result.customerNumber && result.customerNumber != null && result.customerNumber != ''){
                    this.stateCtrl.setValue(result.customerNumber)
                }
            }
        });
    }

    updateFewThings(tempDiscount){
        this.addDiscount(tempDiscount)
        // this.discountVal1 = tempDiscount.toString();
        // (<HTMLInputElement>document.getElementById('txtDiscount')).value  = tempDiscount
    }

    _deleteBillFromHoldList(orderId) {
        this.AdminService.billUnholdOrDeleteForUnholdList(orderId).subscribe(res => {
            if (res.statusCode == 200) {
                // console.log(res.message)
            } else {
                console.log(res.message)
            }
        }, err => {
            console.log(err)
        })
    }

    openDiscountPopUp() {
        if (this.product.length && this.product.length > 0) {
            $('#discount_popUp').modal('show');
        } else {
            this.openSnackBar("No Item added!", 'Error');
            this.AdminService.playEventSound('error')
        }
    }

}


@Component({
    selector: 'add-customer-dialog',
    templateUrl: 'add-customer.html'
})

export class AddCustomerDialog2 {
    dateSelect:any;
    formSendData:any;
    loginData: any;
    formServiceData: any;
    customerForm: FormGroup;
    constructor(public dialogRef: MatDialogRef<AddCustomerDialog2>, @Inject(MAT_DIALOG_DATA) public data: any,
        private AdminService: AdminService, public dialog: MatDialog, private formbulider: FormBuilder,
        private _snackBar: MatSnackBar, ) {
        this.dateSelect = {}
        this.formSendData = {}
        this.formServiceData = {}
       this.customerForm = this.formbulider.group({
        CustomerId: [null],
        FranchiseId: [null, [Validators.required]],
        CustomerName: [null, [Validators.required]],
        CustomerContactNo: [null, [Validators.required]],
        CustomerAddress: [null],
        DateOfBirth: [null],
        CustomerN: [null, [Validators.required]],
        City: [null],
        ContactTitle: [null],
        Region: [null],
        PostalCode: [null],
        Country: [null],
        Fax: [null],
        ContectName: [null]
        });
        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            // console.log(this.loginData)
        }

    }

    ngOnInit() {
        this.getSeletedDates();
        this._getFranchise();
    }


    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    async getSeletedDates() {
        let today = new Date();
        let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        // console.log(today, tomorrow)
        this.dateSelect.doiMin = await moment(today).format("YYYY-MM-DD");
        this.dateSelect.dorMin = await moment(tomorrow).format("YYYY-MM-DD");
        // console.log(this.dateSelect.doiMin, this.dateSelect.dorMin)
    }
    
    _getFranchise() {
        this.AdminService.getFranchiseDetails().subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.franchiseList = data.result
            }
            if (this.loginData.userRole != 1) {
                this.customerForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
                this.customerForm.controls['FranchiseId'].disable();
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

        onSubmit() {
           
           if(this.customerForm.valid){
            if (this.customerForm.value.CustomerId == 0 || this.customerForm.value.CustomerId == null) {
                delete this.customerForm.value.CustomerId
            }
            this.customerForm.value.FranchiseId = this.loginData.franchiseId

           let sendData = this.submitObject();

            this.AdminService.onAddAndAditCoustomerData(sendData).subscribe(data => {
                // debugger
                if (data.statusCode == 200) { 
                    this.dialogRef.close(data.result);
                    // console.log(data)
                } else {
                    console.log(data.message)
                    this.openSnackBar(data.message, 'Error')
                }
            }, err => {
                console.log(err)
                this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
                this.AdminService.playEventSound('error')
            })
           }else{
            this.validateAllFormFields(this.customerForm); 
           }
        }
    
        validateAllFormFields(formGroup: FormGroup) {
            Object.keys(formGroup.controls).forEach(field => {
              const control = formGroup.get(field);
              if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
              } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
              }
            });
        }

        submitObject() {
        this.formSendData = {}
        if (this.customerForm.value.CustomerId != 0 && this.customerForm.value.CustomerId != null) {
        this.formSendData.CustomerId = this.customerForm.value.CustomerId
        }
        this.formSendData.CustomerName = this.customerForm.value.CustomerName
        this.formSendData.CustomerContactNo = this.customerForm.value.CustomerContactNo
        this.formSendData.CustomerAddress = this.customerForm.value.CustomerAddress
        this.formSendData.DateOfBirth = this.customerForm.value.DateOfBirth
        this.formSendData.contactName = this.customerForm.value.ContectName
        this.formSendData.contactTitle = this.customerForm.value.ContactTitle
        this.formSendData.city = this.customerForm.value.City
        this.formSendData.region = this.customerForm.value.Region
        this.formSendData.postalCode = this.customerForm.value.PostalCode
        this.formSendData.country = this.customerForm.value.Country
        this.formSendData.fax = this.customerForm.value.Fax
        this.formSendData.nickName = this.customerForm.value.CustomerN
        if (this.loginData.userRole == 1) {
        this.formSendData.FranchiseId = this.customerForm.value.FranchiseId
        } else {
        this.formSendData.FranchiseId = this.loginData.franchiseId
        }
        return this.formSendData
        } 


}

@Component({
    selector: 'add-notes-dialog',
    templateUrl: 'add-notes.html'
})

export class AddNotesDialog2 {
    noteData
    constructor(public dialogRef: MatDialogRef<AddNotesDialog2>, @Inject(MAT_DIALOG_DATA) public data: any,
        private AdminService: AdminService, public dialog: MatDialog) {

    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    public onSubmit() {

        this.dialogRef.close(this.noteData);
        // this.websiteService.updateFormRecord(sendData).subscribe(data=>{
        //   console.log(data);
        //   if(data.error == false){
        //     this.toastr.success(data.message, '')
        //     this.dialogRef.close(sendData);
        //   }else{
        //     console.log(data.message)
        //     this.toastr.error(data.message, 'Error')
        //   }
        // },err=>{
        //   console.log(err)
        //   this.toastr.error('Something went wrong, please try after some time', 'Error');
        // })
    }

}