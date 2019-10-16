import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../shared/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $;

@Component({
  selector: 'app-hold-list',
  templateUrl: './hold-list.component.html',
  styleUrls: ['./hold-list.component.scss']
})
export class HoldListComponent implements OnInit {

  holdData : any;
  bkUpHoldData : any;
  billDetail : any;
  SAmount : number = 0;
  show_discount
  constructor( private AdminService: AdminService,public dialogRef: MatDialogRef<HoldListComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog, private formbulider: FormBuilder, private adminService : AdminService,
         private _snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log(this.data)
    this._getHoldList(this.data.userData.franchiseId, this.data.userData.userId);
  }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    _getHoldList(franchiseId, userID){
      console.log(franchiseId, userID)
        this.adminService.getHoldOrderList(franchiseId,userID, this.data.isRent).subscribe(res=>{
            console.log(res);
            if(res.statusCode == 200){
                this.holdData = res.result;
                this.bkUpHoldData = res.result;
              // this.openSnackBar(res.message,'')
                // this._forDiscount();
            }else{
              this.openSnackBar(res.message,'Error')
            }
        },err=>{
            console.log(err)
            this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
        })
    }

    getDisplayHoldBillName(code, name){
      console.log(name, code)
      return code;
    }

    onSubmit(): void {
      if(this.billDetail){
        // console.log(this.billDetail)
         this.AdminService.playEventSound('success')
        this.dialogRef.close(this.billDetail);
      }else{
        this.openSnackBar('Select a Bill!','Error')
         this.AdminService.playEventSound('error')
      }
    }

    OnSearchHoldList(evt){
      // console.log(evt.target.value)
      let searchInput = evt.target.value.trim()
      if(searchInput != '' || searchInput != null){
        this.holdData =  this.bkUpHoldData.filter(data => {
            return  data.orderName.toLowerCase().includes(searchInput.toLowerCase()) || data.orderCode.toLowerCase().includes(searchInput.toLowerCase())
        });
      }else{
        this.holdData = this.bkUpHoldData
      }
    }

    cancelSearch(){
      $('#searchList').val('');
      this.holdData = this.bkUpHoldData
    }

    seeBill(data){
      console.log(data)
      this.billDetail = data;
      this.getSecurityAmount(data);
      this._forDiscount(data);
    }

    _forDiscount(data){
      this.show_discount = 0
      var totalItemPrice = 0
      for(var i = 0; i < data.holdOrderDetailList.length; i++){
        totalItemPrice += data.holdOrderDetailList[i].subTotal 
      }
      if(data.discountType == 1){
        this.show_discount = data.discount
      }else if(data.discountType == 2){
        this.show_discount = (data.discount * 100)/totalItemPrice
      }
    }

    getSecurityAmount(data){
      console.log(data)
      this.SAmount = 0
      for(var i= 0; i < data.holdOrderDetailList.length; i++){
        console.log(data.holdOrderDetailList[i].securityAmount)
        if(data.holdOrderDetailList[i].securityAmount != null && 
          data.holdOrderDetailList[i].securityAmount != ''){
            var newSecurity = data.holdOrderDetailList[i].securityAmount * data.holdOrderDetailList[i].quantity
            this.SAmount = this.SAmount + newSecurity
        }
        // if( i = data.holdOrderDetailList.length - 1){
        //    return this.SAmount
        // }
      }
    }

}
