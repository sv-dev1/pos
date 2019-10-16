import { Component,OnInit} from '@angular/core';
import {AdminService} from '../../../shared/admin/admin.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
declare var AOS;
import * as CryptoJS from 'crypto-js'; //https://www.npmjs.com/package/crypto-js

@Component({
 selector: 'app-type-three',
 templateUrl: './type-three.component.html',
 styleUrls: ['./type-three.component.scss']
})
export class TypeThreeComponent implements OnInit {
currency:any;
 tableList
 sendObj
 loginData
 bkUpTableList
 formServiceData
 constructor(private AdminService: AdminService, private _snackBar: MatSnackBar,
  private route: ActivatedRoute, public router: Router) {
  this.sendObj = {}
  this.formServiceData = {}
  this.formServiceData.listTotal = []
  if (localStorage['loginUserData']) {
   let encrypData = localStorage['loginUserData']
   let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
   this.loginData = JSON.parse(userData);
   console.log(this.loginData)
  }
 }

 ngOnInit() {
   this.currency = this.AdminService.getCurrencyNew();
  AOS.init();
  this.getRentedListForAllFranchise();
 }

 openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
   duration: 2000,
  });
 }

 getRentedListForAllFranchise() {
  if (this.loginData.userRole != 1) {
   this.sendObj.franchiseId = this.loginData.franchiseId
  } else {
   this.sendObj.franchiseId = 0
  }
  this.AdminService.onGetRentListOfAllFranchise(this.sendObj).subscribe(res => {
   console.log(res)
   if (res.statusCode == 200) {
    this.tableList = res.result;
    this.bkUpTableList = res.result;
    this.openSnackBar(res.message, 'Success')
   } else {
    this.openSnackBar(res.message, 'Error')
   }
  }, err => {
   console.log(err)
   this.openSnackBar('Sever encountered with some error, please try after some time.', 'Error')
  })
 }

 filterForeCasts(filterVal: any) {
  this.formServiceData.listTotal = []
  if (filterVal == "0") {
   this.tableList = this.bkUpTableList;
  }
  // this.forecasts = this.cacheForecasts;
  else {
   console.log(filterVal)
   this.tableList = this.bkUpTableList.filter(x => x.franchiseName == filterVal);
  }
 }

  getTotal(index1 : number, data, franchise_name : string, type : string){

    let tempIndex = this.formServiceData.listTotal.findIndex(it =>it.franchise == index1)
    let newData = data
    if(tempIndex == -1){
      var QtyStock = 0, rentedQty = 0, totalQty = 0
      for(var i = 0; i < newData.length; i++){
        if(newData[i].quantityStock != null && newData[i].quantityStock != '' && newData[i].quantityStock != undefined){
          QtyStock = QtyStock + newData[i].quantityStock
        }
        if(newData[i].rentedQuantityStock != null && newData[i].rentedQuantityStock != '' && newData[i].rentedQuantityStock != undefined){
          rentedQty = rentedQty + newData[i].rentedQuantityStock
        }
        if(newData[i].totalQuantity != null && newData[i].totalQuantity != '' && newData[i].totalQuantity != undefined){
          totalQty = totalQty + newData[i].totalQuantity
        }
      }

      this.formServiceData.listTotal.push({
        franchise:index1,
        QtyStock : QtyStock,
        rentedQty : rentedQty,
        totalQty : totalQty,
        franchiseName : franchise_name
      })
      tempIndex = this.formServiceData.listTotal.findIndex(it =>it.franchise == index1)
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
      case 'QtyStock':
        sendData = this.formServiceData.listTotal[index].QtyStock
        break;
      case 'rentedQty':
        sendData = this.formServiceData.listTotal[index].rentedQty
        break;
      case 'totalQty':
        sendData = this.formServiceData.listTotal[index].totalQty
        break;
      default:
        sendData = 0;
    }
    return sendData;
  }

  getPieChartsOption(){
    var pieData = []
    for(var i = 0; i < this.formServiceData.listTotal.length; i++){
      let obj = {
        name : this.formServiceData.listTotal[i].franchiseName,
        value : this.formServiceData.listTotal[i].totalQty
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