import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js'; 
import { DeleteConfirmationComponent } from '../Alerts/delete-confirmation/delete-confirmation.component';
declare var $: any;
import * as moment from 'moment';

@Component({
    selector: 'app-add-coupon',
    templateUrl: './add-coupon.component.html',
    styleUrls: ['./add-coupon.component.scss']
})


export class AddCouponComponent implements OnInit {

    selectedItems;
    itemName: any;
    itemIDs: any;
    categoryItems;
    // maps the local data column to fields property
    public localFields: Object = { text: 'itemName', value: 'itemId' };

    public localWaterMark: string = 'Select Products';
    currency: any;

    dropdownList = [];

    dropdownSettings = {};

    elements: any[];
    categoryelements: any[];
    formServiceData: any;
    couponForm: FormGroup;
    dateSelect: any;
    loginData: any;
    coupontype: any[] = [{ name: 'Percentage', value: 1 }, { name: 'Fixed amount', value: 2 }];
    IsActiveData: any[] = [{ name: 'Active', value: true }, { name: 'InActive', value: false }];
    selectedProductId = [2, 3, 4];
    couponRecord: any;
    length = 100;
    pageSize = 10;
    pageSizeOptions = [5, 10, 25, 100];
    public displayedColumns = ['couponCode', 'products', 'value', 'expirationDate', 'isActive', 'Action'];
    color = 'primary';
    disabled = false;
    constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
        private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {
        this.dateSelect = {}
        this.formServiceData = {}
        this.couponForm = this.formbulider.group({
            CouponId: [0],
            franchiseId: [null, [Validators.required]],
            couponcode: [null, [Validators.required]],
            Value: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
            CouponType: [null, [Validators.required]],
            IsActive: [null, [Validators.required]],
            ProductID: [null, [Validators.required]],
            CategoryId: [null, [Validators.required]],
            ExpirationDate: [null, [Validators.required]],
            StartDate: [null, [Validators.required]],
            Description: null,
            CreatedDate: null,
            DeletedDate: null,
            CreatedBy: [0],
            IsDeleted: [0],
            IsConsumed: [0],
        });

        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
        }

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'itemId',
            textField: 'itemName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: true
        };

        this.route.queryParams.subscribe(params => {
            if (params.couponId) {
                console.log(params)
                this.openEdit(params)
            }
        });

    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit() {
        this.currency = this.AdminService.getCurrencyNew();
        this.getSeletedDates();
        this._getFranchise();
        this._getCategory(this.loginData.franchiseId);
        if (this.loginData.userRole != 1) {
            this._getCouponListing(this.loginData.franchiseId);
        } else {
            this._getCouponListing(0);
        }

    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    onItemSelect(item: any) {
        // debugger;
        this.itemIDs = "";
        console.log(this.selectedItems)
        //console.log(this.selectedItems)
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.itemIDs = this.itemIDs + this.selectedItems[i].itemId + ","
            console.log(this.itemIDs)
        }
    }
    async getSeletedDates() {
        let today = new Date();
        let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        console.log(today, tomorrow)
        this.dateSelect.doiMin = await moment(today).format("YYYY-MM-DD");
        this.dateSelect.dorMin = await moment(tomorrow).format("YYYY-MM-DD");
        console.log(this.dateSelect.doiMin, this.dateSelect.dorMin)
    }

    onSelectAll(items: any) {
        // debugger;
        console.log(this.selectedItems)
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.itemIDs = this.itemIDs + this.selectedItems[i].itemId + ","
            console.log(this.itemIDs)
        }
    }


    onSubmit(formValue) {
        if(this.couponForm.valid){
            if (formValue.CouponId == 0 || formValue.CouponId == null) {
                delete formValue.CouponId
            }
    
            if (this.loginData.userRole != 1) {
                formValue.franchiseId = this.loginData.franchiseId;
            }
            // debugger;
    
            this.itemIDs = "";
            for (let i = 0; i < this.selectedItems.length; i++) {
                this.itemIDs = this.itemIDs + this.selectedItems[i].itemId + ","
                console.log(this.itemIDs)
            }
            formValue.ProductID = this.itemIDs;
    
    
    
    
            this.AdminService.AddCoupon(formValue, formValue.CreatedBy = this.loginData.userId).subscribe(data => {
                if (data.statusCode == 200) {
    
                    this.openSnackBar(data.message, 'Success')
                    this.ngOnInit();
                    this.couponForm.reset();
                }
                else
                    this.openSnackBar(data.message, 'Error')
            })
    
        }else{
            this.validateAllFormFields(this.couponForm);
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


    openEdit(data) {
        // debugger;
        if (this.loginData.userRole != 1) {
            this._getFranchise();
        }
        this.couponForm.controls['franchiseId'].setValue(data.franchiseId)
        this.couponForm.controls['CouponId'].setValue(data.couponId)
        this.couponForm.controls['couponcode'].setValue(data.couponCode)
        this.couponForm.controls['Description'].setValue(data.description)
        this.couponForm.controls['ExpirationDate'].setValue((data.expirationDate).split('T')[0])
        this.couponForm.controls['Value'].setValue(data.value)
        this.couponForm.controls['CouponType'].setValue(data.couponType)
        this.couponForm.controls['IsActive'].setValue(data.isActive)
        this.couponForm.controls['StartDate'].setValue((data.startDate).split('T')[0])
        this._getItemList2(data);
        window.scroll(0, 0);
    }

    public doFilter = (value: string) => {
        this.couponRecord.filter = value.trim().toLocaleLowerCase();
    }

    _getFranchise() {
        this.AdminService.getFranchiseDetails().subscribe(data => {
            // debugger;
            if (data.statusCode == 200) {
                this.formServiceData.franchiseList = data.result
                // debugger;
                if (this.loginData.userRole != 1) {
                    this.couponForm.controls['franchiseId'].setValue(this.loginData.franchiseId)
                    this.couponForm.controls['franchiseId'].disable();
                    this.couponForm.value.FranchiseId = this.loginData.franchiseId

                }
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }
    _getCategory(FranchiseId) {
        debugger;
        this.AdminService.getCategoryAndSubCategory(0, FranchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.categoryelements = data.result
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }
    DeleteCoupon(couponId) {
        // debugger;
        console.log("................")
        let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            width: '470px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                this.AdminService.deleteCoupon(couponId).subscribe(res => {
                    if (res.statusCode == 200) {

                        this.openSnackBar(res.message, 'Success')
                        this.ngOnInit();
                    } else {
                        this.openSnackBar(res.message, 'Error')
                    }
                }, err => {
                    this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
                });

            }
        });

    }


    ActivateCoupon(ccode) {
        this.AdminService.activateCoupon(ccode).subscribe(res => {
            if (res.statusCode == 200) {

                this.openSnackBar(res.message, 'Success')
                this.ngOnInit();
            } else {
                this.openSnackBar(res.message, 'Error')
            }
        }, err => {
            this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
        });

    }

    _getItemList(categoryId) {
        debugger;
        var franchiseId = this.loginData.franchiseId;
        this.formServiceData.products = []
        this.AdminService.GetItemsProductsByCategory(categoryId,franchiseId).subscribe(data => {
            console.log(data)
            if (data.statusCode == 200) {
                this.elements = data.result;
                this.dropdownList = data.result;
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getItemList2(dataNew) {
        // debugger;
        this.formServiceData.products = []
        this.AdminService.GetItemsProducts(dataNew.franchiseId).subscribe(data => {
            console.log(data)
            if (data.statusCode == 200) {
                this.elements = data.result;
                this.dropdownList = data.result;

                let x = dataNew.productId.split(",");

                console.log(x)
                var obj: any = []
                var k = 0;

                var k = 0;
                for (let i = 0; i < x.length; i++) {
                    for (let j = 0; j < this.elements.length; j++) {
                        if (x[i] == this.elements[j].itemId) {
                            obj[k] = this.elements[j];
                            k++;
                            break;
                        }
                    }
                }

                this.couponForm.controls['ProductID'].setValue(obj);

            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getCouponListing(franciseId) {
        console.log(franciseId)
        this.AdminService.getListOfCoupon(franciseId).subscribe(res => {
            //this.elements = JSON.parse(res);
            console.log(res);
            if (res.statusCode == 200) {
                this.couponRecord = new MatTableDataSource(res.result);
                this.couponRecord.sort = this.sort;
                this.couponRecord.paginator = this.paginator;
            } else {
                console.log(res.messsage);
            }
            // debugger;
        }, err => {
            console.log(err)
        });
    }

    onCancel() {
        this.couponForm.reset();
        if (this.loginData.userRole != 1) {
            this._getFranchise();
        }
    }


}
