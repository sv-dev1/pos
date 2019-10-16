import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../shared/admin/admin.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CashierAddItemComponent } from '../cashier-management/cashier-add-item/cashier-add-item.component';
import { sale } from '../shared/common_class/sale';
import { saledetails } from '../shared/common_class/saledetails';
import { rent } from '../shared/common_class/rent';
import { rentdetails } from '../shared/common_class/rentdetails';
export interface State {
    createdDate: string,
    customerAddress: string
    customerContactNo: string
    customerId: number
    customerName: string
    dateOfBirth: null
    deletedDate: string
    franchiseId: number
    franchiseName: string
    isActive: boolean
    isDeleted: boolean
}

@Component({
    selector: 'app-manage-return',
    templateUrl: './manage-return.component.html',
    styleUrls: ['./manage-return.component.scss']
})
export class ManageReturnComponent implements OnInit {
    ngOnInit() {
    }
}