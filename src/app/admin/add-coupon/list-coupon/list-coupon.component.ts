import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AdminService } from '../../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
declare var $: any;

@Component({
  selector: 'app-list-coupon',
  templateUrl: './list-coupon.component.html',
  styleUrls: ['./list-coupon.component.scss']
})
export class ListCouponComponent implements OnInit {

    // maps the local data column to fields property
    public localFields: Object = { text: 'itemName', value: 'itemId' };
  
    public localWaterMark: string = 'Select Products';

    color = 'primary';
    
    disabled = false;
    dropdownList = [];
   
    dropdownSettings = {};

    elements: any[];
    formServiceData : any;
    couponForm : FormGroup;
   
    loginData : any;

 // dropdownSettings = {};
  coupontype:any[] = [{name: 'Percentage', value: 1}, {name: 'Fixed amount', value: 2}];
  IsActiveData:any[] = [{name: 'Active', value: true}, {name: 'InActive', value: false}];


  selectedProductId=[2,3,4];

  couponRecord:any;
  length=100;
  pageSize=5;
  pageSizeOptions=[5, 10, 25, 100];
  public displayedColumns = ['couponCode', 'products',  'value', 'expirationDate','isActive','Action'];
  currency: any;
  constructor(private AdminService: AdminService, public dialog: MatDialog,private _snackBar: MatSnackBar,
		private formbulider: FormBuilder, private route: ActivatedRoute,public router: Router) {

    this.formServiceData = {}

  	this.couponForm = this.formbulider.group({
      CouponId:[0],
      franchiseId:[0],
      couponcode : [null, [Validators.required]],
      Value : [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      CouponType : [null, [Validators.required]],
      IsActive : [null, [Validators.required]],
			ProductID : [null, [Validators.required]],
      ExpirationDate : [null, [Validators.required]],
      Description:null,
      CreatedDate:null,
      DeletedDate:null,
      CreatedBy:[0],
      IsDeleted:[0],
      IsConsumed:[0],
    });

    if(localStorage['loginUserData']){
      let encrypData = localStorage['loginUserData']
      let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
      this.loginData = JSON.parse(userData);
      //console.log(this.loginData)
    }

  }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.currency = this.AdminService.getCurrencyNew();
    this._getItemList();
    this._getFranchise();
   
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    if(this.loginData.userRole != 1){
      this._getCouponListing(this.loginData.franchiseId);
    }else{
      this._getCouponListing(0);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

 
  onSubmit(formValue){

    if(formValue.CouponId == 0 || formValue.CouponId == null){
      delete formValue.CouponId
    }

    if (this.loginData.userRole != 1) {
      formValue.franchiseId=this.loginData.franchiseId;
    }
      debugger;
      this.AdminService.AddCoupon(formValue,formValue.CreatedBy=this.loginData.userId).subscribe(data=>{
        if(data.statusCode == 200){
      
        this.openSnackBar(data.message,'Success')
        this.ngOnInit();
        this.couponForm.reset();
        }
        else
        this.openSnackBar(data.message,'Error')
      })

  }

  openEdit(data){
    let navigationExtras: NavigationExtras = {
        queryParams: data
    };
    this.router.navigate(["/admin/add-coupon"], navigationExtras); 
  }


  public doFilter = (value: string) => {
    this.couponRecord.filter = value.trim().toLocaleLowerCase();
  }

  _getFranchise() {
    this.AdminService.getFranchiseDetails().subscribe(data => {
      debugger;
        if (data.statusCode == 200) {
            this.formServiceData.franchiseList = data.result
            debugger;
            if (this.loginData.userRole != 1) {
                this.couponForm.controls['franchiseId'].setValue(this.loginData.franchiseId)
                this.couponForm.controls['franchiseId'].disable();
                this.couponForm.value.FranchiseId = this.loginData.franchiseId
           
            }
        } else {
            console.log(data.message)
        }
    }, err => {
        console.log(err)
    })
}

  DeleteCoupon(couponId)
  {
      debugger;
      console.log("................")
      let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
          width: '470px',
      });
      dialogRef.afterClosed().subscribe(result => {
       if (result) {
    
          this.AdminService.deleteCoupon(couponId).subscribe(res=>{
            if(res.statusCode == 200){
             
              this.openSnackBar(res.message,'Success')
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


  ActivateCoupon(ccode)
  {
    this.AdminService.activateCoupon(ccode).subscribe(res=>{
      if(res.statusCode == 200){
       
        this.openSnackBar(res.message,'Success')
        this.ngOnInit();
      }else{
        this.openSnackBar(res.message,'Error')
      }
    },err=>{
      this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
    });

  }

  _getItemList()
  {
    debugger;
    this.formServiceData.products = []
    this.AdminService.GetItemsProducts(this.loginData.franchiseId).subscribe(data=>{
      console.log(data)
      if(data.statusCode == 200){
         this.elements=data.result;
         this.dropdownList=data.result;
      }else{
        console.log(data.message)
      }
    },err=>{
      console.log(err)
    })

    // debugger;
    // this.formServiceData.products = []
    // this.AdminService.getAllItems(this.loginData.franchiseId).subscribe(data=>{
    // this.elements=data;
    // this.dropdownList=data;

    // console.log(this.elements);
    // debugger;
   
    //   },err=>{
    //     console.log(err)
    //   })
  }


  _getCouponListing(franchiseId){
    console.log(franchiseId)
    this.AdminService.getListOfCoupon(franchiseId).subscribe(res => {
      //this.elements = JSON.parse(res);   
      this.couponRecord=new MatTableDataSource(res.result);
      this.couponRecord.sort = this.sort;
      this.couponRecord.paginator = this.paginator;
      console.log(res.result);
    },err=>{

    });
  }

  onCancel()
  {
    this.couponForm.reset();
    if (this.loginData.userRole != 1) {
      this._getFranchise();
   }
  }


}
