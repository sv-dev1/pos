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
 
  unitCategoryName: string;
  
  action: string;
 
}

@Component({
  selector: 'app-unitcategory',
  templateUrl: './unitcategory.component.html',
  styleUrls: ['./unitcategory.component.scss']
})


export class UnitcategoryComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  elements: any[];
  formServiceData : any;
  unitCategoryForm : FormGroup;
  tableData = [];
  loginData : any;
 
  frenchiseid:any;
  IsActiveData:any[] = [{name: 'Active', value: true}, {name: 'InActive', value: false}];


  length=100;
  pageSize=10;
  pageSizeOptions=[5, 10, 25, 100];

  displayedColumns: string[] = ['unitCategoryName',  'action'];
  dataSource :any;
  
  color = 'primary';
  disabled = false;

  constructor(private AdminService: AdminService,
    private formbulider: FormBuilder,public dialog: MatDialog,private _snackBar: MatSnackBar) { 

      this.formServiceData = {}
  		this.unitCategoryForm = this.formbulider.group({
          unitCategoryId : [0],
          // isDeleted:[0]  ,
          // createdDate:null,
          // deletedDate:null,
          // isActive : [0],

          unitCategoryName : [null, [Validators.required]],
         			   
	    });

      if(localStorage['loginUserData']){
        let encrypData = localStorage['loginUserData']
        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
        this.loginData = JSON.parse(userData);
        this.frenchiseid = this.loginData.franchiseId
    }	


    }

  ngOnInit() {

      this.getCategoryUnitData();
  }

  getCategoryUnitData()
  {
   
    this.AdminService.getAllUnitCategoryList().subscribe(res => {
    
    //this.elements = JSON.parse(res);   
    this.dataSource=new MatTableDataSource(res.result);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  })
}


public doFilter = (value: string) => {
  this.dataSource.filter = value.trim().toLocaleLowerCase();
}

onSubmit(formValue){
 if(this.unitCategoryForm.valid){
  if(formValue.unitCategoryId == 0 || formValue.unitCategoryId == null){
    delete formValue.unitCategoryId
  }
   
    this.AdminService.AddEditUnitCategory(formValue).subscribe(data=>{
      if(data.statusCode == 200){
      this.openSnackBar(data.message,'Success');
      this.ngOnInit();
      this.unitCategoryForm.reset();
      }
      else
      this.openSnackBar(data.message,'Error');
    })
  
 }else{
    this.validateAllFormFields(this.unitCategoryForm);
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

openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 2000,
  });
}

openEdit(formdata)
{
  debugger;
  this.unitCategoryForm.controls['unitCategoryName'].setValue(formdata.unitCategoryName)
  this.unitCategoryForm.controls['unitCategoryId'].setValue(formdata.unitCategoryId)
  window.scroll(0,0);

}

DeleteUnitCategory(unitCategoryId)
{
  //debugger;
  console.log("................")
  let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '470px',
  });
  dialogRef.afterClosed().subscribe(result => {
   if (result) {
 

      this.AdminService.onDeleteUnitCategory(unitCategoryId).subscribe(res=>{
        if(res.statusCode == 200){
      
          this.openSnackBar(res.message,'Success')
          this.unitCategoryForm.reset();
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


onCancel()
{
  this.unitCategoryForm.reset();
}

ActivateUnitCategory(unitCategoryId)
{
  debugger;
  this.AdminService.activateUnitCategory(unitCategoryId).subscribe(res=>{
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
