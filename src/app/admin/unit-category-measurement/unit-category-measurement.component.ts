import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormControl,Validators } from '@angular/forms';
import { AdminService } from '../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js';
import { DeleteConfirmationComponent } from '../Alerts/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-unit-category-measurement',
  templateUrl: './unit-category-measurement.component.html',
  styleUrls: ['./unit-category-measurement.component.scss']
})
export class UnitCategoryMeasurementComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  elements: any[];
  formServiceData: any;
  unitMeasurementForm: FormGroup;
  tableData = [];
  loginData: any;
  frenchiseid: any;
  IsActiveData: any[] = [{ name: 'Active', value: true }, { name: 'InActive', value: false }];
  backupdata;

  length = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  color = 'primary';
  disabled = false;

  displayedColumns: string[] = ['unitCategoryName', 'unitMeasurementName', 'action'];
  dataSource: any;
  constructor(private AdminService: AdminService,
    private formbulider: FormBuilder, public dialog: MatDialog, private _snackBar: MatSnackBar) {


    this.formServiceData = {}
    this.unitMeasurementForm = this.formbulider.group({

      unitCategoryId: [null, [Validators.required]],
      UnitMeasurementName: [null, [Validators.required]],
      unitMeasurementId: [0]

    });

    if (localStorage['loginUserData']) {
      let encrypData = localStorage['loginUserData']
      let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
      this.loginData = JSON.parse(userData);
      this.frenchiseid = this.loginData.franchiseId
    }

  }

  ngOnInit() {

    this.getUnitCategoryList();
    this.getUnitMeasurementList();
  }

  getUnitMeasurementList() {


    this.AdminService.getAllUnitCategoryMeasurement().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.result);
      this.backupdata = res.result;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

  }


  onChange(selectedValue) {
    this.dataSource = this.backupdata.filter(x => x.unitCategoryId == selectedValue);
    if (selectedValue == 'all') {
      this.dataSource = this.backupdata;
      //console.log("onpass parameter",this.dataSource);
    }
  }


  // getUnitCategoryList()
  // {

  //   this.AdminService.getAllUnitCategory().subscribe(data => {

  //         if (data.statusCode == 200) {
  //             this.formServiceData.unitCategoryList = data.result

  //         }
  //     }, err => {
  //         console.log(err)
  //     })
  // }

  getUnitCategoryList() {

    this.AdminService.getAllUnitCategoryList().subscribe(data => {
      debugger;
      if (data.statusCode == 200) {
        this.formServiceData.unitCategoryList = data.result

      }
    }, err => {
      console.log(err)
    })
  }

  onSubmit(formValue) {
      if(this.unitMeasurementForm.valid){
        if (formValue.unitMeasurementId == 0 || formValue.unitMeasurementId == null) {
          delete formValue.unitMeasurementId
        }
    
        this.AdminService.AddEditUnitMeasurement(formValue).subscribe(data => {
          if (data.statusCode == 200) {
            this.openSnackBar(data.message, 'Success');
            this.ngOnInit();
            this.unitMeasurementForm.reset();
          }
          else
            this.openSnackBar(data.message, 'Error');
        })
      }else{
        this.validateAllFormFields(this.unitMeasurementForm);
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


  DeleteUnitMeasureCategory(unitMeasurementId) {
    //onDeleteUnitMeasurement

    debugger;
    console.log("................")
    let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '470px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        this.AdminService.onDeleteUnitMeasurement(unitMeasurementId).subscribe(res => {
          if (res.statusCode == 200) {

            this.openSnackBar(res.message, 'Success')
            this.unitMeasurementForm.reset();
            this.ngOnInit();
          } else {
            this.openSnackBar(res.message, 'Error')
          }
        }, err => {
          this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
        });
      }
    });


  }

  openEdit(formdata) {
    debugger;
    this.unitMeasurementForm.controls['unitCategoryId'].setValue(formdata.unitCategoryId)
    this.unitMeasurementForm.controls['UnitMeasurementName'].setValue(formdata.unitMeasurementName)
    this.unitMeasurementForm.controls['unitMeasurementId'].setValue(formdata.unitMeasurementId)
    // unitMeasurementId
    window.scroll(0, 0);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onCancel() {
    this.unitMeasurementForm.reset();
  }

  activateUnitCategoryMeasurement(unitMeasurementId) {
    debugger;
    this.AdminService.activateUnitCategoryMeasurement(unitMeasurementId).subscribe(res => {
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
