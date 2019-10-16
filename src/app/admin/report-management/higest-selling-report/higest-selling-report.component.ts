import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-higest-selling-report',
  templateUrl: './higest-selling-report.component.html',
  styleUrls: ['./higest-selling-report.component.scss']
})
export class HigestSellingReportComponent implements OnInit {
  loginData: any;
  dashboardData;
  frenchiseid: number;
  backupdata:any;
  formServiceData
  bkUpTableList2:any;
  currency : string = '';
  constructor(private route: ActivatedRoute,public router: Router,private AdminService: AdminService) { 
    this.formServiceData = {}
    this.formServiceData.listTotal = []
    if(localStorage['loginUserData']){
      let encrypData = localStorage['loginUserData']
      let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
      this.loginData = JSON.parse(userData);
      // console.log(this.loginData)
      if(this.loginData.userRole == 1){
        this.frenchiseid = 0;
      }
      else{
        this.frenchiseid = this.loginData.franchiseId;
      }
  }
  }

  ngOnInit() {
    this.currency = this.AdminService.getCurrencyNew();
    this._getStockAlertListing()
  }

  _getStockAlertListing() {
    this.AdminService.getHighestSellingReportList(this.frenchiseid).subscribe(data => {
        this.formServiceData.listTotal = []
        if (data.statusCode == 200) {
          console.log(data.result)
          this.backupdata = data.result;
          this.dashboardData = data.result;
          this.bkUpTableList2 = data.result;
          // console.log(this.dashboardData)
        } else {
        }
    }, err => {
        // console.log(err)
    })
  }

  filterForeCasts(filterVal: any) {
    this.formServiceData.listTotal = []
    if (filterVal == "0") {
      let singleFranchiseData = { data : this.backupdata}
      let temp = Object.assign({}, singleFranchiseData);
      this.dashboardData = temp.data;
    }
    else {
      let tempArr = this.backupdata.filter(x => x.franchiseName == filterVal)
      let singleFranchiseData = { data : tempArr}
      let temp = Object.assign({}, singleFranchiseData);
      this.dashboardData = temp.data;
      this.bkUpTableList2 = this.backupdata.filter(x => x.franchiseName == filterVal);
    }
  }

  filterAccToProduct(filterValue : any){
    console.log(filterValue)
    if(filterValue == '0' || filterValue == 0){
        this.dashboardData = this.bkUpTableList2
    }else{
      // this.dashboardData[0].highestSellingProductViewModellst = this.dashboardData[0].highestSellingProductViewModellst.filter(it => it.itemName == filterValue)
      var agentSearched = this.bkUpTableList2[0].highestSellingProductViewModellst.filter(it => it.itemId == filterValue);
      console.log(agentSearched)
      var temp = {
        franchiseId: this.bkUpTableList2[0].franchiseId,
        franchiseName: this.bkUpTableList2[0].franchiseName ,
        highestSellingProductViewModellst : agentSearched
      }
      console.log(temp)
      this.dashboardData = []
      this.dashboardData.push(temp)
    }
  }

  getTotal(index1 : number, data, franchise_name : string, type : string){
    // console.log(data)
    let tempIndex = this.formServiceData.listTotal.findIndex(it =>it.franchise == index1)
    let newData = data
    if(tempIndex == -1){
      console.log("oooooooooooooooooooooooooooooooooooooooo")
      var quantity = 0, totalPrice = 0
      for(var i = 0; i < newData.length; i++){
        if(newData[i].quantity != null && newData[i].quantity != '' && newData[i].quantity != undefined){
          quantity = quantity + newData[i].quantity
        }
        if(newData[i].totalPrice != null && newData[i].totalPrice != '' && newData[i].totalPrice != undefined){
          totalPrice = totalPrice + newData[i].totalPrice
        }
      }
      this.formServiceData.listTotal.push({
        franchise:index1,
        quantity : quantity,
        totalPrice : totalPrice,
        franchiseName : franchise_name
      })
      tempIndex = this.formServiceData.listTotal.findIndex(it =>it.franchise == index1)
      let returnData = this.getTotal2(tempIndex, type)
      return returnData
    }else{
      // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
      let returnData = this.getTotal2(tempIndex, type)
      return returnData
    }
  }

  getTotal2(index, type){
    var data = 0
    switch(type) {
      case 'quantity':
        data = this.formServiceData.listTotal[index].quantity
        break;
      case 'price':
        data = this.formServiceData.listTotal[index].totalPrice.toFixed(2)
        break;
      default:
        data = 0
    }
    return data;
  }

  getPieChartsOption(){
    var pieData = []
    for(var i = 0; i < this.formServiceData.listTotal.length; i++){
      let obj = {
        name : this.formServiceData.listTotal[i].franchiseName,
        value : this.formServiceData.listTotal[i].totalPrice
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
