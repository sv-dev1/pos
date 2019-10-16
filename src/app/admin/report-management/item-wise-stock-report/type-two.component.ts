import {Component,OnInit,ViewChild,Inject}from '@angular/core';
import { MatFormFieldModule}from '@angular/material/form-field';
import { MatPaginator}from '@angular/material/paginator';
import { MatSort}from '@angular/material/sort';
import {MatTableDataSource}from '@angular/material/table';
import {AdminService}from '../../../shared/admin/admin.service';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA}from '@angular/material';
import {FormGroup,FormArray, FormBuilder,Validators,ReactiveFormsModule}from '@angular/forms';
import { Router, ActivatedRoute}from '@angular/router';
import {MatSnackBar}from '@angular/material/snack-bar';
import { DeleteConfirmationComponent}from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js'; //https://www.npmjs.com/package/crypto-js
declare var AOS;

export interface PeriodicElement {
 itemName: string;
 quantityStock: number;
 // returnedOn: string;
 rentedQuantityStock: number;
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
 selector: 'app-type-two',
 templateUrl: './type-two.component.html',
 styleUrls: ['./type-two.component.scss']
})
export class TypeTwoComponent implements OnInit {

 displayedColumns: string[] = [
  'itemName',
  'quantityStock',
  // 'returnedOn', 
  //'rentedQuantityStock'
  // 'action'
 ];
 dataSource = new MatTableDataSource(ELEMENT_DATA);
 // @ViewChild(MatPaginator) paginator: MatPaginator;
 // @ViewChild(MatSort) sort: MatSort;

 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;

 loginData: any;
 tableData: any;
 typetwo: FormGroup;
 formServiceData
 sendObj
 bkUpTableList: any;
 constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
  private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {

  this.formServiceData = {}
  this.formServiceData.listTotal = []
  this.sendObj = {}
  // this.dateSelect = {}
  // this.dateSelect.maxDate = new Date().toISOString().split("T")[0]
  this.typetwo = this.formbulider.group({
   FranchiseId: [null, [Validators.required]],
   // fromDate : [null, [Validators.required]],
   // toDate : [null, [Validators.required]],
  });

  if (localStorage['loginUserData']) {
   let encrypData = localStorage['loginUserData']
   let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
   this.loginData = JSON.parse(userData);
   console.log(this.loginData)
  }

 }

 ngOnInit() {
  AOS.init();
  // this._getFranchise();
  this.getStockAletsItemForAllFranchise();
  this._getFranchise();
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
    //   this.tableData = data.result
    // this.bkUpTableList =  this.tableData
    if (this.loginData.userRole != 1) {
     this.typetwo.controls['FranchiseId'].setValue(this.loginData.franchiseId)
     this.typetwo.controls['FranchiseId'].disable();
     // this.onSubmit(this.loginData.franchiseId);
    }
   } else {
    console.log(data.message)
   }
  }, err => {
   console.log(err)
  })
 }

 filterForeCasts(filterVal: any) {
   this.formServiceData.listTotal = []
  if (filterVal == "0") {
   this.tableData = this.bkUpTableList;
  }
  // this.forecasts = this.cacheForecasts;
  else {
   console.log(filterVal)
   this.tableData = this.bkUpTableList.filter(x => x.franchiseName == filterVal);
  }
 }

 onCancel() {
  this.typetwo.reset()
  if (this.loginData.userRole != 1) {
   this.typetwo.controls['FranchiseId'].setValue(this.loginData.franchiseId)
  }
  this.tableData = []
  ELEMENT_DATA = this.tableData
  this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
 }

 // onSubmit(franchiseId){
 //   this.AdminService.getReportTypeTwo(franchiseId).subscribe(res=>{
 //     console.log(res)
 //     if(res.statusCode == 200){
 //       if(res.result < 1){
 //         this.openSnackBar('No records found!','')
 //       this.tableData = []
 //       ELEMENT_DATA = this.tableData
 //       this.dataSource = new MatTableDataSource(ELEMENT_DATA);
 //       this.dataSource.paginator = this.paginator;
 //       this.dataSource.sort = this.sort;
 //       }else{      
 //         this.tableData = res.result
 //         ELEMENT_DATA = this.tableData
 //         this.dataSource = new MatTableDataSource(ELEMENT_DATA);
 //         this.dataSource.paginator = this.paginator;
 //         this.dataSource.sort = this.sort;
 //     this.openSnackBar(res.message,'Success')
 //       }
 //     }else{
 //       this.openSnackBar(res.message,'Error')
 //     }
 //   },err=>{
 //     console.log(err)
 //     this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
 //   })
 // }

 getStockAletsItemForAllFranchise() {
  this.sendObj = {}
  if (this.loginData.userRole != 1) {
   this.sendObj.franchiseId = this.loginData.franchiseId
  } else {
   this.sendObj.franchiseId = 0
  }
  this.AdminService.getReportTypeTwo(this.sendObj).subscribe(res => {
   console.log(res)
   if (res.statusCode == 200) {
    this.tableData = res.result;
    this.bkUpTableList = this.tableData;
   } else {
    this.openSnackBar(res.message, 'Error')
   }
  }, err => {
   console.log(err)
   this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
  })
 }

  getTotal(index1 : number, index2 : number, data, franchise_name : string){
    let tempIndex = this.formServiceData.listTotal.findIndex(it =>it.franchise == index1)
    let newData = data
    if(tempIndex == -1){
      var stock = 0, franchiseName = franchise_name
      for(var i = 0; i < newData.length; i++){
        if(newData[i].quantityStock != null && newData[i].quantityStock != '' && newData[i].quantityStock != undefined){
          stock = stock + newData[i].quantityStock
        }
      }
      this.formServiceData.listTotal.push({
        franchise:index1,
        stock : stock,
        franchiseName : franchise_name
      })
      tempIndex = this.formServiceData.listTotal.findIndex(it =>it.franchise == index1)
      let returnData = this.formServiceData.listTotal[tempIndex].stock
      return returnData
    }else{
      let returnData = this.formServiceData.listTotal[tempIndex].stock
      return returnData
    }
  }

  getPieChartsOption(){
    var pieData = []
    for(var i = 0; i < this.formServiceData.listTotal.length; i++){
      let obj = {
        name : this.formServiceData.listTotal[i].franchiseName,
        value : this.formServiceData.listTotal[i].stock
      }
      pieData.push(obj)
      if( i == this.formServiceData.listTotal.length - 1){
        return this.makeGraphData(pieData)
      }
    }
  }

  makeGraphData(seriesData){
    let tempchartOption = {
          title : {
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          // legend: {
          //     orient: 'horizontal',
          //     left: 'center',
          //     data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎','搜索引擎1','搜索引擎2','搜索引擎3','搜索引擎4']
          // },
          series : [
              {
                  name: '',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '50%'],
                  data:seriesData,
                  itemStyle: {
                      emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
    };
    return tempchartOption;
  }

}