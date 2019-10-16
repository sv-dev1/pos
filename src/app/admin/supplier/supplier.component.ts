import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { AdminService } from '../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js';   
import { DeleteConfirmationComponent } from '../Alerts/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  formServiceData : any;
 

  formdata:FormGroup;
  loginData : any;
  frenchiseid;
  result: any;
  dataElement:any;
  couponForm: any;
  color = 'primary';
  disabled = false;


  length=100;
  pageSize=10;
  pageSizeOptions=[5, 10, 25, 100];

  displayedColumns: string[] = ['supplierName', 'supplierAddress','supplierCity', 'supplierContactNo', 'action'];
  dataSource :any;

  constructor(private AdminService: AdminService,
    private formbulider: FormBuilder,public dialog: MatDialog,private _snackBar: MatSnackBar) {

      this.formServiceData = {}
  		this.formdata = this.formbulider.group({
          supplierId : [0],
          franchiseId:[null, [Validators.required]],
          supplierName : [null, [Validators.required]],
          supplierAddress : [null, [Validators.required]],
          supplierCity : [null, [Validators.required]],
          supplierContactNo : [null, [Validators.required]],
          cellphone: [null, [Validators.required]],
          email: [null, [Validators.required]],
          companyName: [null, [Validators.required]],
	    });

      if(localStorage['loginUserData']){
        let encrypData = localStorage['loginUserData']
        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
        this.loginData = JSON.parse(userData);
        this.frenchiseid = this.loginData.franchiseId
    }	

     }

  ngOnInit() {
    this._getFranchise();
    this.getSupplierList();
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openEdit(data)
  {

    if (this.loginData.userRole != 1) {

      this._getFranchise();
  
    }
    debugger;
    this.formdata.controls['supplierId'].setValue(data.supplierId)
    this.formdata.controls['franchiseId'].setValue(data.franchiseId)
    this.formdata.controls['supplierName'].setValue(data.supplierName)
    this.formdata.controls['supplierAddress'].setValue(data.supplierAddress)
    this.formdata.controls['supplierCity'].setValue(data.supplierCity)
      this.formdata.controls['supplierContactNo'].setValue(data.supplierContactNo)
      this.formdata.controls['companyName'].setValue(data.companyName)
      this.formdata.controls['cellphone'].setValue(data.cellphone)
      this.formdata.controls['email'].setValue(data.email)
    window.scroll(0,0);
  }


  DeleteSupplier(supplierId)
  {
    //onDeleteUnitMeasurement

  debugger;
  console.log("................")
  let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '470px',
  });
  dialogRef.afterClosed().subscribe(result => {
   if (result) {
 
      this.AdminService.DeleteSupplier(supplierId).subscribe(res=>{
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


  onSubmit(formValue){
    if(this.formdata.valid){
      if(formValue.supplierId == 0 || formValue.supplierId == null)
      {
        delete formValue.supplierId
      }
  
  
      if (this.loginData.userRole != 1) {
  
        formValue.franchiseId=this.loginData.franchiseId;
      }
  
       this.AdminService.AddEditSupplier(formValue).subscribe(data=>{
        if(data.statusCode == 200){
          this.openSnackBar(data.message,'Success')
        this.formdata.reset();
        this.ngOnInit();
        }else{
          this.openSnackBar(data.message,'Error')
        }
       
      })
    }else{
        this.validateAllFormFields(this.formdata)
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

  onCancel()
  {
    this.formdata.reset();
    if (this.loginData.userRole != 1) {
     this._getFranchise();
  }
  }


  _getFranchise() {
    this.AdminService.getFranchiseDetails().subscribe(data => {
      debugger;
        if (data.statusCode == 200) {
            this.formServiceData.franchiseList = data.result
            if (this.loginData.userRole != 1) {
                this.formdata.controls['franchiseId'].setValue(this.loginData.franchiseId)
                this.formdata.controls['franchiseId'].disable();
                this.formdata.value.FranchiseId = this.loginData.franchiseId
             
            }
        } else {
            console.log(data.message)
        }
    }, err => {
        console.log(err)
    })
}



getSupplierList()
  {
      this.AdminService.GetALLSupplier(this.loginData.franchiseId).subscribe(res => {
        debugger;
      this.dataSource=new MatTableDataSource(res.result);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      })
  }

  ActivateSupplier(supplierId)
  {
    debugger;
    this.AdminService.activateSupplier(supplierId).subscribe(res=>{
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
