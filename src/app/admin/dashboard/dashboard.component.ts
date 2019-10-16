import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js';
declare var $;
declare var AOS;
import { EChartOption } from 'echarts';
import * as echarts from 'echarts/lib/echarts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  elements: any;
  loginData: any;
  dashboardData: any;
  currencydata: any;
  currency: any;
  frenchiseid: any;
  chartOption: EChartOption
  eTheme = {
    axisFontSize: "16",
    axisLineColor: "rgba(161, 161 ,229, 0.3)",
    axisTextColor: "#a1a1e5",
    firstAreaGradFrom: "rgba(78, 64, 164, 1)",
    firstAreaGradTo: "rgba(78, 64, 164, 1)",
    firstShadowLineDarkBg: "#018dff",
    itemBorderColor: "#ffffff",
    lineStyle: "solid",
    lineWidth: "4",
    secondAreaGradFrom: "rgba(38, 139, 145, 0.8)",
    secondAreaGradTo: "rgba(38, 139, 145, 0.5)",
    secondLineGradFrom: "#00bece",
    secondLineGradTo: "#00da78",
    secondShadowLineDarkBg: "#2c5a85",
    thirdAreaGradFrom: "rgba(118, 73, 208, 0.7)",
    thirdAreaGradTo: "rgba(188, 92, 255, 0.4)",
    thirdLineGradFrom: "#8069ff",
    thirdLineGradTo: "#8357ff",
    thirdShadowLineDarkBg: "#a695ff",
    tooltipBg: "rgba(0, 255, 170, 0.35)",
    tooltipBorderColor: "#00d977",
    tooltipExtraCss: "box-shadow: 0px 2px 46px 0 rgba(0, 255, 170, 0.35); border-radius: 10px; padding: 8px 24px;",
    tooltipFontSize: "20",
    tooltipFontWeight: "normal",
    tooltipLineColor: "rgba(255, 255, 255, 0.1)",
    tooltipLineWidth: "1",
    tooltipTextColor: "#ffffff",
    yAxisSplitLine: "rgba(161, 161 ,229, 0.2)",
  }
  option: any
  echartsIntance: any
  monthlyGraphRadio = 'sales'
  monthlySaleReportRadio = 'sales'
  constructor(private route: ActivatedRoute, public router: Router, private AdminService: AdminService,
    public translate: TranslateService
  ) {
    
    
    this.dashboardData = {}
    this.dashboardData.monthlySaleReport = []
    this.dashboardData.monthlyRentReport = []
    if (localStorage['loginUserData']) {
      let encrypData = localStorage['loginUserData']
      let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
      this.loginData = JSON.parse(userData);
      if (this.loginData.userRole == 1) {
        this.frenchiseid = 0;

      } else {
        this.frenchiseid = this.loginData.franchiseId;
      }
    }

    let sendData
    if (this.loginData.userRole != 1) {
      sendData = {
        franchiseId: this.loginData.franchiseId
      }
    } else {
      sendData = {
        franchiseId: 0
      }
    }
    this.getDashboardRentedData(sendData);
    this.onDashboardCardsData(sendData);
    this.onGetGraphPieChartData(sendData);
    this.onGetGraphPieChartRentData(sendData);
  }

  ngOnInit() {
    AOS.init();

    this.currency = this.AdminService.getCurrencyNew();
    $(".content111").mCustomScrollbar();
    let sendFranchiseId = 0
    if (this.loginData.userRole != 1) {
      sendFranchiseId = this.loginData.franchiseId
    }
    this._getCustomerListing(sendFranchiseId)
    this._getStockAlertListing(sendFranchiseId)
    this.AdminService.messageSource.subscribe(data => {
      if (data != null) {
        this._getCustomerListing(data)
      }
    })

    this.AdminService.messageSource.subscribe(data => {
      if (data != null) {
        this._getStockAlertListing(data)
      }
    })

    this._getHighestSellingProducts(sendFranchiseId);
    this._getMonthlySaleReport(sendFranchiseId);
    this._getMonthlyRentReport(sendFranchiseId);
  }

  moneyConversion(labelValue) {
    return Math.abs(Number(labelValue)) >= 1.0e+9
      ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
      : Math.abs(Number(labelValue)) >= 1.0e+6
        ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
        : Math.abs(Number(labelValue)) >= 1.0e+3
          ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
          : labelValue != 0
            ? (Math.abs(Number(labelValue))).toFixed(2)
            : 0
  }

  ngAfterViewInit() {
    this.chartOption = {
      backgroundColor: '#ffffff',
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Counter 1', 'Counter 2', 'Counter 3', 'Counter 4', 'Counter 5'],
        textStyle: {
          color: "#000",
        },
      },
      series: [
        {
          name: 'Countries',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          data: [
            { value: 335, name: 'Counter 1' },
            { value: 310, name: 'Counter 2' },
            { value: 234, name: 'Counter 3' },
            { value: 135, name: 'Counter 4' },
            { value: 1548, name: 'Counter 5' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            normal: {
              textStyle: {
                color: "#000",
              },
            },
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: "#a1a1e5",
              },
            },
          },
        },
      ],
    };

    this.option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Seasion 1 ',
          data: [250, 310, 350, 380, 320, 330, 370, 450, 460, 480, 490, 500],
          type: 'line',
          smooth: true
        },
        {
          name: 'Seasion 2 ',
          data: [420, 460, 550, 560, 570, 600, 700, 750, 810, 690, 680, 700],
          type: 'line',
          smooth: true
        }
      ]
    };
  }

  _getCustomerListing(franchiseId) {
    this.dashboardData.customerList = []
    this.AdminService.getCustomerListing(franchiseId).subscribe(data => {
      if (data.statusCode == 200) {
        this.dashboardData.customerList = data.result
      } else {
      }
    }, err => {
    })
  }

  _getStockAlertListing(franchiseId) {
    this.getDashboardRentedData({ franchiseId: franchiseId });
    this.onDashboardCardsData({ franchiseId: franchiseId });
    this.onGetGraphPieChartData({ franchiseId: franchiseId });
    this.onGetGraphPieChartRentData({ franchiseId: franchiseId });
    this._getHighestSellingProducts(franchiseId);
    this._getMonthlySaleReport(franchiseId);
    this._getMonthlyRentReport(franchiseId);
    this.dashboardData.itemsstock = []
    this.AdminService.getStockListing(franchiseId).subscribe(data => {
      if (data.statusCode == 200) {
        this.dashboardData.itemsstock = data.result
      } else {
      }
    }, err => {
    })
  }

  ngOnDestroy() {
  }

  getDashboardRentedData(data: any) {
    this.dashboardData.itemRentedList = []
    this.AdminService.onDashBoardRentedData(data.franchiseId).subscribe(data => {
      if (data.statusCode == 200) {
        this.dashboardData.itemRentedList = data.result
      } else {
      }
    }, err => {
    })
  }

  onDashboardCardsData(sendData) {
    this.dashboardData.cards = {}
    this.AdminService.getDashboardCardsData(sendData).subscribe(res => {
      if (res.statusCode == 200) {
        this.dashboardData.cards = res.result
      } else {

      }
    }, err => {
    })
  }


  setMonthlyPieChart(type: string) {
    if (type == 'sales') {
      if (this.dashboardData.pieChart.length >= 0) {
        this.updatePieChart(this.dashboardData.pieChart);
      }
    } else {
      if (this.dashboardData.rentPieChart.length >= 0) {
        this.updatePieChart(this.dashboardData.rentPieChart);
      }
    }
  }



  onGetGraphPieChartData(sendData) {
    this.dashboardData.pieChart = []
    this.AdminService.GetGraphPieChartSalesData(sendData).subscribe(res => {
      if (res.statusCode == 200) {
        this.dashboardData.pieChart = res.result
        if (this.monthlySaleReportRadio == 'sales') {
          this.updatePieChart(this.dashboardData.pieChart);
        }
      } else {

      }
    }, err => {
    })
  }

  onGetGraphPieChartRentData(sendData) {
    this.dashboardData.rentPieChart = []
    this.AdminService.GetGraphPieChartRentData(sendData).subscribe(res => {
      if (res.statusCode == 200) {
        this.dashboardData.rentPieChart = res.result
        if (this.monthlySaleReportRadio != 'sales') {
          this.updatePieChart(this.dashboardData.rentPieChart);
        }
      } else {
        this.updatePieChart(this.dashboardData.rentPieChart);
      }
    }, err => {
    })
  }



  updatePieChart(pieData) {
    var legendData = []
    var seriesData = []
    if (pieData.length > 0) {
      for (var i = 0; i < pieData.length; i++) {
        legendData.push(pieData[i].franchiseName)
        seriesData.push({ value: pieData[i].monthlySales, name: pieData[i].franchiseName })
        if (i == pieData.length - 1) {
          this.updatePieChart2(legendData, seriesData);
        }
        else {

        }
      }
    }
    else {
      this.updatePieChart2(legendData, seriesData);
    }
  }

  updatePieChart2(legendData, seriesData) {
    this.chartOption = {
      backgroundColor: '#ffffff',
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      series: [
        {
          name: 'Sales Report',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            normal: {
              textStyle: {
                color: "#000",
              },
            },
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: "#a1a1e5",
              },
            },
          },
        },
      ],
    };
  }

  _getHighestSellingProducts(franchiseId) {
    this.dashboardData.highestSelling = []
    this.AdminService.GetDashboardHighestSellingProduct(franchiseId)
      .subscribe(res => {
        if (res.statusCode == 200) {
          this.dashboardData.highestSelling = res.result;
        } else {

        }
      }, err => {
      })
  }

  setMonthlyGraph(type) {
    if (type == 'sales') {
      this.updateMonthlySaleGraph1a(this.dashboardData.monthlySaleReport)
    } else {
      if (this.dashboardData.monthlyRentReport.length > 0) {
        this.updateMonthlySaleGraph1a(this.dashboardData.monthlyRentReport)
      }
    }
  }

  _getMonthlySaleReport(franchiseId) {
    this.dashboardData.monthlySaleReport = []
    this.AdminService.GetDashboardMonthlySaleReport(franchiseId)
      .subscribe(res => {
        if (res.statusCode == 200) {
          if (res.result.length > 0) {
            this.dashboardData.monthlySaleReport = res.result
            if (this.monthlyGraphRadio == 'sales') {
              this.updateMonthlySaleGraph1a(this.dashboardData.monthlySaleReport)
            }
          } else {
          }
        } else {
        }
      }, err => {
      })
  }

  _getMonthlyRentReport(franchiseId) {
    this.dashboardData.monthlyRentReport = []
    this.AdminService.GetDashboardMonthlyRentReport(franchiseId)
      .subscribe(res => {
        if (res.statusCode == 200) {
          if (res.result.length > 0) {
            this.dashboardData.monthlyRentReport = res.result
            if (this.monthlyGraphRadio == 'rent') {
              this.updateMonthlySaleGraph1a(this.dashboardData.monthlyRentReport)
            }
          } else {
          }
        } else {
        }
      }, err => {
      })
  }

  async updateMonthlySaleGraph1a(data) {
    let seriesData = []
    let legendArr = []
    for (var i = 0; i < data.length; i++) {
      let franchiseData = await this.updateMonthlySaleGraph1b(data[i]);
      seriesData.push(franchiseData)
      legendArr.push(franchiseData.name)
      if (data.length == seriesData.length) {
        this.updateMonthlySaleGraph2(seriesData, legendArr);
      }
    }
  }



  updateMonthlySaleGraph1b(data) {
    let monthLogArr = []
    for (var j = 0; j < data.data.length; j++) {
      monthLogArr.push(data.data[j].salesdata)
      if (j == data.data.length - 1) {
        let sendObj = {
          name: data.franchiseName,
          data: monthLogArr,
          type: 'line',
          smooth: true
        }
        return sendObj;
      }
    }
  }



  updateMonthlySaleGraph2(seriesData, legendData) {
    this.option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: '3%',
        left: '2%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        type: 'value'
      },
      series: seriesData
    };
  }


  convertToLocalString(data) {
    return data.toLocaleString();
  }

}
