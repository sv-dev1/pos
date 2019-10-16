import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../../shared/admin/admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment.prod';
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js'; //https://www.npmjs.com/package/crypto-js
declare var AOS;
import * as moment from 'moment'; //https://www.npmjs.com/package/moment




@Component({
    selector: 'app-supply-report',
    templateUrl: './supply-report.component.html',
    styleUrls: ['./supply-report.component.scss']
})
export class SupplyReportComponent implements OnInit {
    loginData: any;
    typeOne: FormGroup;
    tableData: any;
    url = environment.apiUrl
    constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
        private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {
        this.typeOne = this.formbulider.group({
            supplyName: [null, [Validators.required]],
            fromDate: [null, [Validators.required]],
            toDate: [null, [Validators.required]],
        });
        if (localStorage['loginUserData']) {
            let encrypData = localStorage['loginUserData']
            let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
            this.loginData = JSON.parse(userData);
        }
    }
    ngOnInit() {
        this.url = this.url.split('//')[1].split('/')[0];
        AOS.init();
    }
    onSubmit() {
        this.AdminService.GetItemsProductsBySupplyName(this.typeOne.value.supplyName, this.typeOne.value.fromDate, this.typeOne.value.toDate).subscribe(data => this.tableData = data.result);
    }
    onCancel() {
        this.typeOne.reset();
        this.tableData = null;
    }
    downloadFile(val) {
        //this.AdminService.downloadFile(val).subscribe();

    }
}