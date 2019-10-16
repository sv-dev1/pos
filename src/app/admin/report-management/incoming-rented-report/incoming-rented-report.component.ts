import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js

@Component({
  selector: 'app-incoming-rented-report',
  templateUrl: './incoming-rented-report.component.html',
  styleUrls: ['./incoming-rented-report.component.scss']
})
export class IncomingRentedReportComponent implements OnInit {
  dashboardData: any;
  loginData: any;
  backupdata:any;
  frenchiseid;
  tableresult: any;
  constructor(private route: ActivatedRoute,public router: Router,private AdminService: AdminService) {
    this.dashboardData = {}

    if(localStorage['loginUserData']){
      let encrypData = localStorage['loginUserData']
      let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
      this.loginData = JSON.parse(userData);
      console.log(this.loginData)

      if(this.loginData.userRole == 1){
        this.frenchiseid = 0;
      }
      else{
        this.frenchiseid = this.loginData.franchiseId;
      }
      // console.log(this.loginData)
    }
  }

  ngOnInit() {
    console.log(this.frenchiseid);
    this.getDashboardRentedData();
  }

   filterForeCasts(filterVal: any) {
    if (filterVal == "0") {
     this.tableresult = this.backupdata;
    }
    // this.forecasts = this.cacheForecasts;
    else {
     console.log(filterVal)
     this.tableresult = this.backupdata.filter(x => x.franchiseName == filterVal);
    }
  }

  getDashboardRentedData(){
    this.AdminService.onDashBoardRentedDatareportbrief(this.frenchiseid).subscribe(data=>{
      if(data.statusCode == 200){
        if(this.loginData.userRole == 1){
          this.tableresult = data.result;
          this.backupdata = data.result;
        }else
        {
          let temp  = [];
          temp.push(data.result)
          this.tableresult = temp;

        }
          console.log(data);
      }else{
      }
    },err=>{
        console.log(err)
    })
  }

}
