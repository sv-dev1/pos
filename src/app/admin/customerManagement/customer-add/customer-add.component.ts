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
declare var AOS;
import * as moment from 'moment';

export interface PeriodicElement {
  branchName: string;
  branchAddress: string;
  phone: number;
  branchCode: string;
  date: string;
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit {
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

  loginData: any;
  tableData: any;
  customerForm: FormGroup;
  formServiceData
  length = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  formSendData: any;
  dateSelect: any;
  color = 'primary';
  disabled = false;
  constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
    private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {
    this.dateSelect = {}
    this.formServiceData = {}
    this.formSendData = {}
    this.customerForm = this.formbulider.group({
      CustomerId: [null],
      FranchiseId: [null, [Validators.required]],
      CustomerName: [null, [Validators.required]],
      CustomerContactNo: [null, [Validators.required]],
      CustomerAddress: [null],
      DateOfBirth: [null],
      CustomerN: [null, [Validators.required]],
      City: [null],
      ContactTitle: [null],
      Region: [null],
      PostalCode: [null],
      Country: [null],
      Fax: [null],
      ContectName: [null]
    });

    if (localStorage['loginUserData']) {
      let encrypData = localStorage['loginUserData']
      let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
      this.loginData = JSON.parse(userData);
      console.log(this.loginData)
    }

  }

  ngOnInit() {
    this.getSeletedDates();
    AOS.init();
    this._getFranchise();
    this._getCustomerListing();
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

  _getFranchise() {
    this.AdminService.getFranchiseDetails().subscribe(data => {
      if (data.statusCode == 200) {
        this.formServiceData.franchiseList = data.result
        if (this.loginData.userRole != 1) {
          this.customerForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
          this.customerForm.controls['FranchiseId'].disable();
        }
      } else {

      }
    }, err => {
      console.log(err)
    })
  }
  async getSeletedDates() {
    let today = new Date();
    let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    console.log(today, tomorrow)
    this.dateSelect.doiMin = await moment(today).format("YYYY-MM-DD");
    this.dateSelect.dorMin = await moment(tomorrow).format("YYYY-MM-DD");
    console.log(this.dateSelect.doiMin, this.dateSelect.dorMin)
  }


  _getCustomerListing() {
    let sendFranchiseId = 0
    if (this.loginData.userRole != 1) {
      sendFranchiseId = this.loginData.franchiseId
    }
    this.AdminService.GetAllCustomers(sendFranchiseId).subscribe(data => {
      debugger;
      console.log(data)
      if (data.statusCode == 200) {
        this.tableData = data.result
        ELEMENT_DATA = this.tableData
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
      }
    }, err => {
      console.log(err)
    })
  }

  onSubmit(formValue) {
    if(this.customerForm.valid){
      if (this.customerForm.value.CustomerId == 0 || this.customerForm.value.CustomerId == null) {
        delete this.customerForm.value.CustomerId
      }
      let sendData = this.submitObject();
      console.log(sendData)
      this.AdminService.onAddAndAditCoustomerData(sendData).subscribe(data => {
        console.log(data)
        if (data.statusCode == 200) {
          if (!this.customerForm.value.CustomerId) {
            this.tableData.push(data.result)
            ELEMENT_DATA = this.tableData
            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].customerId == data.result.customerId) {
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
    }else{
      this.validateAllFormFields(this.customerForm);
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
    this.formSendData = {}
    if (this.customerForm.value.CustomerId != 0 && this.customerForm.value.CustomerId != null) {
      this.formSendData.CustomerId = this.customerForm.value.CustomerId
    }
    this.formSendData.CustomerName = this.customerForm.value.CustomerName
    this.formSendData.CustomerContactNo = this.customerForm.value.CustomerContactNo
    this.formSendData.CustomerAddress = this.customerForm.value.CustomerAddress
    this.formSendData.DateOfBirth = this.customerForm.value.DateOfBirth
    this.formSendData.contactName = this.customerForm.value.ContectName
    this.formSendData.contactTitle = this.customerForm.value.ContactTitle
    this.formSendData.city = this.customerForm.value.City
    this.formSendData.region = this.customerForm.value.Region
    this.formSendData.postalCode = this.customerForm.value.PostalCode
    this.formSendData.country = this.customerForm.value.Country
    this.formSendData.fax = this.customerForm.value.Fax
    this.formSendData.nickName = this.customerForm.value.CustomerN
    if (this.loginData.userRole == 1) {
      this.formSendData.FranchiseId = this.customerForm.value.FranchiseId
    } else {
      this.formSendData.FranchiseId = this.loginData.franchiseId
    }

    return this.formSendData
  }

  openEdit(data) {
    console.log(data)
    debugger
    this.customerForm.controls['CustomerId'].setValue(data.customerId)
    this.customerForm.controls['FranchiseId'].setValue(data.franchiseId)
    this.customerForm.controls['CustomerName'].setValue(data.customerName)
    this.customerForm.controls['CustomerContactNo'].setValue(data.customerContactNo)
    this.customerForm.controls['CustomerAddress'].setValue(data.customerAddress)
    this.customerForm.controls['ContectName'].setValue(data.contactName)
    this.customerForm.controls['CustomerN'].setValue(data.nickName)
    this.customerForm.controls['City'].setValue(data.city)
    this.customerForm.controls['ContactTitle'].setValue(data.contactTitle)
    this.customerForm.controls['Region'].setValue(data.region)
    this.customerForm.controls['PostalCode'].setValue(data.postalCode)
    this.customerForm.controls['Country'].setValue(data.country)
    this.customerForm.controls['Fax'].setValue(data.fax)
    this.customerForm.controls['CustomerN'].setValue(data.nickName)
    if (data.dateOfBirth != null) {
      this.customerForm.controls['DateOfBirth'].setValue(data.dateOfBirth.split('T')[0])
    }
    window.scroll(0, 0);
  }

  onCancel() {
    this.customerForm.reset()
    if (this.loginData.userRole != 1) {
      this.customerForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
    }
  }

  ActivateCustomer(customerId) {
    debugger;
    this.AdminService.activateCustomer(customerId).subscribe(res => {
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


  openDelete(id): void {
    console.log("................")
    let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '470px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.onDelete(id)
        console.log(id, result)

        this.AdminService.onDeleteCustomer(id).subscribe(res => {
          if (res.statusCode == 200) {
            this.tableData = this.tableData.filter(data => data.customerId != id)
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
}
