import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AdminService } from '../../../shared/admin/admin.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormControl,FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js';  
declare var AOS;

export interface PeriodicElement {
 
  categoryName: string;
  categoryDescription: string;
  action: string;
 
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = [
    'categoryName',
    'categoryDescription',
    'action',
  
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  formServiceData : any;
  categoryForm : FormGroup;
  loginData : any;
  tableData;
  length=100;
  pageSize=10;
  pageSizeOptions=[5, 10, 25, 100];
  color = 'primary';
  disabled = false;
  constructor(private AdminService: AdminService, public dialog: MatDialog,private _snackBar: MatSnackBar,
		private formbulider: FormBuilder, private route: ActivatedRoute,public router: Router) { 
  		this.formServiceData = {}
  		this.categoryForm = this.formbulider.group({
        	ParentCategoryId : [0],
        	CategoryId : [0],
			    CategoryName : [null, [Validators.required]],
			    CategoryDescription : [null]
	    });

	    if(localStorage['loginUserData']){
	        let encrypData = localStorage['loginUserData']
	        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
	        this.loginData = JSON.parse(userData);
	    }	    
  }

  ngOnInit() {
    AOS.init();
  	this._getFranchise();
  	this._getCategoryListing();
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
          }
      	}else{
      	}
      },err=>{
      })
  }

  onSubmit(formValue){
  if(this.categoryForm.valid){
    let editCategoryId = formValue.CategoryId
  	if(formValue.CategoryId == 0 || formValue.CategoryId == null){
  		delete formValue.CategoryId
  	}
    if(!formValue.FranchiseId && this.loginData.userRole != 1){
      formValue.FranchiseId = this.loginData.franchiseId
    }
  	formValue.ParentCategoryId = 0
    this.AdminService.AddEditCategory(formValue).subscribe(data=>{
      if(data.statusCode == 200){
        if(editCategoryId == 0){
          this.tableData.push(data.result)
          ELEMENT_DATA = this.tableData
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{
          for(var i = 0; i < this.tableData.length; i++){
              if(this.tableData[i].categoryId == editCategoryId){
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
        this.openSnackBar(data.message,'Error')
      }
    },err=>{
      this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
    })
  }else{
    this.validateAllFormFields(this.categoryForm);
  }
  }

  openEdit(data){
    this.categoryForm.controls['CategoryId'].setValue(data.categoryId)
    this.categoryForm.controls['CategoryName'].setValue(data.categoryName)
    this.categoryForm.controls['CategoryDescription'].setValue(data.categoryDescription)
    window.scroll(0,0)
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


  onCancel(){
  	this.categoryForm.reset();
  }
    _getCategoryListing() {
    this.AdminService.getListingOfCategorySubCategory(0,this.loginData.franchiseId).subscribe(data=>{
      if(data.statusCode == 200){
        if(data.statusCode == 200){
          this.tableData = data.result
          ELEMENT_DATA = this.tableData
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{
        }
      }else{
      }
    },err=>{
    })
  }

  ActivateCategoryOrSubcategory(categoryId)
  {
    this.AdminService.activateCategoryOrSubcategory(categoryId).subscribe(res=>{
      if(res.statusCode == 200){
        this.openSnackBar(res.message,'Success')
      }else{
        this.openSnackBar(res.message,'Error')
      }
    },err=>{
      this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
    });


  }


    openDelete(id): void {
        let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            width: '470px',
        });
        dialogRef.afterClosed().subscribe(result => {
         if (result) {
           // console.log(id, result)
            this.AdminService.deleteCategory(id).subscribe(res=>{
              if(res.statusCode == 200){
                this.tableData = this.tableData.filter(data => data.categoryId != id)
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
