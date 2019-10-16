import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from '../../shared/admin/admin.service';
import { FormGroup, FormArray,FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';
declare var $;
declare var AOS;
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material'  
import * as moment from 'moment';

@Component({
    selector: 'app-cashier-add-item',
    templateUrl: './cashier-add-item.component.html',
    styleUrls: ['./cashier-add-item.component.scss']
})
export class CashierAddItemComponent implements OnInit {
    elements = [];
    selectedItems = [];

    public localFields: Object = { text: 'taxName', value: 'taxId' };
    dropdownSettings = {};
    itemForm: FormGroup;
    formServiceData
    loginData: any;
    taxName: any;
    taxname: any;
    itemImage: any = null;
    tableData: any;
    formSendData: any;
    selecttax: any;
    FranchiseId: any;
    rentVal: any = false;
    dateSelect :any;
    constructor(private AdminService: AdminService, private _snackBar: MatSnackBar,
        public dialog: MatDialog, private formbulider: FormBuilder,
        private route: ActivatedRoute, public router: Router,
        public dialogRef: MatDialogRef<CashierAddItemComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) {
        this.formSendData = {}
        this.formServiceData = {}
        this.dateSelect = {}
        this.itemForm = this.formbulider.group({
            ItemId: [0],
            CategoryId: [null, [Validators.required]],
            FranchiseId: [null],
            UnitCategoryId: [null, [Validators.required]],
            SubCategoryId: [null, [Validators.required]],
            SupplierId: [null, [Validators.required]],
            UnitMeasurementId: [null, [Validators.required]],
            ItemName: [null, [Validators.required]],
            ItemSalePrice: [null, [Validators.required]],
            ItemRentPrice: [null, [Validators.required]],
            ManufacturedDate: [null, [Validators.required]],
            PackingDate: [null, [Validators.required]],
            Discount: [null, [Validators.required]],
            QuantityStock: [null, [Validators.required]],
            Sku: [null, [Validators.required]],
            Barcode: [null, [Validators.required]],
            Tax: [null, [Validators.required]],
            ExpirationDate: [null, [Validators.required]],
            IsRented: [null, [Validators.required]],
            Description: [null, [Validators.required]],
            ProductLogo: [null],
            MinimumStock: [null, [Validators.required]],
            security: [null],
        });

        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            console.log(this.loginData);
            this.FranchiseId = this.loginData.franchiseId;

        }
    }

    ngOnInit() {
        this.getSeletedDates();
        this.gettaxdata();
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'taxId',
            textField: 'taxName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
    
        AOS.init();
        this._getFranchise();
        this._getUnitCategory();
        this._getSuppliers();
        console.log(this.loginData.franchiseId);

    }

    async getSeletedDates(){
        let today = new Date();
        let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() );
        this.dateSelect.doiMin = await moment(today).format("YYYY-MM-DD");
        this.dateSelect.dorMin = await moment(tomorrow).format("YYYY-MM-DD");
    }

    _getItemsListing() {
        this.AdminService.GetItemsProducts(this.loginData.franchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.tableData = data.result
            } else {
            }
        }, err => {
        })
    }

    getRentedShowFormat(isRented: boolean) {
        if (isRented == true) {
            return 'Yes'
        } else {
            return 'No'
        }
    }

    gettaxdata() {
        this.AdminService.gettaxdata(this.FranchiseId).subscribe(data => {
            debugger
            this.selecttax = data.result
            this.elements = data.result;
        }, err => {
        })
    }
  


    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }


    _getCategory(FranchiseId) {
        this.itemForm.controls['CategoryId'].setValue(null)
        this.itemForm.controls['SubCategoryId'].setValue(null)
        this.formServiceData.category = []
        this.formServiceData.subCategory = []
        this.AdminService.getCategoryAndSubCategory(0, FranchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.category = data.result
                console.log(this.formServiceData.category)
                if (this.itemForm.value.ItemId != 0) {
                    this.itemForm.controls['CategoryId'].setValue(null)
                }
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getCategory2(FranchiseId, categoryId) {
        console.log(FranchiseId, categoryId)
        this.AdminService.getCategoryAndSubCategory(0, FranchiseId).subscribe(data => {
            // debugger;
            console.log(data)
            if (data.statusCode == 200) {
                this.formServiceData.category = data.result
                console.log(FranchiseId, categoryId)
                console.log(this.formServiceData.category)
                this.itemForm.controls['CategoryId'].setValue(categoryId)
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getSubCategory(id) {
        console.log(id)
        this.AdminService.getCategoryAndSubCategory(id, this.loginData.franchiseId).subscribe(data => {
            console.log(data)
            if (data.statusCode == 200) {
                this.formServiceData.subCategory = data.result
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getSubCategory2(categoryId, franchiseId, subcategoryId) {
        // debugger;
        console.log(categoryId, franchiseId)
        var tempId = categoryId
        this.AdminService.getCategoryAndSubCategory(categoryId, franchiseId).subscribe(data => {
            // debugger;
            console.log(data)
            if (data.statusCode == 200) {
                this.formServiceData.subCategory = data.result
                this.itemForm.controls['SubCategoryId'].setValue(subcategoryId)
                // setTimeout(function(){
                //   console.log(this.formServiceData.subCategory)
                //   this.itemForm.controls['SubCategoryId'].setValue(tempId)
                // }, 1000);
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getFranchise() {
        this.AdminService.getFranchiseDetails().subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.franchiseList = data.result
                if (this.loginData.userRole != 1) {
                    this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
                    this.itemForm.controls['FranchiseId'].disable();
                    this._getCategory(this.loginData.franchiseId);
                }
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })

    }

    _getSuppliers() {
        this.AdminService.GetSupplier(this.loginData.franchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.supplier = data.result
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getUnitCategory() {
        this.AdminService.GetUnitCategory().subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.unitCategory = data.result
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getUnitMeasurment(id) {
        this.AdminService.GetUnitCategoryMeasurement(id).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.unitcategoryMeasurement = data.result
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getUnitMeasurment2(id, UnitMeasurementId) {
        this.AdminService.GetUnitCategoryMeasurement(id).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.unitcategoryMeasurement = data.result
                this.itemForm.controls['UnitMeasurementId'].setValue(UnitMeasurementId)
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    onSubmit(formValue) {
        if(this.itemForm.valid){
            if(formValue.Tax != null && formValue.Tax.length > 0){
                var tempSend = this.submitObject();
                console.log(tempSend)
                this.AdminService.AddEditItemProduct(tempSend).subscribe(data => {
                    console.log(data)
                    if (data.statusCode == 200) {
                        console.log(data)
    
                        // this.onCancel();
                        // this.openSnackBar(data.message, 'Success')
                        this.dialogRef.close(data.result);
                    } else {
                        console.log(data.message)
                        this.openSnackBar(data.message, 'Error')
                    }
                }, err => {
                    console.log(err)
                    this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
                })
           }else{
               this.openSnackBar('Please add TAX.', '')
           }
        }else{
            this.validateAllFormFields(this.itemForm);
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

    onItemSelect(item: any) {
        console.log(this.selectedItems)
        // debugger
        //console.log(this.selectedItems)
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.taxname = this.selectedItems[i].taxName;
            this.taxname = this.selectedItems[i].taxName + ","
            console.log(this.taxname)


        }


    }
    onSelectAll(items: any) {
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.taxname = this.selectedItems[i].taxName;
            this.taxname = this.selectedItems[i].taxName + ","

            console.log(this.taxname)
        }
    }


    submitObject() {
        this.formSendData = {}
        this.formSendData.Barcode = this.itemForm.value.Barcode
        this.formSendData.CategoryId = this.itemForm.value.CategoryId
        this.formSendData.Description = this.itemForm.value.Description
        this.formSendData.Discount = this.itemForm.value.Discount
        this.formSendData.ExpirationDate = this.itemForm.value.ExpirationDate
        this.formSendData.IsRented = this.itemForm.value.IsRented
        if (this.itemForm.value.IsRented == "true") {
            this.formSendData.security = this.itemForm.value.security
        }
        else {
            this.formSendData.security = 0
        }
        this.formSendData.MinimumStock = this.itemForm.value.MinimumStock
        this.formSendData.ItemName = this.itemForm.value.ItemName
        this.formSendData.ItemRentPrice = this.itemForm.value.ItemRentPrice
        this.formSendData.ItemSalePrice = this.itemForm.value.ItemSalePrice
        this.formSendData.ManufacturedDate = this.itemForm.value.ManufacturedDate
        this.formSendData.PackingDate = this.itemForm.value.PackingDate
        this.formSendData.ProductLogo = this.itemForm.value.ProductLogo
        this.formSendData.QuantityStock = this.itemForm.value.QuantityStock
        this.formSendData.Sku = this.itemForm.value.Sku
        this.formSendData.SubCategoryId = this.itemForm.value.SubCategoryId
        this.formSendData.SupplierId = this.itemForm.value.SupplierId
        this.formSendData.Tax = this.itemForm.value.Tax.toString()
        this.formSendData.UnitCategoryId = this.itemForm.value.UnitCategoryId
        this.formSendData.UnitMeasurementId = this.itemForm.value.UnitMeasurementId
        if (this.itemImage != null && this.itemImage != '') {
            this.formSendData.ProductLogo = this.itemImage
        }
        if (this.itemForm.value.ItemId != 0) {
            this.formSendData.ItemId = this.itemForm.value.ItemId
        }
        if (this.itemForm.value.FranchiseId) {
            this.formSendData.FranchiseId = this.itemForm.value.FranchiseId
        } else {
            this.formSendData.FranchiseId = this.loginData.franchiseId
        }

        return this.formSendData
    }

    onCancel() {
        // this.itemForm.reset();
        // this.formServiceData.category = []
        // this.formServiceData.subCategory = []
        // $('#file-upload1').val(null);
        // this.itemImage = null
        this.dialogRef.close();
    }

    onUpload(evt: any) {
        console.log(evt)
        if (!evt.target) {
            return;
        }
        if (!evt.target.files) {
            return;
        }
        if (evt.target.files.length !== 1) {
            return;
        }
        const file = evt.target.files[0];
        if (file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'image/jpg') {
            alert('You can upload image only!')
            return;
        }
        const fr = new FileReader();
        fr.onloadend = (loadEvent) => {
            let mainImage = fr.result;
            this.itemImage = mainImage;
            console.log(this.itemImage)
        };
        fr.readAsDataURL(file);
        // this.onuploadFiles(evt,type)
    }

    setRent(val) {
        if (val == "true" || val == true) {
             this.rentVal = true;
            $('#Security').show();
        }
        else {
            this.rentVal = false;
            $('#Security').hide();
        }
    }






}
