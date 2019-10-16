import { Component, OnInit, ViewChild, Inject, AfterViewInit  } from '@angular/core';
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
  selector: 'app-group-product-list',
  templateUrl: './group-product-list.component.html',
  styleUrls: ['./group-product-list.component.scss']
})
export class GroupProductListComponent implements OnInit {
currency:any;
	formServiceData : any;
	groupItemForm : FormGroup;
	loginData : any;
    Id:string;
    displayedColumns = [
        'sku'
        // 'Sku',
        
    ];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    grouplistData = [];
    grouplistDataBkUp = [];

  constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
        private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {
  			this.formServiceData = {}
        this.groupItemForm = this.formbulider.group({
            FranchiseId: [0],
        });
	   
        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            // console.log(this.loginData);
        }

       
  }

  ngOnInit() {
   this.currency = this.AdminService.getCurrencyNew();

    // console.log(this.Id);
    AOS.init();
    this._getFranchise();
    if(this.loginData.userRole == 1){
      this.GetAllGroupListing(0);
    }else{
      this.GetAllGroupListing(this.loginData.franchiseId);
    }
   
  }

    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
          duration: 2000,
      });
    }

    async applyFilter(filterValue: string) {
        if(filterValue.trim() == null || filterValue.trim() == ''){
          console.log("ppppp")
          this.grouplistData = this.grouplistDataBkUp
        }else{        
          var tableList = []
          let bkUpData = this.grouplistDataBkUp
          // console.log(bkUpData)
          for(var i = 0; i < bkUpData.length; i++){

              var items = await this.filter2(filterValue.toLowerCase(), bkUpData[i].groupItemViewModelList)
              if(items.length > 0){
                let temp = Object.assign({}, bkUpData[i]);
                temp.groupItemViewModelList = items
                tableList.push(temp)
              }
              if(i == bkUpData.length - 1){
                this.grouplistData = tableList
              }
          }
        }
    }

    filter2(filterValue: string, data){
        var items = []
        for(var j = 0; j < data.length; j++){
          let itemList = data[j]
          let tempName = itemList.itemGroupName.toLowerCase()
          // console.log(filterValue, tempName)
          if(itemList.itemGroupName != null && itemList.itemGroupName != '' && itemList.itemGroupName != undefined
            && tempName.includes(filterValue)){
              items.push(itemList)
          }
        } 
        return items
    }

  _getFranchise() {
      this.AdminService.getFranchiseDetails().subscribe(data => {
          if (data.statusCode == 200) {
              this.formServiceData.franchiseList = data.result
              if (this.loginData.userRole != 1) {
                  this.groupItemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
                  this.groupItemForm.controls['FranchiseId'].disable();
                  this.groupItemForm.value.FranchiseId = this.loginData.franchiseId
              }
          } else {
              console.log(data.message)
          }
      }, err => {
          console.log(err)
      })
  }

  GetAllGroupListing(franchiseId){
    this.AdminService.getAllGroupProducts(franchiseId).subscribe(data =>{
        // console.log(data)
        if (data.statusCode == 200) {
            this.grouplistData = data.result
            this.grouplistDataBkUp = data.result
            // console.log(this.grouplistData)
        } else {
            console.log(data.message)
        }
    }, err => {
        console.log(err)
    
    })
  }

openDelete(id): void {
    // console.log("................")
    let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        width: '470px',
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            // this.onDelete(id)
            console.log(id, result)

            this.AdminService.onDeleteGroupItem(id).subscribe(res => {
                if (res.statusCode == 200) {
                    this.grouplistData = this.grouplistData.filter(data => data.itemId != id)
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


 ngAfterViewInit(){
   // console.log("oooooooooooooooooooooooooooooooooooooooooooo")
 }


}
