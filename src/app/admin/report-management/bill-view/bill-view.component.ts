import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../shared/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $;

@Component({
  selector: 'app-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.scss']
})
export class BillViewComponent implements OnInit {

  billData
  currency = ''
  constructor( private AdminService: AdminService,public dialogRef: MatDialogRef<BillViewComponent>,
   	@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private formbulider: FormBuilder,
   		private adminService : AdminService, private _snackBar: MatSnackBar) { 
        this.billData = Object.assign({}, data);

  		  console.log(this.billData)
        let purchaseDate
        if(this.billData.bill_type == 'sales'){
          this.billData.itemDetails = this.billData.saleDetails
          purchaseDate = new Date(this.billData.saleDate)
        }else{
          this.billData.itemDetails = this.billData.rentDetails
          purchaseDate = new Date(this.billData.createdDate) 
        }
        let time = purchaseDate.getTime()
        console.log(time)
        this.billData.saleDate = time
        this.currency = this.AdminService.getCurrencyNew();
  }

  ngOnInit() {
     $(".content111").mCustomScrollbar();
  }

  onNoClick(){
    this.dialogRef.close();
  }

}
