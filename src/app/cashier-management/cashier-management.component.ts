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
declare var $: any;
import { HoldListComponent } from './hold-list/hold-list.component';
import {TranslateService} from '@ngx-translate/core';

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
import { HoldPopupComponent } from './hold-popup/hold-popup.component';

@Component({
    selector: 'app-cashier-management',
    templateUrl: './cashier-management.component.html',
    styleUrls: ['./cashier-management.component.scss']
})
export class CashierManagementComponent implements OnInit {
    showProgress:any;
    myDate = new Date();
    couponcodes;
    searchString: string;
    backupProductdata: any;
    productData: any;
    categoryData: any;
    product: any[] = [];
    dataHtml: string = "";
    qty: number = 1;
    totalValue: number = 0;
    productCount: number = 0;
    discountVal: number = 0;
    discountVal2: number = 0;
    discountVal1 = "";
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
    notesData1: any;
    superAdmin: boolean = false;
    AdminFranchiseData: any;
    currencydata: any;
    frenchiseid: any;
    couponRecord: any;
    finalvalue: number;
    currentdate = moment(new Date()).format('L');
    systemTime = moment(new Date()).format('LT');
    CouponCode1: any;
    productids: any;
    body: { "ProductId": any; "CouponCode": any; };
    result_pop: any;
    customerPhone: string = "-";
    customerNme: string = "-";
    customerAddress: any;
    couponId: number = 0;
    couponid: number = 0;
    couponAmount: number = 0;
    shippingAmount: number = 0;
    taxvalue: any;
    cashPopUpSelectedTabs: string = 'payment';
    cstId: any;
    productpricevalue: any;
    couponchecked: boolean;
    discountInit: boolean= false;
    barcode:any;

    slides = [
        {img: "http://placehold.it/350x150/000000"},
        {img: "http://placehold.it/350x150/111111"},
        {img: "http://placehold.it/350x150/333333"},
        {img: "http://placehold.it/350x150/666666"}
    ];
    slideConfig = {"slidesToShow": 4, "slidesToScroll": 1,autoplay: false};

