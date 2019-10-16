import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {NgForm} from '@angular/forms';

import { AdminService } from '../../shared/admin/admin.service';
import {  FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';   

import { config } from 'rxjs';
import { MatDialog, MatSnackBar, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { DeleteConfirmationComponent } from '../Alerts/delete-confirmation/delete-confirmation.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-tax-management',
  templateUrl: './tax-management.component.html',
  styleUrls: ['./tax-management.component.scss']
})
export class TaxManagementComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  formServiceData : any;
 
  length=100;
  pageSize=10;
  pageSizeOptions=[5, 10, 25, 100];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  tableData = [];
  taxname:string;
  Description:string;
  taxtype:string;
  values:any;
  formdata:FormGroup;
  loginData : any;
  frenchiseid;
  result: any;
  dataElement: any;
  franchiseId: any;
  couponForm: any;
  color = 'primary';
  disabled = false;
  //dialog: any;

    sendObj
  constructor(private AdminService: AdminService,
    private formbulider: FormBuilder,public dialog: MatDialog,private _snackBar: MatSnackBar) {

      this.formServiceData = {}
      this.sendObj = {}
  		this.formdata = this.formbulider.group({
    
          taxId : [0],
          franchiseId: this.frenchiseid,
          taxDescription:null,
          taxType:null,
        	//FranchiseId : [null, [Validators.required]],
          taxName : [null, [Validators.required]],
          taxValues : [null, [Validators.required]],
			   
	    });

      if(localStorage['loginUserData']){
        let encrypData = localStorage['loginUserData']
        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
          this.loginData = JSON.parse(userData);
          console.log(this.loginData);
          console.log();
          if (this.loginData.userRole == 1) {
              this.frenchiseid = 0;
              console.log(this.frenchiseid)

          } else {

              this.frenchiseid = this.loginData.franchiseId;
              console.log(this.frenchiseid);
          }
         
          
    }	
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onSubmit(formValue){

    if(this.formdata.valid){
        //if(formValue.taxId == 0 || formValue.taxId == null){
    //  delete formValue.taxId
    //}
      this.sendObj = {}
      this.sendObj.taxDescription = this.formdata.value.taxDescription
      this.sendObj.taxType = this.formdata.value.taxType
      this.sendObj.taxName = this.formdata.value.taxName
      this.sendObj.taxValues = this.formdata.value.taxValues
      if (this.formdata.value.taxId != 0) {
          this.sendObj.taxId = this.formdata.value.taxId
      }
      if (this.loginData.userRole == 1) {
          this.sendObj.franchiseId = this.formdata.value.franchiseId
      } else{
          this.sendObj.franchiseId = this.loginData.franchiseId
      }
      this.AdminService.AddEditTax(this.sendObj).subscribe(data=>{
      // debugger;
      if(data.statusCode == 200){
        this.openSnackBar(data.message,'Success')
      this.formdata.reset();
      this.ngOnInit();
      }else{
        this.openSnackBar(data.message,'Error')
      }
     
    })
    }else{
      this.validateAllFormFields(this.formdata);
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

  ngOnInit() {
    this._getFranchise();
    this.gettaxdata();

    //this.gettaxdata(0);
   
    // debugger;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openEdit(data)
  {

    // debugger;
    this.formdata.controls['taxId'].setValue(data.taxId)
    this.formdata.controls['franchiseId'].setValue(data.franchiseId)
    this.formdata.controls['taxDescription'].setValue(data.taxDescription)
   
    this.formdata.controls['taxType'].setValue(data.taxType)
    this.formdata.controls['taxName'].setValue(data.taxName)
    this.formdata.controls['taxValues'].setValue(data.taxValues)
    window.scroll(0,0);
  }

  DeleteTax(taxid)
  {

    // debugger;
      console.log("................")
      let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
          width: '470px',
      });
      dialogRef.afterClosed().subscribe(result => {
       if (result) {
     

          this.AdminService. onDeleteTax(taxid).subscribe(res=>{
            if(res.statusCode == 200){
            
              this.openSnackBar(res.message,'Success')
              this.formdata.reset();
              this.ngOnInit();
            }else{
              this.openSnackBar(res.message,'Error')
            }
          },err=>{
            this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
          });
       }
      });


  }

  _getFranchise() {
    this.AdminService.getFranchiseDetails().subscribe(data => {
        if (data.statusCode == 200) {
            this.formServiceData.franchiseList = data.result
            if (this.loginData.userRole != 1) {
                this.formdata.controls['franchiseId'].setValue(this.loginData.franchiseId)
                this.formdata.controls['franchiseId'].disable();
              
            }
        } else {
            console.log(data.message)
        }
    }, err => {
        console.log(err)
    })
}

  gettaxdata() {
    
    this.AdminService.getAllTaxes(this.frenchiseid).subscribe(data=>{
      this.tableData = data.result
      ELEMENT_DATA = this.tableData
      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    },err=>{
      console.log(err)
      //this.toastr.error('Something went wrong, please try after some time', 'Error');
    })
  }

  onCancel()
  {
    this.formdata.reset();
  }

  ActivateTax(taxId)
  {
    debugger;
    this.AdminService.activateTax(taxId).subscribe(res=>{
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
