import {Component,OnInit,ViewChild,Inject} from '@angular/core';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { AdminService} from '../../../shared/admin/admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup,FormControl, FormArray, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DeleteConfirmationComponent} from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js'; //https://www.npmjs.com/package/crypto-js
declare var AOS;
import { BillViewComponent } from '../bill-view/bill-view.component';
import * as moment from 'moment'; //https://www.npmjs.com/package/moment

@Component({
    selector: 'app-type-five',
    templateUrl: './type-five.component.html',
    styleUrls: ['./type-five.component.scss']
})
export class TypeFiveComponent implements OnInit {
currency;
 selectedDevice;
 loginData: any;
 tableData: any;
 typeOne: FormGroup;
 formServiceData
 sendObj
 dateSelect
 someData: any;
 bkUpTableList;
 bkUpTableList2;
 constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
  private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {

    this.formServiceData = {}
    this.formServiceData.listTotal = []
    this.formServiceData.chartOptions = []
    this.sendObj = {}
    this.dateSelect = {}
    this.dateSelect.maxDate = new Date().toISOString().split("T")[0]
    this.typeOne = this.formbulider.group({
     // FranchiseId : [null, [Validators.required]],
     fromDate: [null, [Validators.required]],
     toDate: [null, [Validators.required]],
    });

    if (localStorage['loginUserData']) {
     let encrypData = localStorage['loginUserData']
     let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
     this.loginData = JSON.parse(userData);
     console.log(this.loginData)
    }

    this.onCancel();
  }

  ngOnInit() {
       this.currency = this.AdminService.getCurrencyNew();

    // console.log(this.selectedDevice);
    AOS.init();
  }

  onCancel(){
    this.route.paramMap.subscribe(params => {
      if(params.get("month")){
        this.getSeletedMonthDates()
      }else{
        this.getSeletedWeeklyDates()
      }
    })
  }

  async getSeletedMonthDates(){
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date();
    let startDate = await moment(firstDay).format("YYYY-MM-DD");
    let endDate = await moment(lastDay).format("YYYY-MM-DD");
    // console.log(startDate, endDate)
    this.typeOne.controls['fromDate'].setValue(startDate)
    this.typeOne.controls['toDate'].setValue(endDate)
    // console.log(this.typeOne.value)
    this.onSubmit();
  }

  async getSeletedWeeklyDates(){
    let curr = new Date;
    let firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    let lastday = new Date();
    let startDate = await moment(firstday).format("YYYY-MM-DD");
    let endDate = await moment(lastday).format("YYYY-MM-DD");
    this.typeOne.controls['fromDate'].setValue(startDate)
    this.typeOne.controls['toDate'].setValue(endDate)
    this.onSubmit();
  }

 openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
   duration: 2000,
  });
 }

 onSelectFromDate(){
   this.typeOne.controls['toDate'].setValue(null)
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


 onSubmit() {
 if(this.typeOne.valid){
  this.sendObj.fromDate = this.typeOne.value.fromDate
  this.sendObj.todate = this.typeOne.value.toDate
  if (this.loginData.userRole != 1) {
   this.sendObj.franchiseId = this.loginData.franchiseId
  } else {
   this.sendObj.franchiseId = 0
  }
  console.log(this.sendObj)
  this.AdminService.GetCustomerSaleReport(this.sendObj).subscribe(res => {
   // console.log(res)
   this.formServiceData.listTotal = []
   this.formServiceData.chartOptions = []
   if (res.statusCode == 200) {
    if (res.result < 1) {
     this.openSnackBar('No records found!', '')
     this.tableData = []
     this.bkUpTableList = [];
     this.bkUpTableList2 = [];
    } else {
      this.tableData = res.result
      this.bkUpTableList = res.result;
      this.bkUpTableList2 = res.result;
     
      if (this.loginData.userRole != 1) {
        if(this.tableData.length > 0 && this.tableData[0].saleAgentlist.length > 0){
            // this.openSnackBar(res.message, 'Success')
        }else{
            this.openSnackBar('Data not found!', '')
        }
      } else {
        // this.openSnackBar(res.message, 'Success')
      }
    }
   } else {
    this.openSnackBar(res.message, 'Error')
   }
  }, err => {
   console.log(err)
   this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
  })
 }else{
  this.validateAllFormFields(this.typeOne);
 }
 }

  filterForeCasts(filterVal: any) {
    this.formServiceData.listTotal = []
    this.formServiceData.chartOptions = []
    if (filterVal == "0") {
     this.tableData = this.bkUpTableList;
    }
    // this.forecasts = this.cacheForecasts;
    else {
     console.log(filterVal)
     this.tableData = this.bkUpTableList.filter(x => x.franchiseName == filterVal);
     this.bkUpTableList2 = this.bkUpTableList.filter(x => x.franchiseName == filterVal);
    }
  }

  agentFilter(agent : any){
    // console.log(agent, this.bkUpTableList2)
    this.formServiceData.listTotal = []
    this.formServiceData.chartOptions = []
    if(agent == 0 || agent == "0"){
       this.tableData = this.bkUpTableList2
    }else{
      var agentSearched = this.bkUpTableList2[0].saleAgentlist.filter(x => x.customerId == agent);
      // console.log(agentSearched)
      var temp = {
        franchiseId: this.bkUpTableList2[0].franchiseId,
        franchiseName: this.bkUpTableList2[0].franchiseName ,
        saleAgentlist : agentSearched
      }
      // console.log(temp)
      this.tableData = []
      this.tableData.push(temp)
    }
  }

 // Get total 
  getItemsPriceTotal(data){
    let sendPrice = 0
    let quantity = 0
    for(var i = 0; i < data.length; i++){
      if(data[i].totalPrice != 0 && data[i].totalPrice != null && data[i].totalPrice != ''){
        sendPrice = sendPrice + data[i].totalPrice
      }
      if(data[i].quantity != 0 && data[i].quantity != null && data[i].quantity != ''){
        quantity = quantity + data[i].quantity
      }
    }
    let sendObj = {
      price :sendPrice,
      quantity :quantity
    }
    return sendObj;
  }

  getTotal(index1 : number, index2 : number, data, customer_name : string, type : string){

    let tempIndex = this.formServiceData.listTotal.findIndex(it =>it.franchise == index1 && it.agent == index2)
    let newData = data
    if(tempIndex == -1){
      var amount = 0, discount = 0, coupon = 0, lateChages = 0,price = 0, quantity = 0, customerName

      for(var i = 0; i < newData.length; i++){
        if(newData[i].balanceAmount != null && newData[i].balanceAmount != '' && newData[i].balanceAmount != undefined){
          amount = amount + newData[i].balanceAmount
        }
        if(newData[i].discount != null && newData[i].discount != '' && newData[i].discount != undefined){
          discount = discount + newData[i].discount
        }
        if(newData[i].couponValue != null && newData[i].couponValue != '' && newData[i].couponValue != undefined){
          coupon = coupon + newData[i].couponValue
        }
        if(newData[i].lateCharges != null && newData[i].lateCharges != '' && newData[i].lateCharges != undefined){
          lateChages = lateChages + newData[i].lateCharges
        }
        if(newData[i].saleDetails.length > 0){
          let recvData =  this.getItemsPriceTotal(newData[i].saleDetails)
          price = price + recvData.price
          quantity = quantity + recvData.quantity
        }
      }

        this.formServiceData.listTotal.push({
          franchise:index1,
          agent: index2, 
          amount : amount,
          discount : discount,
          coupon : coupon,
          lateChages : lateChages,
          price : price,
          quantity : quantity,
          customerName : customer_name
        })
        tempIndex = this.formServiceData.listTotal.findIndex(it =>it.franchise == index1 && it.agent == index2)
        let returnData = this.getTotal2(type,tempIndex)
        return returnData
    }else{
      let returnData = this.getTotal2(type,tempIndex)
      return returnData
    }
  }

  getTotal2(type : string, index : number){
    var sendData;
    switch(type) {
      case 'amount':
        sendData = this.formServiceData.listTotal[index].amount
        break;
      case 'discount':
        sendData = this.formServiceData.listTotal[index].discount
        break;
      case 'coupon':
        sendData = this.formServiceData.listTotal[index].coupon
        break;
      case 'lateCharge':
        sendData = this.formServiceData.listTotal[index].lateChages
        break; 
      case 'itemTotal':
        sendData = this.formServiceData.listTotal[index].price
        break;
      case 'itemQuantity':
        sendData = this.formServiceData.listTotal[index].quantity
        break;
      default:
        sendData = 0;
    }
    return sendData;
  }

  // get graph
  getChatsOption(index1 : number){
    let tempIndex = this.formServiceData.chartOptions.findIndex(it=> it.franchiseIndex == index1)
    let saveLength = 0
    this.formServiceData.listTotal.filter(data=>{
      if(data.franchise == index1){
        saveLength++;
      }
    })
    if(this.tableData[index1].saleAgentlist.length == saveLength){
      // console.log(this.tableData[index1].saleAgentlist.length, "-------", saveLength)
      if(tempIndex == -1){
        // console.log(index1,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
        var seriesData = []
        for(var i = 0; i < this.formServiceData.listTotal.length; i++){
          if(this.formServiceData.listTotal[i].franchise == index1){
            let obj = {
              name :this.formServiceData.listTotal[i].customerName,
              value : this.formServiceData.listTotal[i].amount
            }
            seriesData.push(obj)
          }
          if( i == this.formServiceData.listTotal.length - 1){
            let graphData = this.makeGraphData(seriesData)
            let saveObj = {
              franchiseIndex : index1,
              graphOption : graphData
            }
            console.log(saveObj)
            this.formServiceData.chartOptions.push(saveObj)
            return graphData;
          }
        }
      }else{
        // console.log(tempIndex)
        return this.formServiceData.chartOptions[tempIndex].graphOption
      }
    }else{      
      var seriesData = []
      for(var i = 0; i < this.formServiceData.listTotal.length; i++){
        if(this.formServiceData.listTotal[i].franchise == index1){
          let obj = {
            name :this.formServiceData.listTotal[i].customerName,
            value : this.formServiceData.listTotal[i].amount
          }
          seriesData.push(obj)
        }
        if( i == this.formServiceData.listTotal.length - 1){
          let graphData = this.makeGraphData(seriesData)
          let saveObj = {
            franchiseIndex : index1,
            graphOption : graphData
          }
          console.log(saveObj)
          return graphData;
        }
      }
    }
  }

  // getRandomColor() {
  //   var letters = '0123456789ABCDEF';
  //   var color = '#';
  //   for (var i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }

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
    openBill(billData, franchiseName, CashierName): void {
        debugger;
        billData.franchiseName = franchiseName
        billData.CashierName = CashierName
        billData.bill_type = 'sales'
        let dialogRef = this.dialog.open(BillViewComponent, {
            width: '600px',
            data: billData
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // 
            }
        });
    }
}