    slickAll = false
    slideToGo = 0
    constructor(private datePipe: DatePipe, private route: ActivatedRoute, private _snackBar: MatSnackBar,
        public router: Router, private AdminService: AdminService, public dialog: MatDialog, public translate: TranslateService) {
            translate.addLangs(['en', 'sp']);
           
            const browserLang = translate.getBrowserLang();
            translate.use(browserLang.match(/en|sp/) ? browserLang : 'en');
            this.sale = new sale();
            this.rent = new rent();
            this.filteredStates = this.stateCtrl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterStates(state) : this.states.slice()),
            );
        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            // console.log(this.loginData)
            this._getSingleFranchiseDetail(this.loginData.franchiseId)
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
        this.translate.use('sp');
         $(".content111").mCustomScrollbar();
        this.showProgress = true;
        this.couponchecked = false;
        this.currency = this.AdminService.getCurrencyNew();
        this.getItemProducts();
        this.getCategoryAndSubCategory();
        this._getCustomerListing()
        this.updateLocalDateAndTime();
        this.bindCustomerData();
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

       
    test(){
        if(this.slickAll == false){
            this.slickAll = true
            return ''
        }else{
            return ''
        }
    }

    check001(data){
        this.translate.use('sp')
    }

  afterChange(e) {
            if(this.slideToGo == 0){
            $(".cstm-carousel").removeClass("expand");
            this.slideToGo++;
        }
    }

    soundEffect(type){
        this.AdminService.playEventSound('success')
        this.AdminService.playEventSound('error')
    }

    clearFilters() {
        this.totalNetPayable = this.totalNetPayable + this.couponAmount
        this.clearpaymentVal();
        this.paidBal = this.totalNetPayable;
        this.couponcodes = '';
        this.couponchecked = false;
        this.finalvalue = this.totalNetPayable;
        this.couponAmount = 0;
    }

    matchbarcode(searchString){
        
        for(let i =0;i<this.productData.length;i++){
        this.barcode = this.productData[i].barcode;
        if(searchString == this.productData[i].barcode){
        this.addItem(this.productData[i].itemId, this.productData[i].itemName, this.productData[i].itemSalePrice, this.productData[i].productLogo, this.productData[i].quantityStock);

        }
        }
    }


    bindCustomerData() {
        if (this.stateCtrl.value != null) {
            this.customerInfo = this._filterStates(this.stateCtrl.value);
            this.customerNme = this.customerInfo[0].customerName;
            this.customerPhone = this.customerInfo[0].customerContactNo;
            this.customerAddress = this.customerInfo[0].customerAddress;
        }
        else {
            this.customerNme = 'Guest';
            this.customerPhone = '-';
            this.customerAddress = '-';
        }
    }

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


    updateLocalDateAndTime() {
        this.systemTime = moment(new Date()).format('LT');
        this.currentdate = moment(new Date()).format('L');
        setTimeout(() => {
            this.updateLocalDateAndTime();
        }, 1000);
    }

    print(): void {
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
    }
    getProductData(frenchiseid) {
        this.AdminService.getproductdata_currency(frenchiseid).subscribe(data => {
            if (data.statusCode == 200) {

                this.currencydata = data.result;
                for (let i = 0; i < this.currencydata.length; i++) {
                    this.currency = this.currencydata[i].franchiseCurrencySymbol;
                }
            }
        }, err => {
        })
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
            if (data.statusCode == 200) {
                this.states = data.result
            } else {
            }
        }, err => {
        })
    }

    getCategoryAndSubCategory() {
        this.AdminService.getCategoryAndSubCategory(0, 0).subscribe(res => {
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
                $("#slick_btn-1").trigger('click'); 
            }
        }, err => {
            let noavailability = "no products are available"
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

    
    getItemProducts() {
        let sendObj = {
            franchiseId : this.loginData.franchiseId,
            type : 'Sale'
        }
        this.AdminService.GetItemsProductsAccToSaleOrRent(sendObj).subscribe(data => {
            this.showProgress = false;
            this.backupProductdata = data.result.filter( data => data.isRented == false);
            this.productData = this.backupProductdata;
            for (let i = 0; i < this.backupProductdata.length; i++) {
                this.taxvalue = this.backupProductdata[i].tax;
            }

        }, err => {
            this.showProgress = false;
        })
    }
    onLogout() {
        localStorage.removeItem('isCashierLoggedin');
        this.router.navigate(['/login']);
        if (localStorage['superAdminChange']) {
            localStorage.removeItem('superAdminChange');
        }
    }

    removeItem(id, name) {
           this.AdminService.playEventSound('success') 
        for (var i = 0; i < this.product.length; i++) {
            if (id === this.product[i].Id) {
                if (this.product[i].Qty > 1) {
                    this.qty = this.product[i].Qty - 1;
                    this.product[i].Qty = this.qty;
                }
                else {
                    this.clearVal();
                    this.product.splice(i, 1);
                }
            }
        }
        this.getTotal();
    }


    cancelItemDetails() {
        for (var i = 0; i < this.product.length; i++) {
            if (i > -1) {
                this.product.splice(i);
            }
        }
        (<HTMLInputElement>document.getElementById('txtshipping')).value = '0';
        this.qty = 1;
        this.shippingAmount = 0;
        this.clearVal();
        this.clearpaymentVal();
        this.getTotal();
    }


    addItem(id, name, price, image, quantity) {
        var flag = 0, sflag=0;
         if (quantity <= 0)
        {
            this.AdminService.playEventSound('error')  
            return;
        }
        if (this.product.length > 0) {
            this.couponAmount = 0;
            for (var i = 0; i < this.product.length; i++) {
                if (id === this.product[i].Id && quantity > this.product[i].Qty) {
                    this.qty = this.product[i].Qty + 1;
                     sflag=1;
                    this.product[i].Qty = this.qty;
                    flag = 1;
                        this.AdminService.playEventSound('success')   
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
                this.product.push({ Id: id, Name: name, Price: price, Qty: this.qty, image: image, Quantity: quantity });
                  this.AdminService.playEventSound('success')   
                   sflag=1;
            }
        }
        else {
            this.product.push({ Id: id, Name: name, Price: price, Qty: this.qty, image: image, Quantity: quantity });
              this.AdminService.playEventSound('success')   
               sflag=1;
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
        this.totalNetPayable = this.totalNetPayable + this.shippingAmount;
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
        this.paidBal = 0 - this.totalNetPayable;
        document.getElementById('btnCheckout').setAttribute("disabled", "disabled");
        document.getElementById('btnAdd').removeAttribute("disabled");
        document.getElementById('btnAddFullPayment').removeAttribute("disabled");
    }

    onChange(event: any) {
        this.addDiscount(event.target.value);
    };


    onChangePayment(event: any) {
        this.paymentVal1 = this.paymentVal1 + event.target.value;
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
        if (this.paymentVal1 == '')
            this.paymentVal = 0;
        else
            this.paymentVal = parseInt(this.paymentVal1);
         if (this.totalNetPayable > this.paymentVal) {
            this.paidBal = this.paymentVal - this.totalNetPayable;
        }
        else {
            this.paidBal = this.paymentVal - this.totalNetPayable;
        }
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
        this.paidBal = 0 - this.totalNetPayable;
        this.discountInit = true;
        this.addDiscount(null);
    }

    applyShippingAmount() {
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
        this.totalNetPayable = this.totalNetPayable + this.shippingAmount;
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
   
    proceedCheckout() {
        if (this.result_pop) {
              this.AdminService.playEventSound('success')   
            
            if (this.result_pop.length > 0) {
                for (let i = 0; i < this.result_pop.length; i++) {
                    this.couponid = this.result_pop[i].couponId;
                    this.couponAmount = this.result_pop[i].value;
                    this.finalvalue = this.paidBal - this.result_pop[i].value;
                    this.AdminService.onDeletecoupon(this.productids, this.couponid).subscribe(res => {
                       
                     })
                }
            }
           
        }
        if (this.paidBal != 0) {
            alert('Cannot proceed with zero amount paid.');
        }
        else {
            this.sale.Amount = this.totalNetPayable;
            this.sale.SaleTotalPrice = this.totalValue;
            this.sale.ReceivedAmount = this.paymentVal;
            this.sale.BalanceAmount = this.paidBal;
            this.sale.Quantity = this.productCountTotal;
            if (this.fixedValue == 1)
                this.sale.Discount = this.discountVal;
            else
                this.sale.Discount = this.discountVal2;
            this.sale.FranchiseId = this.loginData.franchiseId;
            this.sale.CreatedBy = this.loginData.userId;
            if (this.stateCtrl.value != null) {
                this.customerInfo = this._filterStates(this.stateCtrl.value);
                this.sale.CustomerId = this.customerInfo[0].customerId;
                this.customerNme = this.customerInfo[0].customerName;
                this.customerPhone = this.customerInfo[0].customerContactNo;
                this.customerAddress = this.customerInfo[0].customerAddress;
            }
            else {
                this.AdminService.GetGuestCustomerByFranchiseId(this.loginData.franchiseId).subscribe(data => {
                    this.cstId = data.result.customerId;
                });
                this.sale.CustomerId = this.cstId;
                this.customerNme = 'Guest';
                this.customerPhone = '-';
                this.customerAddress = '-';
            }
            this.sale.CouponCode = this.CouponCode1;
            this.sale.CouponValue = this.couponAmount;
            this.sale.Notes = this.notesData1;
            this.sale.ShippingAmount = this.shippingAmount;
            var tot = 0;
            for (var i = 0; i < this.product.length; i++) {
                tot = (this.product[i].Price * this.product[i].Qty)
                this.saleDetails.push({ ItemId: this.product[i].Id, Quantity: this.product[i].Qty, UnitPrice: this.product[i].Price, TotalPrice: tot });
            }
            this.sale.saledetails = this.saleDetails;
            this.AdminService.AddSale(this.sale).subscribe(data => this.openSnackBar(data.message, 'Success'));
            this.AdminService.playEventSound('success')

            var dialog = document.getElementById("container_pay");
            $('#container_pay').modal('hide');
            this.print();
            this.cancelItemDetails();
            this.ngOnInit();
        }
      
    }


    addCustomer() {
        let dialogRef = this.dialog.open(AddCustomerDialog, {
            width: '1000px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.states.push(result)
                this.openSnackBar("Customer Inserted Successfully!", 'Success')
                this.AdminService.playEventSound('success')
            }
        });
    }

    onClickAddNotes() {
        let dialogRef = this.dialog.open(AddNotesDialog, {
            width: '700px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.notesData1 = result;
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
            if (data.statusCode == 200) {
                this.AdminFranchiseData = data.result[0]
            }
        }, err => {
        })
    }

    onAddItems() {
        const dialogRef = this.dialog.open(CashierAddItemComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.openSnackBar("Item Inserted Successfully!", 'Success');
                this.AdminService.playEventSound('success')
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
                securityAmount: 0
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
                let cbObj = {
                    HoldBy: this.loginData.userId,
                    FranchiseId: this.loginData.franchiseId,
                    CustomerId: this.sale.CustomerId,
                    Amount: this.totalNetPayable,
                    DiscountType: this.fixedValue,
                    Discount: discount,
                    OrderCode: null,
                    OrderName: OrderName,
                    HoldOrderDetailList: tempItem,
                    shippingCharges: ((document.getElementById("txtshipping") as HTMLInputElement).value),
                    isRent: false,
                }

                return cbObj;
            }
        }
    }

   
    onUnholdListPopUp() {
        let dialogRef = this.dialog.open(HoldListComponent, {
            width: '1400px',
            data: {
                userData: this.loginData,
                currencySymbol: this.currency,
                isRent: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result)
                this.cancelItemDetails();
                this._deleteBillFromHoldList(result.orderId);
                this.fixedValue = result.discountType
                this.sale.CustomerId = result.customerId
                var itemList = result.holdOrderDetailList
                for (var i = 0; i < itemList.length; i++) {
                    let Qty = parseInt(itemList[i].quantity)
                    for (var j = 0; j < Qty; j++) {
                        this.addItem(itemList[i].itemId, itemList[i].itemName, itemList[i].unitPrice, itemList[i].itemLogo, itemList[i].remainingItem)
                    }
                }
                this.discountVal = result.discount
                var tempDiscount = result.discount.toString()
                if (this.fixedValue == 2) {
                    this.discountVal2 = result.discount
                    tempDiscount = (result.discount * 100)/this.totalValue
                }
                (<HTMLInputElement>document.getElementById('txtshipping')).value = result.shippingCharges;
                this.shippingAmount = result.shippingCharges;
                this.totalNetPayable = this.totalNetPayable + this.shippingAmount;
                this.updateFewThings(tempDiscount);
                if(result.customerNumber && result.customerNumber != null && result.customerNumber != ''){
                    this.stateCtrl.setValue(result.customerNumber)
                }
            }
        });
    }

    updateFewThings(tempDiscount){
        this.addDiscount(tempDiscount)
        
    }

    _deleteBillFromHoldList(orderId) {
        this.AdminService.billUnholdOrDeleteForUnholdList(orderId).subscribe(res => {
            if (res.statusCode == 200) {
            } else {
            }
        }, err => {
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

    getCashPaymentTabFocus(type) {
        if (type == this.cashPopUpSelectedTabs) {
            return 'tab-focused';
        } else {
            return '';
        }
    }

    openCashPayContainer() {
          if (this.product.length && this.product.length > 0) {
        }
        else {
            this.openSnackBar("No Item added!", 'Error');
            this.AdminService.playEventSound('error')
            $('#container_pay').modal('hide');
            return '';
        }
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

}


@Component({
    selector: 'add-customer-dialog',
    templateUrl: 'add-customer.html'
})

export class AddCustomerDialog {
    dateSelect:any;
    formSendData:any;
    loginData: any;
    formServiceData: any;
    customerForm: FormGroup;
    couponRecord: any;
    finalvalue: number;
    constructor(public dialogRef: MatDialogRef<AddCustomerDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
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
        }

    }

    ngOnInit() {
        this._getFranchise();
        this.getSeletedDates();
    }

    async getSeletedDates() {
        let today = new Date();
        let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.dateSelect.doiMin = await moment(today).format("YYYY-MM-DD");
        this.dateSelect.dorMin = await moment(tomorrow).format("YYYY-MM-DD");
        }




    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
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
            }
        }, err => {
        })
    }

    onSubmit() {
         if(this.customerForm.valid){
            let sendData = this.submitObject();
            if (this.customerForm.value.CustomerId == 0 || this.customerForm.value.CustomerId == null) {
                delete this.customerForm.value.CustomerId
            }
            this.customerForm.value.FranchiseId = this.loginData.franchiseId
            this.AdminService.onAddAndAditCoustomerData(sendData).subscribe(data => {
                if (data.statusCode == 200) {
                    this.dialogRef.close(data.result);
                } else {
                    this.openSnackBar(data.message, 'Error')
                }
            }, err => {
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

export class AddNotesDialog {
    noteData
    constructor(public dialogRef: MatDialogRef<AddNotesDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
        private AdminService: AdminService, public dialog: MatDialog) {

    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    public onSubmit() {
        this.dialogRef.close(this.noteData);
    }




}