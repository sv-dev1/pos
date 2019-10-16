import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AdminService } from '../../shared/admin/admin.service';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';
@Component({
    selector: 'app-CSVImport',
    templateUrl: './CSVImport.component.html',
    styleUrls: ['./CSVImport.component.scss']
})
export class CSVImportComponent {
    uploadData: any;
    franchiseList: any;
    itemForm: FormGroup;
    nrSelect1: any;
    loginData: any;
    formServiceData;
    showProgress: any;
    constructor(private AdminService: AdminService, public dialog: MatDialog, private formbulider: FormBuilder,
        public router: Router, private _snackBar: MatSnackBar, ) {
        this.itemForm = this.formbulider.group({
            FranchiseId: [null, [Validators.required]],
            SupplierId: [null, [Validators.required]],
            SupplyName: [null, [Validators.required]],
            fileName: [null, [Validators.required]],
        });
        this.formServiceData = {}
        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
            console.log("login" + this.loginData.userId);
        }
    }
   onFileChange(event) {
        if (event.target.files.length > 0) {
        const file = event.target.files[0];
        console.log(file)
      if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type != '.xlsx' && file.type != 'application / vnd.ms - excel.sheet.macroEnabled.12') {
        alert('You can upload excel only!');
        this.itemForm.reset();
        if (this.loginData.userRole != 1) {
        this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
        this.itemForm.controls['FranchiseId'].disable();
        this.nrSelect1 = this.loginData.franchiseId;
        }
        return;
        }
        this.uploadData = new FormData();
        var reader = new FileReader();
        this.uploadData.append('myFile', event.target.files[0]);
        }
        else
        return;
  }
    onCancel() {
        this.itemForm.reset();
        if (this.loginData.userRole != 1) {
            this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
            this.itemForm.controls['FranchiseId'].disable();
            this.nrSelect1 = this.loginData.franchiseId;
        }
    }
    selectChangeHandler1(event: any) {
        this.nrSelect1 = event.target.value;
    }
    ngOnInit() {
       
        this.AdminService.getFranchiseDetails().subscribe(data => {
            if (data.statusCode == 200) {
                this.franchiseList = data.result;
                if (this.loginData.userRole != 1) {
                    this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
                    this.itemForm.controls['FranchiseId'].disable();
                    this.nrSelect1 = this.loginData.franchiseId;
                }
            }
        })
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
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
    uploadFile() {
        this.showProgress = true;
        this.AdminService.uploadFile(this.uploadData, this.nrSelect1, this.itemForm.value.SupplierId, this.itemForm.value.SupplyName, this.loginData.userId).subscribe(res => {
            console.log(res)
            if (res.statusCode == 200) {
                this.itemForm.reset();
                if (this.loginData.userRole != 1) {
                this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
                this.itemForm.controls['FranchiseId'].disable();
                this.nrSelect1 = this.loginData.franchiseId;
                }
                this.openSnackBar(res.message, 'Success')
            } else if(res.statusCode == 10001){
                this.itemForm.reset();
                if (this.loginData.userRole != 1) {
                this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
                this.itemForm.controls['FranchiseId'].disable();
                this.nrSelect1 = this.loginData.franchiseId;
                }
                this.openSnackBar('File format not supported.', 'Error')
            }else {
                this.itemForm.reset();
                if (this.loginData.userRole != 1) {
                this.itemForm.controls['FranchiseId'].setValue(this.loginData.franchiseId)
                this.itemForm.controls['FranchiseId'].disable();
                this.nrSelect1 = this.loginData.franchiseId;
                }
                this.openSnackBar(res.message, 'Error')
            }
            this.showProgress = false;
        }, err => {
            this.showProgress = false;
            this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
        });
    }
    onSubmit(formValue) {
        // this.AdminService.uploadFile(this.uploadData);
    }

}