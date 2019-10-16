import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AdminService } from '../../../shared/admin/admin.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js';  
declare var AOS;


@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  categoryName:string;
  subCategoryName:string;
  categoryDescription:string;
  displayedColumns = [
    //'franchiseName',
    'categoryName',
    // 'CategoryDescription',
    'subCategoryName',
    'categoryDescription',
    'action'
  ];
  dataSource: MatTableDataSource<Element>;
    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  formServiceData : any;
  subCategoryForm : FormGroup;
  loginData : any;
  tableData
  length=100;
  pageSize=10;
  pageSizeOptions=[5, 10, 25, 100]; 
  color = 'primary';
  disabled = false;
  constructor(private AdminService: AdminService, public dialog: MatDialog,private _snackBar: MatSnackBar,
		private formbulider: FormBuilder, private route: ActivatedRoute,public router: Router) { 

  		this.formServiceData = {}
  		this.subCategoryForm = this.formbulider.group({
        	//FranchiseId : [null, [Validators.required]],
        	ParentCategoryId : [null, [Validators.required]],
        	CategoryId : [0],
			    CategoryName : [null, [Validators.required]],
			    CategoryDescription : [null]
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
      this._getSubCategoryListing();
      this.getCategoryListing(0, this.loginData.franchiseId);
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
            //this.subCategoryForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
            //this.subCategoryForm.controls['FranchiseId'].disable();
            this.getCategoryListing(0,this.loginData.franchiseId)
          }
      	}else{
      		console.log(data.message)
      	}
      },err=>{
        console.log(err)
      })
  }


	applyFilter(filterValue: string) {
	    this.dataSource.filter = filterValue.trim().toLowerCase();
	    if (this.dataSource.paginator) {
	      this.dataSource.paginator.firstPage();
	    }
	}


    _getSubCategoryListing() {
     
        this.AdminService.getListingOfAllSubCategory(0, this.loginData.franchiseId).subscribe(data => {

        console.log(data)
      if(data.statusCode == 200){
          if (data.statusCode == 200) {
              debugger;
          this.tableData = data.result
          // ELEMENT_DATA = this.tableData
          // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;

        const ELEMENT_DATA: Element[] = this.tableData
        const users: Element[] = ELEMENT_DATA;
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        }else{
        	console.log(data.message)
        }
      }else{
        console.log(data.message)
      }
    },err=>{
      console.log(err)
    })
  }

    getCategoryListing(categoryId, franchiseId) {
        if (franchiseId == null) {
            franchiseId = 0;
        }
  	this.formServiceData.category = []
  	console.log(categoryId, franchiseId)
      this.AdminService.getCategoryAndSubCategory(0,franchiseId).subscribe(data=>{
        debugger;
      	console.log(data)
        if(data.statusCode == 200){
          this.formServiceData.category = data.result
          console.log(this.formServiceData.category)
            if (categoryId != 0) {
                debugger;
         	this.subCategoryForm.controls['ParentCategoryId'].setValue(categoryId)
          }
        }else{
          console.log(data.message)
        }
      },err=>{
        console.log(err)
      })
  }

  openEdit(data){
      console.log(data)
      debugger;
    this.subCategoryForm.controls['CategoryId'].setValue(data.subCategoryId)
    //this.subCategoryForm.controls['FranchiseId'].setValue(data.franchiseId)
    this.getCategoryListing(data.parentCategoryId, data.franchiseId)
    // this.subCategoryForm.controls['ParentCategoryId'].setValue(data.categoryId)
    this.subCategoryForm.controls['CategoryName'].setValue(data.subCategoryName)
    this.subCategoryForm.controls['CategoryDescription'].setValue(data.categoryDescription)
    window.scroll(0,0);
  }

  onCancel(){
  	this.subCategoryForm.reset();
  	// if(this.loginData.userRole != 1){
  	// 	this.formServiceData.category = []
  	// }
  }

  onSubmit(formValue){
  if(this.subCategoryForm.valid){
    console.log(formValue)
  	let editCategoryId = formValue.CategoryId
  	if(formValue.CategoryId == 0 || formValue.CategoryId == null){
  		delete formValue.CategoryId
  	}
    if(!formValue.FranchiseId && this.loginData.userRole != 1){
      formValue.FranchiseId = this.loginData.franchiseId
    }
  	// formValue.ParentCategoryId = 0
  	console.log(formValue)
    this.AdminService.AddEditCategory(formValue).subscribe(data=>{
        console.log(data)
      if(data.statusCode == 200){
        if(editCategoryId == 0){
          this.tableData.push(data.result)
	        const ELEMENT_DATA: Element[] = this.tableData
	        const users: Element[] = ELEMENT_DATA;
	        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
	        this.dataSource.paginator = this.paginator;
	        this.dataSource.sort = this.sort;
        }else{
          for(var i = 0; i < this.tableData.length; i++){
              if(this.tableData[i].subCategoryId == editCategoryId){
                this.tableData[i] = data.result;
    		        const ELEMENT_DATA: Element[] = this.tableData
    		        const users: Element[] = ELEMENT_DATA;
    		        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    		        this.dataSource.paginator = this.paginator;
    		        this.dataSource.sort = this.sort;
              }
          }
        }
        this.onCancel();
        //if(this.loginData.userRole != 1){
        //	this.subCategoryForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
        //}
        this.openSnackBar(data.message,'Success')
      }else{
        console.log(data.message)
        this.openSnackBar(data.message,'Error')
      }
    },err=>{
      console.log(err)
      this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
    })
  }else{
    this.validateAllFormFields(this.subCategoryForm);
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
  ActivateCategoryOrSubcategory(categoryId)
  {
    debugger;
    this.AdminService.activateCategoryOrSubcategory(categoryId).subscribe(res=>{
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

            this.AdminService.deleteCategory(id).subscribe(res=>{
              if(res.statusCode == 200){
                this.tableData = this.tableData.filter(data => data.subCategoryId != id)
		        const ELEMENT_DATA: Element[] = this.tableData
		        const users: Element[] = ELEMENT_DATA;
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

export interface Element {
  franchiseName: string;
  categoryName: string;
  subCategoryName: string;
  categoryDescription: string;
}
