import {Component,OnInit,ViewChild,Inject} from '@angular/core';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { AdminService} from '../../../shared/admin/admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormControl,FormArray, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DeleteConfirmationComponent} from '../../Alerts/delete-confirmation/delete-confirmation.component';
import * as CryptoJS from 'crypto-js'; 
declare var AOS;
import * as moment from 'moment';
import { BillViewComponent } from '../bill-view/bill-view.component';

export interface PeriodicElement {
 billNumber: string;
 balanceAmount: number;
 discount: number;
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-type-four',
  templateUrl: './type-four.component.html',
  styleUrls: ['./type-four.component.scss']
})
export class TypeFourComponent implements OnInit {

 displayedColumns: string[] = [
  'billNumber',
  'balanceAmount',
  'discount',
  'quantity'
  // 'action'
 ];
 dataSource = new MatTableDataSource(ELEMENT_DATA);
 // @ViewChild(MatPaginator) paginator: MatPaginator;
 // @ViewChild(MatSort) sort: MatSort;

 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 selectedDevice;
 loginData: any;
 tableData: any;
 typeOne: FormGroup;
 formServiceData
 sendObj
 dateSelect
 someData: any;
 bkUpTableList;
 sortingLogs
 bkUpTableList2 = []
currency:any;
 cur : any;
 constructor(private AdminService: AdminService, public dialog: MatDialog, private _snackBar: MatSnackBar,
  private formbulider: FormBuilder, private route: ActivatedRoute, public router: Router) {

  this.formServiceData = {}
  this.formServiceData.listTotal = []
  this.formServiceData.chartOptions = []
  this.sendObj = {}
  this.dateSelect = {}
  this.sortingLogs = {}
  this.sortingLogs.franchise = 1;
  this.sortingLogs.date = 1;
  this.sortingLogs.agent = 1;
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
   // console.log(this.loginData)
  }

 }

 ngOnInit() {
   this.currency = this.AdminService.getCurrencyNew();
  // this.getfrechisename();
  // console.log(this.selectedDevice);
  AOS.init();
  // this._getFranchise();

  // document.getElementById("from_date").onclick = function(e){
  // this.typeOne.controls['toDate'].setValue(null)
  // }
  this.getSeletedWeeklyDates()
  
  this.cur = this.AdminService.getCurrencyNew();
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

 _getFranchise() {
  this.AdminService.getFranchiseDetails().subscribe(data => {
   if (data.statusCode == 200) {
    this.formServiceData.franchiseList = data.result
    console.log(data.result);
    if (this.loginData.userRole != 1) {
     this.typeOne.controls['FranchiseId'].setValue(this.loginData.franchiseId)
     this.typeOne.controls['FranchiseId'].disable();
    }
   } else {
    console.log(data.message)
   }
  }, err => {
   console.log(err)
  })
 }

 onCancel() {
  // this.tableData = []
  this.getSeletedWeeklyDates();
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
    this.AdminService.getReportTypeFour(this.sendObj).subscribe(res => {
     this.formServiceData.listTotal = []
     this.formServiceData.chartOptions = []
     if (res.statusCode == 200) {
      this.bkUpTableList = res.result;
      if (res.result < 1) {
       this.openSnackBar('No records found!', '')
       this.tableData = []
       ELEMENT_DATA = this.tableData
  
      } else {
       this.tableData = res.result
       if(this.loginData.userRole != 1){
        this.filterForeCasts(this.tableData[0].franchiseName);
       }
       // this.openSnackBar(res.message, 'Success')
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

 getfrechisename() {
  this.AdminService.getReportTypeFour(this.sendObj).subscribe(res => {
   console.log(res)
   if (res.statusCode == 200) {
    if (res.result < 1) {
     this.openSnackBar('No records found!', '')
     this.tableData = []
     ELEMENT_DATA = this.tableData
     this.tableData = res.result;
     this.bkUpTableList = res.result;

     // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
     // this.dataSource.paginator = this.paginator;
     // this.dataSource.sort = this.sort;
    } else {
     this.tableData = res.result
     // ELEMENT_DATA = this.tableData
     // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
     // this.dataSource.paginator = this.paginator;
     // this.dataSource.sort = this.sort;
     this.openSnackBar(res.message, 'Success')
    }
   } else {
    this.openSnackBar(res.message, 'Error')
   }
  })
 }

 onSelectFromDate(){
    this.typeOne.controls['toDate'].setValue(null)
 }
 // onChange($event) {

 // console.log(this.selectedDevice);
 // this.tableData= this.tableData.filter(x => x.franchiseName== this.selectedDevice);
 // return this.tableData;

 // }
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

//      --    Sorting Started    --    //
  compareAccToFanchiseASC(a, b) {
    const genreA = a.franchiseName.toUpperCase();
    const genreB = b.franchiseName.toUpperCase();
    
    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
  }

  compareAccToFanchiseDSC(a, b) {
    const genreA = a.franchiseName.toUpperCase();
    const genreB = b.franchiseName.toUpperCase();
    
    let comparison = 0;
    if (genreA < genreB) {
      comparison = 1;
    } else if (genreA > genreB) {
      comparison = -1;
    }
    return comparison;
  }

  sortDataAccToFranchiseName(){
    if(this.sortingLogs.franchise && this.sortingLogs.franchise == 1){
      this.sortingLogs.franchise = 0;
      this.tableData.sort(this.compareAccToFanchiseASC)
    }else{
      this.sortingLogs.franchise = 1;
      this.tableData.sort(this.compareAccToFanchiseDSC)
    }
  }

  compareAccToAgentASC(a, b) {
    const genreA = a.agentName.toUpperCase();
    const genreB = b.agentName.toUpperCase();
    
    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
  }

  compareAccToAgentDSC(a, b) {
    const genreA = a.agentName.toUpperCase();
    const genreB = b.agentName.toUpperCase();
    
    let comparison = 0;
    if (genreA < genreB) {
      comparison = 1;
    } else if (genreA > genreB) {
      comparison = -1;
    }
    return comparison;
  }

  sortForAccToAgent(franchiseIndex, AgentIndex){
    console.log(franchiseIndex, AgentIndex)
    console.log(this.tableData[franchiseIndex])
    if(this.tableData[franchiseIndex].agentSort == 0){
      console.log("kkkkkkkkkkkkkkkkkkkkk")
      this.tableData[franchiseIndex].agentSort = 1
      this.tableData[franchiseIndex].rentAgentlist.sort(this.compareAccToAgentDSC)
    }else{
      console.log("ddddddddddddddddddddddddddddddd")
      this.tableData[franchiseIndex].agentSort = 0
      this.tableData[franchiseIndex].rentAgentlist.sort(this.compareAccToAgentASC)
    }
    
  }

  checkAgentArrow(franchiseIndex, AgentIndex){
    if(this.tableData[franchiseIndex].agentSort == 0){
      return true;
    }else{
      return false;
    }
  }

  compareAccToDateASC(a, b) {
    const genreA = new Date(a.rentedOn);
    const genreB = new Date(b.rentedOn);
    
    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
  }

  compareAccToDateDESC(a, b) {
    const genreA = new Date(a.rentedOn);
    const genreB = new Date(b.rentedOn);
    
    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
  }
  
  sortDataByDate(){
    if(this.sortingLogs.date && this.sortingLogs.date == 1){
      this.sortingLogs.date = 0;
      this.tableData.sort(this.compareAccToDateASC)
    }else{
      this.sortingLogs.date = 1;
      this.tableData.sort(this.compareAccToDateDESC)
    }
  }

  agentFilter(agent : any){
    // console.log(agent, this.bkUpTableList2)
    this.formServiceData.chartOptions = []
    this.formServiceData.listTotal = []
    if(agent == 0 || agent == "0"){
       this.tableData = this.bkUpTableList2
    }else{
      var agentSearched = this.bkUpTableList2[0].rentAgentlist.filter(x => x.agentId == agent);
      console.log(agentSearched)
      var temp = {
        franchiseId: this.bkUpTableList2[0].franchiseId,
        franchiseName: this.bkUpTableList2[0].franchiseName ,
        rentAgentlist : agentSearched
      }
      console.log(temp)
      this.tableData = []
      this.tableData.push(temp)
    }
  }

//      --    Sorting Ended    --    //
  
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

  getTotal(index1 : number, index2 : number, data, agent_name : string, type : string){

    let tempIndex = this.formServiceData.listTotal.findIndex(it =>it.franchise == index1 && it.agent == index2)
    let newData = data
    if(tempIndex == -1){
      var amount = 0, discount = 0, coupon = 0, lateChages = 0,price = 0, quantity = 0, agentName = ''

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
        if(newData[i].rentDetails.length > 0){
          let recvData =  this.getItemsPriceTotal(newData[i].rentDetails)
          price = price + recvData.price
          quantity = quantity + recvData.quantity
        }
      }
      agentName = agent_name

        this.formServiceData.listTotal.push({
          franchise:index1,
          agent: index2, 
          amount : amount,
          discount : discount,
          coupon : coupon,
          lateChages : lateChages,
          price : price,
          quantity : quantity,
          agentName : agentName
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
    if(this.tableData[index1].rentAgentlist.length == saveLength){
      // console.log(this.tableData[index1].rentAgentlist.length, "-------", saveLength)
      if(tempIndex == -1){
        // console.log(index1,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
        var agentNames = [], agentPerfData = [], color = []
        for(var i = 0; i < this.formServiceData.listTotal.length; i++){
          if(this.formServiceData.listTotal[i].franchise == index1){
            agentNames.push(this.formServiceData.listTotal[i].agentName)
            agentPerfData.push(this.formServiceData.listTotal[i].amount)
            let tempColor = this.getRandomColor();
            color.push(tempColor)
          }
          if( i == this.formServiceData.listTotal.length - 1){
            let graphData = this.makeGraphData(agentNames, agentPerfData, color)
            let saveObj = {
              franchiseIndex : index1,
              graphOption : graphData
            }
            this.formServiceData.chartOptions.push(saveObj)
            return graphData;
          }
        }
      }else{
        // console.log(tempIndex)
        return this.formServiceData.chartOptions[tempIndex].graphOption
      }
    }else{      
      var agentNames = [], agentPerfData = [], color = []
      for(var i = 0; i < this.formServiceData.listTotal.length; i++){
        if(this.formServiceData.listTotal[i].franchise == index1){
          agentNames.push(this.formServiceData.listTotal[i].agentName)
          agentPerfData.push(this.formServiceData.listTotal[i].amount)
          let tempColor = this.getRandomColor();
          color.push(tempColor)
        }
        if( i == this.formServiceData.listTotal.length - 1){
          let graphData = this.makeGraphData(agentNames, agentPerfData, color)
          let saveObj = {
            franchiseIndex : index1,
            graphOption : graphData
          }
          return graphData;
        }
      }
    }
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  makeGraphData(agentNames, agentPerfData, color){
    let tempchartOption = {
        color: color,
        tooltip : {
            trigger: 'axis',
            axisPointer : {           
                type : 'shadow'        // type：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : agentNames,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                // name:agentNames,
                type:'bar',
                barWidth: '60%',
                data:agentPerfData
            }
        ]
    };
    return tempchartOption;
  }
  openBill(billData, franchiseName, CashierName): void {
    billData.franchiseName = franchiseName
    billData.CashierName = CashierName
    billData.bill_type = 'rent'
    let dialogRef = this.dialog.open(BillViewComponent, {
        width: '600px',
        data : billData
    });
    dialogRef.afterClosed().subscribe(result => {
     if (result) {
       // 
     }
    });
}

}