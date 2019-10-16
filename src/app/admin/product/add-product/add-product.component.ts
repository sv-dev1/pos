import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../../shared/admin/admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup,FormControl, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js';
import { debounce } from 'rxjs-compat/operator/debounce';
import * as moment from 'moment';

declare var $;
declare var AOS;
export interface PeriodicElement {
    sku: any;
    categoryName: string;
    unitMeasurementName;
    itemRentPrice: number;
    quantityStock: number;
    IsRented: string;
}

var ELEMENT_DATA: PeriodicElement[] = [];


@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
    currencydata: any;
    currency: any;
    frenchiseid: any;
    elements = [];
    selectedItems = [];
    dropdownSettings = {};
    displayedColumns = [
        'sku',
        'categoryName',
        'unitMeasurementName',
        'itemRentPrice',
        'QuantityStock',
        'IsRented',
        "productImage",
        'action'
    ];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    textField: string;
    itemForm: FormGroup;
    formServiceData
    tableData: any;
    loginData: any;
    itemImage: any = null;
    formSendData: any
    FranchiseId: any;
    selecttax: any;
    taxName: any;
    Tax: any;
    taxname: any;
    length = 100;
    pageSize = 10;
    pageSizeOptions = [5, 10, 25, 100];
    dateSelect: any;fd
    color = 'primary';
    disabled = false;
    changefrenchise_id: any;
    id: any;
    frec_id: any;
    categorydata: any[];
    constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
        private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {
        this.dateSelect = {}
        this.formSendData = {}
        this.formServiceData = {}
        this.itemForm = this.formbulider.group({
            ItemId: [0],
            CategoryId: [null, [Validators.required]],
            FranchiseId: [null, [Validators.required]],
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
            uploadFile: [null]
        });

        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            console.log(this.loginData);
            this.FranchiseId = this.loginData.franchiseId;
            if (this.loginData.userRole == 1) {
                this.frenchiseid = 0;
            } else {
                this.frenchiseid = this.loginData.franchiseId;
            }
        }

        this.route.queryParams.subscribe(params => {
            if (params.itemId) {
                console.log(params)
                this.openEdit(params)
            }
        });

    }

    ngOnInit() {

        this.currency = this.AdminService.getCurrencyNew();
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
        this._getItemsListing();
        this._getFranchise();
        this._getUnitCategory();
    }


    async getSeletedDates() {
        let today = new Date();
        let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.dateSelect.doiMin = await moment(today).format("YYYY-MM-DD");
        this.dateSelect.dorMin = await moment(tomorrow).format("YYYY-MM-DD");
    }


    onItemSelect(item: any) {
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.taxname = this.selectedItems[i].taxName;
            this.taxname = this.selectedItems[i].taxName + ","
        }
    }


    onSelectAll(items: any) {
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.taxname = this.selectedItems[i].taxName;
            this.taxname = this.selectedItems[i].taxName + ","
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



    _getCategory(FranchiseId) {
        this.FranchiseId = FranchiseId;
        this.itemForm.controls['Tax'].setValue(null)
        this.itemForm.controls['SupplierId'].setValue(null)
        this.itemForm.controls['CategoryId'].setValue(null)
        this.itemForm.controls['SubCategoryId'].setValue(null)
        this.formServiceData.category = []
        this.formServiceData.subCategory = []
        this.AdminService.getCategoryAndSubCategory(0, FranchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.category = data.result
                if (this.itemForm.value.ItemId != 0) {
                    this.itemForm.controls['CategoryId'].setValue(null)
                }
            } else {
            }
        }, err => {
        })
        this._getSuppliers(FranchiseId);
        this.FranchiseId = FranchiseId;
        this.gettaxdata();
    }


    gettaxdata() {
        this.AdminService.gettaxdata(this.FranchiseId).subscribe(data => {
            this.selecttax = data.result
            this.elements = data.result;
        }, err => {
        })

    }


    _getCategory2(FranchiseId, categoryId) {
        this.AdminService.getCategoryAndSubCategory(0, FranchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.category = data.result
                let index = this.formServiceData.category.indexOf(it => it.id == categoryId)
                if (index == -1) {
                    this.itemForm.controls['CategoryId'].setValue(null)
                } else {
                    this.itemForm.controls['CategoryId'].setValue(categoryId)

                }
                this.itemForm.controls['CategoryId'].setValue(categoryId)
            } else {
            }
        }, err => {
        })
        this._getSuppliers(FranchiseId);
        this.FranchiseId = FranchiseId;
        this.gettaxdata();
    }

    _getSubCategory(id) {
        this.AdminService.getCategoryAndSubCategory(id, this.loginData.franchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.subCategory = data.result
            } else {
            }
        }, err => {
        })
    }

    _getSubCategory2(categoryId, franchiseId, subcategoryId) {
        var tempId = categoryId
        this.AdminService.getCategoryAndSubCategory(categoryId, franchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.subCategory = data.result
            } else {
            }
        }, err => {
        })
    }

    _getFranchise() {
        this.AdminService.getFranchiseDetails().subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.franchiseList = data.result
                this.categorydata = data.result;
                if (this.loginData.userRole != 1) {
                    this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
                    this.itemForm.controls['FranchiseId'].disable();
                    this._getCategory(this.loginData.franchiseId);
                    this.itemForm.value.FranchiseId = this.loginData.franchiseId
                    this._getSuppliers(this.loginData.franchiseId)
                }
            } else {
            }
        }, err => {
        })
    }

    _getSuppliers(franchiseId) {
        this.AdminService.GetSupplier(franchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.supplier = data.result
            } else {
            }
        }, err => {
        })
    }

    _getUnitCategory() {
        this.AdminService.GetUnitCategory().subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.unitCategory = data.result
            } else {
            }
        }, err => {
        })
    }

    _getUnitMeasurment(id) {
        this.AdminService.GetUnitCategoryMeasurement(id).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.unitcategoryMeasurement = data.result
            } else {
            }
        }, err => {
        })
    }

    _getUnitMeasurment2(id, UnitMeasurementId) {
        this.itemForm.controls['UnitMeasurementId'].setValue(null)
        this.AdminService.GetUnitCategoryMeasurement(id).subscribe(data => {
            if (data.statusCode == 200) {
                this.formServiceData.unitcategoryMeasurement = data.result
                let index = this.formServiceData.unitcategoryMeasurement.indexOf(it => it.id == UnitMeasurementId)
                if (index == -1) {
                    this.itemForm.controls['UnitMeasurementId'].setValue(null)
                } else {
                    this.itemForm.controls['UnitMeasurementId'].setValue(UnitMeasurementId)

                }
                this.itemForm.controls['UnitMeasurementId'].setValue(UnitMeasurementId)
            } else {
            }
        }, err => {
        })
    }


    _getItemsListing() {
        this.AdminService.GetAllItemsProducts(this.loginData.franchiseId).subscribe(data => {
            if (data.statusCode == 200) {
                this.tableData = data.result
                ELEMENT_DATA = this.tableData
                this.dataSource = new MatTableDataSource(ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
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

    onUpload(evt: any) {
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
            this.itemForm.controls['uploadFile'].setValue(null)
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

    onSubmit() {
        if(this.itemForm.valid){
            if (this.selectedItems.length < 1) {
                this.openSnackBar('Please add TAX.', '')
            } else {
                var tempSend = this.submitObject();
                console.log(tempSend)
                var tempItemId = this.itemForm.value.ItemId
                this.AdminService.AddEditItemProduct(tempSend).subscribe(data => {
                    console.log(data)
                    if (data.statusCode == 200) {
                        console.log(data)
                        if (tempItemId == 0 || tempItemId == null) {
                            this.tableData.push(data.result)
                            ELEMENT_DATA = this.tableData
                            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                        } else {
                            for (var i = 0; i < this.tableData.length; i++) {
                                if (this.tableData[i].itemId == tempItemId) {
                                    this.tableData[i] = data.result;
                                    ELEMENT_DATA = this.tableData
                                    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
                                    this.dataSource.paginator = this.paginator;
                                    this.dataSource.sort = this.sort;
                                }
                            }
                        }
                        this.onCancel();
                        this.openSnackBar(data.message, 'Success')
                    } else {
                        console.log(data.message)
                        this.openSnackBar(data.message, 'Error')
                    }
                }, err => {
                    console.log(err)
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


    submitObject() {
        var q = this.formSendData.Tax;
        var p = "";

        this.formSendData = {}
        this.formSendData.Barcode = this.itemForm.value.Barcode
        this.formSendData.CategoryId = this.itemForm.value.CategoryId
        this.formSendData.Description = this.itemForm.value.Description
        this.formSendData.Discount = this.itemForm.value.Discount
        this.formSendData.ExpirationDate = this.itemForm.value.ExpirationDate
        this.formSendData.IsRented = this.itemForm.value.IsRented
        if (this.itemForm.value.IsRented == true  || this.itemForm.value.IsRented == "true") {
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
        this.formSendData.Tax = this.formSendData.Tax
        this.formSendData.UnitCategoryId = this.itemForm.value.UnitCategoryId
        this.formSendData.UnitMeasurementId = this.itemForm.value.UnitMeasurementId
        if (this.itemImage != null && this.itemImage != '') {
            this.formSendData.ProductLogo = this.itemImage
        }
        if (this.itemForm.value.ItemId != 0 && this.itemForm.value.ItemId != null) {
            this.formSendData.ItemId = this.itemForm.value.ItemId
        }
        if (this.itemForm.value.FranchiseId) {
            this.formSendData.FranchiseId = this.itemForm.value.FranchiseId
        } else {
            this.formSendData.FranchiseId = this.loginData.franchiseId
        }

        var p = "";
        for (let i = 0; i < this.selectedItems.length; i++) {
            // debugger
            this.taxname = this.selectedItems[i].taxName;
            if (this.formSendData.Tax == undefined)
                this.formSendData.Tax = this.selectedItems[i].taxId + ","
            else {
                this.formSendData.Tax = this.formSendData.Tax + this.selectedItems[i].taxId + ","
            }
        }


        return this.formSendData
    }

    onCancel() {
        this.itemForm.reset();
        this.formServiceData.category = []
        this.formServiceData.subCategory = []
        // $('#file-upload1').val(null);
        this.itemForm.controls['uploadFile'].setValue(null)
        this.itemImage = null
        if (this.loginData.userRole != 1) {
            this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
            this.itemForm.controls['FranchiseId'].disable();
            this._getCategory(this.loginData.franchiseId);
            this.itemForm.value.FranchiseId = this.loginData.franchiseId
        }
    }

    openDelete(id): void {
        console.log("................")
        let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            width: '470px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // this.onDelete(id)
                console.log(id, result)

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
        // debugger;
        console.log(data)
        this.itemImage = data.productLogo
        this.itemForm.controls['ItemId'].setValue(data.itemId)
        this.itemForm.controls['FranchiseId'].setValue(data.franchiseId)
        // this.itemForm.controls['CategoryId'].setValue(data.categoryId)
        this._getCategory2(data.franchiseId, data.categoryId)
        this._getSubCategory2(data.categoryId, data.franchiseId, data.subCategoryId)
        this.itemForm.controls['UnitCategoryId'].setValue(data.unitCategoryId)
        this._getUnitMeasurment2(parseInt(data.unitCategoryId), data.unitMeasurementId)
        this.itemForm.controls['SubCategoryId'].setValue(data.subCategoryId)
        this.itemForm.controls['SupplierId'].setValue(data.supplierId)
        // this.itemForm.controls['UnitMeasurementId'].setValue(data.unitMeasurementId)
        this.itemForm.controls['ItemName'].setValue(data.itemName)
        this.itemForm.controls['ItemSalePrice'].setValue(data.itemSalePrice)
        this.itemForm.controls['ItemRentPrice'].setValue(data.itemRentPrice)
        this.itemForm.controls['MinimumStock'].setValue(data.minimumStock)
        if (data.manufacturedDate != null) {
            this.itemForm.controls['ManufacturedDate'].setValue((data.manufacturedDate).split('T')[0])
        }
        if (data.packingDate != null) {
            this.itemForm.controls['PackingDate'].setValue((data.packingDate).split('T')[0])
        }
        this.itemForm.controls['Discount'].setValue(data.discount)
        this.itemForm.controls['QuantityStock'].setValue(data.quantityStock)
        this.itemForm.controls['Sku'].setValue(data.sku)
        this.itemForm.controls['Barcode'].setValue(data.barcode)


        let x = data.tax.split(",");
        var obj: any = []
        var k = 0;

        var k = 0;
        for (let i = 0; i < x.length; i++) {
            for (let j = 0; j < this.elements.length; j++) {
                if (x[i] == this.elements[j].taxId) {
                    obj[k] = this.elements[j];
                    k++;
                    break;
                }
            }
        }


        this.itemForm.controls['Tax'].setValue(obj);
        // this.itemForm.controls['Tax'].setValue(data.tax)
        if (data.expirationDate != null) {
            this.itemForm.controls['ExpirationDate'].setValue((data.expirationDate).split('T')[0])
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
        console.log(val)
        if (val == "true" || val == true) {
            $('#Security').show();
            // this.itemForm.controls['security'].setValidators([Validators.required]);
            security.setValidators([Validators.required]);
            security.updateValueAndValidity();
        }
        else {
            $('#Security').hide();
            // this.itemForm.controls['security'].setValidators(null);
            security.clearValidators();
            security.updateValueAndValidity();
        }
    }



    ActivateItem(itemId) {
        debugger;
        this.AdminService.activateItem(itemId).subscribe(res => {
            if (res.statusCode == 200) {

                this.openSnackBar(res.message, 'Success')
                // this.ngOnInit();
            } else {
                this.openSnackBar(res.message, 'Error')
            }
        }, err => {
            this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
        });

    }

}
