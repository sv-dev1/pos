import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../../shared/admin/admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js
import { debounce } from 'rxjs-compat/operator/debounce';
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
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
    
    elements = [];
    selectedItems;
    dropdownSettings = {};
    displayedColumns = [
        'sku',
        // 'Sku',
        'categoryName',
        // 'SubCategoryId',
        'unitMeasurementName',
        // 'UnitMeasurementId',
        'itemRentPrice',
        // 'ItemRentPrice',
        'QuantityStock',
        'IsRented',
        "productImage",
        'action'
    ];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    textField:string;
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
    currencydata:any;
    frenchiseid:any;
    currency;
    color = 'primary';
    disabled = false;
    constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
        private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {

        this.formSendData = {}
        this.formServiceData = {}
        this.itemForm = this.formbulider.group({
            ItemId: [0],
            CategoryId: [null, ],
            FranchiseId: [0],
            UnitCategoryId: [null, ],
            SubCategoryId: [null, ],
            SupplierId: [null, ],
            UnitMeasurementId: [null,],
            ItemName: [null, ],
            ItemSalePrice: [null, ],
            ItemRentPrice: [null, ],
            ManufacturedDate: [null, ],
            PackingDate: [null, ],
            Discount: [null, ],
            QuantityStock: [null, ],
            Sku: [null, ],
            Barcode: [null, ],
            Tax: [null],
            ExpirationDate: [null, ],
            IsRented: [null, ],
            Description: [null, ],
            ProductLogo: [null],
            MinimumStock: [null, ],
            security: [null],
        });

        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            console.log(this.loginData);
             if(this.loginData.userRole == 1 ){
                this.frenchiseid = 0;

                }else{
                this.frenchiseid = this.loginData.franchiseId;

                }
        }
    }

    ngOnInit() {
        this.currency = this.AdminService.getCurrencyNew();

        // this.getProductData();
             // console.log(this.itemForm.value.Tax);
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
        this._getFranchise();
        // this._getUnitCategory();
        // this._getSuppliers();
        if(this.loginData.userRole != 1){
            this._getItemsListing(this.loginData.franchiseId);
        }else{
            this._getItemsListing(0);
        }
    }


    onItemSelect(item: any) {
        // debugger
        //console.log(this.selectedItems)
        for(let i=0;i<this.selectedItems.length;i++){
            this.taxname= this.selectedItems[i].taxName;
                this.taxname = this.selectedItems[i].taxName + ","
                console.log(this.taxname)
        }
    }

    onSelectAll(items: any) {
        for(let i=0;i<this.selectedItems.length;i++){
            this.taxname= this.selectedItems[i].taxName;
                this.taxname = this.selectedItems[i].taxName + ","

                console.log(this.taxname)
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

    gettaxdata() {
        this.AdminService.gettaxdata(this.FranchiseId).subscribe(data => {
            this.selecttax = data.result
            this.elements = data.result;
            console.log(this.selecttax);
        }, err => {
            console.log(err)
            //this.toastr.error('Something went wrong, please try after some time', 'Error');
        })
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
                    this.itemForm.value.FranchiseId = this.loginData.franchiseId
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
    _getItemsListing(franchiseId) {
    	console.log(franchiseId)
        this.AdminService.GetAllItemsProducts(franchiseId).subscribe(data => {
            console.log(data)
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
        console.log("gggggggggggggggggggggggggggggggg")
        // if (this.itemImage != null) {
        //     this.itemForm.controls['ProductLogo'].setValue(this.itemImage)
        // } else {
        //     delete this.itemForm.value.ProductLogo
        // }
        // if (this.itemForm.value.ItemId == 0) {
        //     delete this.itemForm.value.ItemId
        // }
        // this.formSendData = this.itemForm.value

        // if(this.itemForm.value.ItemId && this.itemForm.value.ItemId != 0){
        //     this.formSendData.FranchiseId = this.loginData.franchiseId
        // }
        var tempSend = this.submitObject();
        console.log(tempSend)
        var tempItemId= this.itemForm.value.ItemId
        this.AdminService.AddEditItemProduct(tempSend).subscribe(data => {
            // debugger
            console.log(data)
            if (data.statusCode == 200) {
                console.log(data)
                if (tempItemId == 0) {
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

    submitObject() {

        var q=this.formSendData.Tax;
        var p="";
        // for (var i=0;i<this.formSendData.Tax.length;i++)
        // {
        //     p=p+this.formSendData.Tax[i]+",";
        // }
        //this.formSendData.Tax=p;

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
        this.formSendData.Tax = this.formSendData.Tax
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
      
        var p="";
        for(let i=0;i<this.selectedItems.length;i++){
            // debugger
            this.taxname= this.selectedItems[i].taxName;
            if(this.formSendData.Tax == undefined)
            this.formSendData.Tax =  this.selectedItems[i].taxId+ ","
            else{
                this.formSendData.Tax =this.formSendData.Tax+  this.selectedItems[i].taxId+ ","
            }
        }
       

        return this.formSendData
    }

    onCancel() {
        this.itemForm.reset();
        this.formServiceData.category = []
        this.formServiceData.subCategory = []
        $('#file-upload1').val(null);
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
        console.log(data)
        // let editpData = JSON.stringify(data);
        // let encrypData = CryptoJS.AES.encrypt(editpData, 'pos_masRetail').toString()
        // this.router.navigate(['/admin/add-item/1']);

        let navigationExtras: NavigationExtras = {
            queryParams: data
        };
        this.router.navigate(["/admin/add-item"], navigationExtras);

    }

    setRent(val) {
        if (val == "true" || val == true) {
            $('#Security').show();
        }
        else {
            $('#Security').hide();
        }
    }

    ActivateItem(itemId)
    {
        debugger;
        this.AdminService.activateItem(itemId).subscribe(res=>{
            if(res.statusCode == 200){
             
              this.openSnackBar(res.message,'Success')
              // this.ngOnInit();
            }else{
              this.openSnackBar(res.message,'Error')
            }
          },err=>{
            this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
          });

    }

}