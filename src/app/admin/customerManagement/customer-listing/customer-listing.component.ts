import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AdminService } from '../../../shared/admin/admin.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js
declare var AOS;

export interface PeriodicElement {
  branchName: string;
  branchAddress: string;
  phone: number;
  branchCode: string;
  date : string;
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-customer-listing',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.scss']
})
export class CustomerListingComponent implements OnInit {
	displayedColumns: string[] = [
	    'customerName', 
	    'customerContactNo', 
	    'customerAddress', 
	    'DateOfBirth', 
	    'franchiseName',
	    'action'
	];
	dataSource = new MatTableDataSource(ELEMENT_DATA);
	  // @ViewChild(MatPaginator) paginator: MatPaginator;
	  // @ViewChild(MatSort) sort: MatSort;
	  
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;


  color = 'primary';
  disabled = false;
	loginData : any;
	tableData : any;
  	customerForm: FormGroup;
    formServiceData
    

  constructor(private AdminService: AdminService, public dialog: MatDialog,private _snackBar: MatSnackBar,
		private formbulider: FormBuilder, private route: ActivatedRoute,public router: Router) { 

  		this.formServiceData = {}
	    this.customerForm = this.formbulider.group({
	    	CustomerId : [null],
		    FranchiseId : [0],
		    CustomerName: [null],
		    CustomerContactNo: [null, [Validators.required]],
		    CustomerAddress: [null],
		    DateOfBirth: [null],
	    });

	    if(localStorage['loginUserData']){
	        let encrypData = localStorage['loginUserData']
	        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
	        this.loginData = JSON.parse(userData);
	        console.log(this.loginData)
	    }	 

  }

  ngOnInit() {
    AOS.init();
  	this._getFranchise();
  	// this._getCustomerListing();

    if(this.loginData.userRole != 1){
      this._getCustomerListing(this.loginData.franchiseId);
    }else{
      this._getCustomerListing(0);
    }
  }

	applyFilter(filterValue: string) {
	    this.dataSource.filter = filterValue.trim().toLowerCase();
	    if (this.dataSource.paginator) {
	        this.dataSource.paginator.firstPage();
	    }
	 }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  _getFranchise(){
      this.AdminService.getFranchiseDetails().subscribe(data=>{
      	if(data.statusCode == 200){
      		this.formServiceData.franchiseList = data.result
          if(this.loginData.userRole != 1){
            this.customerForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
            this.customerForm.controls['FranchiseId'].disable();
          }
      	}else{
      		console.log(data.message)
      	}
      },err=>{
        console.log(err)
      })
  }

    _getCustomerListing(franchiseId){
		    this.AdminService.GetAllCustomers(franchiseId).subscribe(data=>{
		        console.log(data)
		      if(data.statusCode == 200){
		          this.tableData = data.result
		          ELEMENT_DATA = this.tableData
		          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
		          this.dataSource.paginator = this.paginator;
		          this.dataSource.sort = this.sort;
		      }else{
		        // this.openSnackBar(data.message,'Error')
		      }
		    },err=>{
		      console.log(err)
		      // this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
		    })
    }

  onSubmit(formValue){
  	if(this.customerForm.value.CustomerId == 0 || this.customerForm.value.CustomerId == null){
  		delete this.customerForm.value.CustomerId
  	}
  	console.log(this.customerForm.value)
    this.AdminService.onAddAndAditCoustomerData(this.customerForm.value).subscribe(data=>{
        console.log(data)
      if(data.statusCode == 200){
        if(!this.customerForm.value.CustomerId){
          this.tableData.push(data.result)
          ELEMENT_DATA = this.tableData
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{
          for(var i = 0; i < this.tableData.length; i++){
              if(this.tableData[i].customerId == data.result.customerId){
                this.tableData[i] = data.result;
		        ELEMENT_DATA = this.tableData
		        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
		        this.dataSource.paginator = this.paginator;
		        this.dataSource.sort = this.sort;
              }
          }
        }
        this.onCancel();
        this.openSnackBar(data.message,'Success')
      }else{
        console.log(data.message)
        this.openSnackBar(data.message,'Error')
      }
    },err=>{
      console.log(err)
      this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
    })
  }

  openEdit(data){
    console.log(data)
    this.customerForm.controls['CustomerId'].setValue(data.customerId)
    this.customerForm.controls['FranchiseId'].setValue(data.franchiseId)
    this.customerForm.controls['CustomerName'].setValue(data.customerName)
    this.customerForm.controls['CustomerContactNo'].setValue(data.customerContactNo)
    this.customerForm.controls['CustomerAddress'].setValue(data.customerAddress)
    if(data.dateOfBirth != null){
    	this.customerForm.controls['DateOfBirth'].setValue(data.dateOfBirth.split('T')[0])
    }
    window.scroll(0,0);
  }

  onCancel(){
    this.customerForm.reset()
    if(this.loginData.userRole != 1){
        this.customerForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
    }
  }

  ActivateCustomer(customerId)
  {
    debugger;
    this.AdminService.activateCustomer(customerId).subscribe(res=>{
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



    openDelete(id): void {
      console.log("................")
        let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            width: '470px',
        });
        dialogRef.afterClosed().subscribe(result => {
         if (result) {
           // this.onDelete(id)
           console.log(id, result)

            this.AdminService.onDeleteCustomer(id).subscribe(res=>{
              if(res.statusCode == 200){
                this.tableData = this.tableData.filter(data => data.customerId != id)
                ELEMENT_DATA = this.tableData
                this.dataSource = new MatTableDataSource(ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.openSnackBar(res.message,'Success')
              }else{
                this.openSnackBar(res.message,'Error')
              }
            },err=>{
              this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
            });

         }
        });
    }
}
