import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../../shared/admin/admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl,FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js';  
import { debounce } from 'rxjs-compat/operator/debounce';
import * as moment from 'moment';
declare var $;
declare var AOS;

export interface PeriodicElement {
    itemName: string;
    sku: string;
    itemSalePrice: number;
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
    selector: 'app-group-product',
    templateUrl: './group-product.component.html',
    styleUrls: ['./group-product.component.scss']
})
export class GroupProductComponent implements OnInit {

    currencydata: any;
    currency: any;
    frenchiseid: any;
    elements = [];
    selectedItems = [];
    dropdownSettings = {};
    displayedColumns = [
        'itemName',
        'sku',
        'itemSalePrice',
    ];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    textField: string;
    itemForm: FormGroup;
    formServiceData
    tableData: any;
    groupproductlist = [];
    loginData: any;
    itemImage: any = null;
    formSendData: any;
    formSendData_object: any;
    FranchiseId: any;
    selecttax: any;
    taxName: any;
    Tax: any;
    taxname: any;
    length = 100;
    pageSize = 10;
    pageSizeOptions = [5, 10, 25, 100];
    productItemsGroup_object: any;
    productItemsGroup: any
    cur: string;
    grouplistData: any;
    id: number = null;
    supliername: any;
    secondobj: any;
    dateSelect:any;
    constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
        private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {
        this.dateSelect = {}
        this.formSendData = {}
        this.formServiceData = {}
        this.formSendData_object = {}
        this.productItemsGroup = {}
        this.productItemsGroup.totalPrice = 0
        this.productItemsGroup.itemArr = []
        this.productItemsGroup_object = []
        this.itemForm = this.formbulider.group({
            ItemId: [0],
            CategoryId: [null, [Validators.required]],
            FranchiseId: [null, [Validators.required]],
            UnitCategoryId: [null, [Validators.required]],
            SubCategoryId: [null, [Validators.required]],
            SupplierId: [null, [Validators.required]],
            UnitMeasurementId: [null, [Validators.required]],
            ItemName: [null, [Validators.required]],
            ItemsalePrice: [null, [Validators.required]],
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
            ItemtotalPrice: [null],
        });

        this.itemForm.controls['ItemtotalPrice'].disable();

        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            // console.log(this.loginData);
            this.FranchiseId = this.loginData.franchiseId;
            if (this.loginData.userRole == 1) {
                this.frenchiseid = 0;
            } else {
                this.frenchiseid = this.loginData.franchiseId;
            }
        }

        this.route.paramMap.subscribe(params => {
            if (params.keys.length > 0) {
                this.id = parseInt(params.get("groupId"));
                this.openEdititems();
            }
        })

    }

    ngOnInit() {
        if (this.itemForm.value.itemId == '') {
            this.itemForm.value.itemId = 0;
        } else {
            this.itemForm.value.itemId = this.id;
        }
         this._getCategory(this.frenchiseid);
        this.cur = this.AdminService.getCurrencyNew();
        // this.gettaxdata();
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
        this._getItemsListing(this.loginData.franchiseId);
        this._getFranchise();
        this._getUnitCategory();
        // this._getSuppliers();
        this.getSeletedDates();

    }

    async getSeletedDates(){
        let today = new Date();
        let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() );
        // console.log(today,tomorrow)
        this.dateSelect.doiMin = await moment(today).format("YYYY-MM-DD");
        this.dateSelect.dorMin = await moment(tomorrow).format("YYYY-MM-DD");
        // console.log(this.dateSelect.doiMin, this.dateSelect.dorMin)
    }


    onItemSelect(item: any) {
        this.selectedItems = this.itemForm.value.Tax
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.taxname = this.selectedItems[i].taxName;
            this.taxname = this.selectedItems[i].taxName + ","
            // console.log(this.taxname)
        }
    }


    onSelectAll(items: any) {
        this.selectedItems = this.itemForm.value.Tax
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.taxname = this.selectedItems[i].taxName;
            this.taxname = this.selectedItems[i].taxName + ","

            // console.log(this.taxname)
        }
    }



    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    gettaxdata(franchiseId) {
        // this.FranchiseId
        this.AdminService.gettaxdata(franchiseId).subscribe(data => {
            this.selecttax = data.result
            this.elements = data.result;
            // console.log(this.selecttax);
        }, err => {
            console.log(err)
            //this.toastr.error('Something went wrong, please try after some time', 'Error');
        })
    }

    getTaxDataForEdit(franchiseId, stringTax){
        this.AdminService.gettaxdata(franchiseId).subscribe(res => {
            // console.log(res)
            if(res.statusCode == 200){  
                if(stringTax != null && stringTax != ''){                
                    let tax = stringTax.split(',')
                    this.elements = res.result;
                    let tempArr = []
                    for(var i = 0; i < this.elements.length; i++){
                        if(tax.indexOf(this.elements[i].taxId.toString()) != -1){
                            let tempObj = {
                                    taxId: this.elements[i].taxId, 
                                    taxName: this.elements[i].taxName
                            }
                            tempArr.push(tempObj)
                        }
                        if(i == this.elements.length -1){
                            this.itemForm.controls['Tax'].setValue(tempArr);
                            this.selectedItems = tempArr
                        }
                    }
                }          
            }else{
                console.log("..... tax for franchiseId : '"+ franchiseId + "' not found!")
            }
        }, err => {
            console.log(err)
            //this.toastr.error('Something went wrong, please try after some time', 'Error');
        })
    }

    _getCategory(FranchiseId) {
        this.itemForm.controls['CategoryId'].setValue(null)
        this.itemForm.controls['SubCategoryId'].setValue(null)
        this.itemForm.controls['SupplierId'].setValue(null)
        this.itemForm.controls['Tax'].setValue([])
        this.formServiceData.category = []
        this.formServiceData.subCategory = []
        this.AdminService.getCategoryAndSubCategory(0, FranchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.category = data.result
                // console.log(this.formServiceData.category)
                if (this.itemForm.value.ItemId != 0) {
                    this.itemForm.controls['CategoryId'].setValue(null)
                }
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
        this._getItemsListing(FranchiseId);
        this.gettaxdata(FranchiseId);
        this._getSuppliers(FranchiseId)
    }

    _getCategory2(FranchiseId, categoryId) {
        // console.log(FranchiseId, categoryId)
        this.AdminService.getCategoryAndSubCategory(0, FranchiseId).subscribe(data => {
            // debugger;
            // console.log(data)
            if (data.statusCode == 200) {
                this.formServiceData.category = data.result
                // console.log(FranchiseId, categoryId)
                // console.log(this.formServiceData.category)
                this.itemForm.controls['CategoryId'].setValue(categoryId)
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
        this._getItemsListing(FranchiseId);
    }

    _getSubCategory(id) {
        // console.log(id)
        this.itemForm.controls['SubCategoryId'].setValue(null)
        this.AdminService.getCategoryAndSubCategory(id, this.loginData.franchiseId).subscribe(data => {
            // console.log(data)
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
        // console.log(categoryId, franchiseId, subcategoryId)
        var tempId = categoryId
        this.AdminService.getCategoryAndSubCategory(categoryId, franchiseId).subscribe(data => {
            // debugger;
            // console.log(data)
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
                    if(this._getFranchise == null){
                        this._getCategory(this.loginData.franchiseId);
                    }
                    this.itemForm.value.FranchiseId = this.loginData.franchiseId
                }
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getSuppliers(franchiseId) {
        this.formServiceData.supplier = []
        this.AdminService.GetSupplier(franchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.supplier = data.result
                // this.supliername = data.result
                // for (let i = 0; i < this.supliername.length; i++) {
                //     this.itemForm.controls['SupplierId'].setValue(this.supliername[i].supplierId)
                // }
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    _getSuppliers2(franchiseId, supplierId) {
        this.AdminService.GetSupplier(franchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.supplier = data.result
                // console.log(supplierId, this.formServiceData.supplier)
                this.itemForm.controls['SupplierId'].setValue(supplierId)
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
        this.itemForm.controls['UnitMeasurementId'].setValue(null)
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

    _getItemsListing(franchiseId) {
        this.AdminService.GetItemsProducts(franchiseId).subscribe(data => {
            // console.log(data)
            if (data.statusCode == 200) {
                this.tableData = data.result
                ELEMENT_DATA = this.tableData
                this.dataSource = new MatTableDataSource(ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            } else {
                console.log(data.message)
            }
        }, err => {
            console.log(err)
        })
    }

    getRentedShowFormat(isRented: boolean) {
        if (isRented == true) {
            return 'Yes'
        } else {
            return 'No'
        }
    }

    onUpload(evt: any) {
        // console.log(evt)
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
            // console.log(this.itemImage)
        };
        fr.readAsDataURL(file);
        // this.onuploadFiles(evt,type)
    }

    async onSubmit() {
       if(this.itemForm.valid){
        if (this.itemForm.value.Tax < 1) {
            this.openSnackBar('Please add TAX.', '')
        } else if (this.productItemsGroup.itemArr.length < 1) {
            this.openSnackBar('Please add item.', '')
        } else {
            var tempSend = await this.submitObject();
            var tempItemId = this.itemForm.value.ItemId
            this.AdminService.AddEditProductsGroupedItems(tempSend).subscribe(data => {
                if (data.statusCode == 200) {
                    this.onCancel();
                    this.openSnackBar(data.message, 'Success')
                } else {
                    this.openSnackBar(data.message, 'Error')
                }
            }, err => {
                this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
            })
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

    async submitObject() {
        this.formSendData = {}
        // console.log(this.formSendData)
        if(this.itemForm.value.ItemId != 0){
            this.formSendData.ItemId = this.itemForm.value.ItemId
        }
        this.formSendData.CategoryId = this.itemForm.value.CategoryId
        this.formSendData.SubCategoryId = this.itemForm.value.SubCategoryId
        this.formSendData.ItemName = this.itemForm.value.ItemName
        this.formSendData.ItemSalePrice = this.itemForm.value.ItemsalePrice
        this.formSendData.Sku = this.itemForm.value.Sku
        this.formSendData.Barcode = this.itemForm.value.Barcode
        this.formSendData.Barcode = this.itemForm.value.Barcode
        this.formSendData.Description = this.itemForm.value.Description
        this.formSendData.Discount = this.itemForm.value.Discount
        this.formSendData.ExpirationDate = this.itemForm.value.ExpirationDate
        this.formSendData.IsRented = this.itemForm.value.IsRented
        this.formSendData.ItemRentPrice = this.itemForm.value.ItemRentPrice
        this.formSendData.ManufacturedDate = this.itemForm.value.ManufacturedDate
        this.formSendData.PackingDate = this.itemForm.value.PackingDate
        this.formSendData.ProductLogo = this.itemForm.value.ProductLogo
        this.formSendData.ItemTotalPrice = this.productItemsGroup.totalPrice
        this.formSendData.minimumStock = this.itemForm.value.MinimumStock
        this.formSendData.GroupItemViewModelList = this.productItemsGroup_object
        this.formSendData.QuantityStock = this.itemForm.value.QuantityStock
        this.formSendData.SupplierId = this.itemForm.value.SupplierId
        this.formSendData.UnitCategoryId = this.itemForm.value.UnitCategoryId
        this.formSendData.UnitMeasurementId = this.itemForm.value.UnitMeasurementId
        if (this.itemForm.value.FranchiseId) {
            this.formSendData.FranchiseId = this.itemForm.value.FranchiseId
        } else {
            this.formSendData.FranchiseId = this.loginData.franchiseId
        }

        if (this.itemImage != null && this.itemImage != '') {
            this.formSendData.ProductLogo = this.itemImage
        }

        if (this.itemForm.value.IsRented == "true" ||  this.itemForm.value.IsRented == true) {
            this.formSendData.security = this.itemForm.value.security
        } else {
            this.formSendData.security = 0
        }
        var p = "";
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.taxname = this.selectedItems[i].taxName;
            if (this.formSendData.Tax == undefined)
                this.formSendData.Tax = this.selectedItems[i].taxId + ","
            else {
                this.formSendData.Tax = this.formSendData.Tax + this.selectedItems[i].taxId + ","
            }
        }

        return this.formSendData
    }

    getCartItemIds() {
        let tempArr = []
        for (var i = 0; i < this.productItemsGroup.itemArr.length; i++) {
            for (var j = 0; j < this.productItemsGroup.itemArr[i].qty; j++) {
                tempArr.push(this.productItemsGroup.itemArr[i].id)
            }
            if (i == this.productItemsGroup.itemArr.length - 1) {
                let sendStr = tempArr.toString();
                return sendStr;
            }
        }
    }

    onCancel() {
        if(this.id == null){
            this.itemForm.reset();
            this.itemImage = null
            this.formServiceData.category = []
            this.formServiceData.subCategory = []
            if (this.loginData.userRole != 1) {
                this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
                this.itemForm.controls['FranchiseId'].disable();
                this._getCategory(this.loginData.franchiseId);
                this.itemForm.value.FranchiseId = this.loginData.franchiseId
            }
            this.productItemsGroup = {}
            this.productItemsGroup.totalPrice = 0
            this.productItemsGroup.itemArr = []
        }else{
            this.router.navigate(['/admin/group-item-list']);
        }
    }

    openDelete(id): void {
        let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            width: '470px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.AdminService.DeleteItem(id).subscribe(res => {
                    if (res.statusCode == 200) {
                        this.tableData = this.tableData.filter(data => data.itemId != id)
                        ELEMENT_DATA = this.tableData
                        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.openSnackBar(res.message, 'Success')
                    } else {
                        this.openSnackBar(res.message, 'Error')
                    }
                }, err => {
                    this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
                });

            }
        });
    }

    openEdit(data) {
        this.itemImage = data.productLogo
        this.itemForm.controls['ItemId'].setValue(data.itemId)
        this.itemForm.controls['FranchiseId'].setValue(data.franchiseId)
        this._getCategory2(data.franchiseId, data.categoryId)
        this._getSubCategory2(data.categoryId, data.franchiseId, data.subCategoryId)
        this.itemForm.controls['UnitCategoryId'].setValue(data.unitCategoryId)
        this._getUnitMeasurment2(parseInt(data.unitCategoryId), data.unitMeasurementId)
        this.itemForm.controls['SupplierId'].setValue(data.supplierId)
        this.itemForm.controls['ItemName'].setValue(data.itemName)
        this.itemForm.controls['ItemRentPrice'].setValue(data.itemRentPrice)
        this.itemForm.controls['MinimumStock'].setValue(data.minimumStock)
        this.itemForm.controls['Discount'].setValue(data.discount)
        this.itemForm.controls['QuantityStock'].setValue(data.quantityStock)
        this.itemForm.controls['Sku'].setValue(data.sku)
        this.itemForm.controls['Barcode'].setValue(data.barcode)
        if (data.expirationDate != null) {
            this.itemForm.controls['ExpirationDate'].setValue((data.expirationDate).split('T')[0])
        }
        if (data.manufacturedDate != null) {
            this.itemForm.controls['ManufacturedDate'].setValue((data.manufacturedDate).split('T')[0])
        }
        if (data.packingDate != null) {
            this.itemForm.controls['PackingDate'].setValue((data.packingDate).split('T')[0])
        }
        if (data.isRented != null) {
            this.itemForm.controls['IsRented'].setValue(data.isRented)
            if (data.isRented == true) {
                $('#Security').show();
                this.itemForm.controls['security'].setValue(data.security)
            }

        } else {
            this.itemForm.controls['IsRented'].setValue(false)
            $('#Security').hide();
        }

        this.itemForm.controls['Description'].setValue(data.description)
        this.setRent(data.isRented)
        window.scroll(0, 0);
    }

    setRent(val) {
        let security = this.itemForm.get('security');
        if (val == "true" || val == true) {
            $('#Security').show();
            security.setValidators([Validators.required]);
            security.updateValueAndValidity();
        }
        else {
            $('#Security').hide();
            security.clearValidators();
            security.updateValueAndValidity();
        }
    }

    deleteItemFromBasket(item, index) {
        this.productItemsGroup.totalPrice = this.productItemsGroup.totalPrice - (item.price * item.qty)
        this.productItemsGroup.itemArr = this.productItemsGroup.itemArr.filter(it => it.id != item.id)
        this.productItemsGroup_object = this.productItemsGroup_object.filter(it => it.ItemId != item.id)
    }

    addItem(item) {
        var index = this.productItemsGroup.itemArr.findIndex(it => it.id == item.itemId)
        if (index == -1) {
            let tempObj = {
                id: item.itemId,
                name: item.itemName,
                price: item.itemSalePrice,
                quantityStock : item.quantityStock,
                qty: 1
            }
            this.secondobj = {
                ItemId: item.itemId,
                itemGrpId : item.itemId,
                CategoryId: item.categoryId,
                SubCategoryId: item.subCategoryId,
                itemGroupName: item.itemName,
                FranchiseId: item.franchiseId,
                ItemSalePrice: item.itemSalePrice,
                ManufacturedDate: item.manufacturedDate,
                PackingDate: item.packingDate,
                Discount: item.discount,
                QuantityStock: 1,
                Sku: item.sku,
                Barcode: item.barcode,
                Tax: item.tax,
                ExpirationDate: item.expirationDate,
                UnitMeasurementId: item.unitMeasurementId,
                UnitCategoryId: item.unitMeasurementId,
                IsRented: item.isRented,
                ItemRentPrice: item.itemRentPrice,
                Description: item.description,
                SupplierId: item.supplierName,
                ProductLogo: item.productLogo,
                minimumStock: item.minimumStock,
                security: item.security,
                returnDate: item.returnDate,
            }
            this.productItemsGroup.totalPrice = this.productItemsGroup.totalPrice + item.itemSalePrice;
            this.productItemsGroup.itemArr.push(tempObj)
            this.productItemsGroup_object.push(this.secondobj)
        } else {
            if(item.quantityStock > this.productItemsGroup.itemArr[index].qty){
                this.productItemsGroup.totalPrice = this.productItemsGroup.totalPrice + item.itemSalePrice;
               this.productItemsGroup.itemArr[index].qty = this.productItemsGroup.itemArr[index].qty + 1
               this.productItemsGroup_object[index].QuantityStock = this.productItemsGroup_object[index].QuantityStock + 1
            }
        }
    }

    addEditItemInCart(type, index, item) {
        if (type == 'plus') {
            if(item.quantityStock > item.qty){            
                this.productItemsGroup.totalPrice = this.productItemsGroup.totalPrice + item.price
                this.productItemsGroup.itemArr[index].qty = this.productItemsGroup.itemArr[index].qty + 1

                this.productItemsGroup_object[index].QuantityStock = this.productItemsGroup_object[index].QuantityStock + 1
            }
        } else {
            this.productItemsGroup.totalPrice = this.productItemsGroup.totalPrice - item.price
            if (this.productItemsGroup.itemArr[index].qty == 1) {
                this.productItemsGroup.itemArr = this.productItemsGroup.itemArr.filter(it => it.id != item.id)

                this.productItemsGroup_object = this.productItemsGroup_object.filter(it => it.ItemId != item.id)
            } else {
                this.productItemsGroup.itemArr[index].qty = this.productItemsGroup.itemArr[index].qty - 1

                this.productItemsGroup_object[index].QuantityStock = this.productItemsGroup_object[index].QuantityStock - 1
            }
        }
    }


    openEdititems() {
        this.AdminService.onopeneditGroupItems(this.id).subscribe(res => {
            if (res.statusCode == 200) {
                let groupitemData = res.result[0];
                    this.itemForm.controls['ItemId'].setValue(this.id)
                    this.itemForm.controls['FranchiseId'].setValue(groupitemData.franchiseId)
                    this._getCategory2(groupitemData.franchiseId, groupitemData.categoryId)
                    this._getSubCategory2(groupitemData.categoryId, groupitemData.franchiseId, groupitemData.subCategoryId)
                    this.itemForm.controls['UnitCategoryId'].setValue(groupitemData.unitCategoryId)
                    this._getUnitMeasurment2(parseInt(groupitemData.unitCategoryId), groupitemData.unitMeasurementId)
                    this._getSuppliers2(groupitemData.franchiseId, groupitemData.supplierId)
                    this.itemForm.controls['SupplierId'].setValue(groupitemData.supplierId)
                    this.itemForm.controls['ItemtotalPrice'].setValue(groupitemData.itemTotalPrice)
                    this.itemForm.controls['ItemName'].setValue(groupitemData.itemName)
                    this.itemForm.controls['ItemRentPrice'].setValue(groupitemData.itemRentPrice)
                    this.itemForm.controls['UnitMeasurementId'].setValue(groupitemData.unitMeasurementId)
                    this.itemForm.controls['MinimumStock'].setValue(groupitemData.minimumStock)
                    if (groupitemData.manufacturedDate != null) {
                        this.itemForm.controls['ManufacturedDate'].setValue((groupitemData.manufacturedDate).split('T')[0])
                    }
                    if (groupitemData.packingDate != null) {
                        this.itemForm.controls['PackingDate'].setValue((groupitemData.packingDate).split('T')[0])
                    }
                    this.itemForm.controls['Discount'].setValue(groupitemData.discount)
                    this.itemForm.controls['QuantityStock'].setValue(groupitemData.quantityStock)
                    this.itemForm.controls['Sku'].setValue(groupitemData.sku)
                    this.itemForm.controls['Barcode'].setValue(groupitemData.barcode)
                    this.itemForm.controls['ItemsalePrice'].setValue(groupitemData.itemSalePrice)
                    this.itemForm.controls['Description'].setValue(groupitemData.description)
                    this.getTaxDataForEdit(groupitemData.franchiseId,groupitemData.tax);
                    if (groupitemData.expirationDate != null) {
                        this.itemForm.controls['ExpirationDate'].setValue((groupitemData.expirationDate).split('T')[0])
                    }
                    if (groupitemData.isRented != null) {
                        this.itemForm.controls['IsRented'].setValue(groupitemData.isRented)
                        if (groupitemData.isRented == true) {
                            $('#Security').show();
                            this.itemForm.controls['security'].setValue(groupitemData.security)
                        }

                    } else {
                        this.itemForm.controls['IsRented'].setValue(false)
                        $('#Security').hide();
                    }

                    if (groupitemData.productLogo != null && groupitemData.productLogo != '') {
                        this.itemImage = groupitemData.productLogo
                    }

                    this.setRent(groupitemData.isRented)
                    if (groupitemData.groupItemViewModelList.length > 0) {
                        let groupItems = groupitemData.groupItemViewModelList;
                        groupItems.forEach(data=>{
                            for(var i = 0; i < data.quantityStock; i++){
                                this.addItemInEditCase(data)
                            }
                        })
                    }
                    window.scroll(0, 0);
            } else {
                this.openSnackBar(res.message, 'Error')
            }
        })
    }


    addItemInEditCase(item) {
        this.productItemsGroup.totalPrice = this.productItemsGroup.totalPrice + item.itemSalePrice;
        var index = this.productItemsGroup.itemArr.findIndex(it => it.id == item.itemGrpId)
        if (index == -1) {
            let tempObj = {
                id: item.itemGrpId,
                name: item.itemGroupName,
                price: item.itemSalePrice,
                quantityStock : item.quantityStockValue ,
                qty: 1
            }
            this.secondobj = {
                ItemId: item.itemGrpId,
                itemGrpId : item.itemGrpId,
                ItemGroupId : item.itemGroupId,
                CategoryId: item.categoryId,
                SubCategoryId: item.subCategoryId,
                itemGroupName: item.itemGroupName,
                FranchiseId: item.franchiseId,
                ItemSalePrice: item.itemSalePrice,
                ManufacturedDate: item.manufacturedDate,
                PackingDate: item.packingDate,
                Discount: item.discount,
                QuantityStock: 1,
                Sku: item.sku,
                Barcode: item.barcode,
                Tax: item.tax,
                ExpirationDate: item.expirationDate,
                UnitMeasurementId: item.unitMeasurementId,
                UnitCategoryId: item.unitMeasurementId,
                IsRented: item.isRented,
                ItemRentPrice: item.itemRentPrice,
                Description: item.description,
                SupplierId: item.supplierName,
                ProductLogo: item.productLogo,
                minimumStock: item.minimumStock,
                security: item.security,
                returnDate: item.returnDate,
                ItemTotalPrice: 500
            }
            this.productItemsGroup.itemArr.push(tempObj)
            this.productItemsGroup_object.push(this.secondobj)
        } else {
            this.productItemsGroup.itemArr[index].qty = this.productItemsGroup.itemArr[index].qty + 1
            this.productItemsGroup_object[index].QuantityStock = this.productItemsGroup_object[index].QuantityStock + 1
        }
    }

}


