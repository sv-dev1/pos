import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';  
import { AdminService } from '../shared/admin/admin.service';
// import {TranslateService} from '@ngx-translate/core';
declare var $;
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  frenchid;
  results;
  loginData;
  tableData;
  superAdmin : boolean = false;
  
  franchise_name : any = null;
  // enlarged : boolean = true;
  constructor(private route: ActivatedRoute,public router: Router,private AdminService: AdminService,
    public translate: TranslateService
    ) {

      translate.addLangs(['en', 'sp']);
      translate.setDefaultLang('sp');
      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|sp/) ? browserLang : 'en');

  	if(localStorage['loginUserData']){
        let encrypData = localStorage['loginUserData']
        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
        this.loginData = JSON.parse(userData);
        this.franchise_name = this.loginData.franchiseName
  	}
    if(localStorage['superAdminChange'] && localStorage['superAdminChange'] == 'true'){
      this.superAdmin = true;
    }

    // translate.use('sp')
  }

  ngOnInit() {
    this.translate.setDefaultLang('sp');
    this.translate.use('sp');
    $(".content111").mCustomScrollbar();
    this.AdminService.franchiseAddedOrUpdate.subscribe((data) => {
      this.addEditFranchiseViaDiffComp(data);
    });

    this.AdminService.franchiseNameUpdate.subscribe(message=>{this.franchise_name = message})
    this.getfrenchisedata();

    	$(document).ready(function(){
    		$(".button-menu-mobile").click(function(){
          $(".forced").toggleClass("enlarged");
          $(".footer-section").toggleClass("enlarged");
    		});
    	});

      $(document).ready(function(){
        $('#sidebar-menu ul li a').click(function(){
          $('#sidebar-menu li a').removeClass("active");
          $(this).addClass("active");
        });
      });

     $(document).ready(function() {
      
        var viewportWidth = $(window).width();
        //alert(viewportWidth);
        if (viewportWidth < 600) {
            $(".forced").addClass("enlarged");
            $(".footer-section").addClass("enlarged");
        }

      });

    $(window).on('load, resize', function mobileViewUpdate() {
        var viewportWidth = $(window).width();
        
        if (viewportWidth < 600) {
            $(".forced").addClass("enlarged");
            $(".footer-section").addClass("enlarged");
        }
    });

    // $(document).ready(function() {
    //   AOS.init();
    // });

$(document).ready(function(){
  $('.lang-top ul li').click(function(){
    $('.lang-top li').removeClass("active");
    $(this).addClass("active");
});
});


  }





  addEditFranchiseViaDiffComp(data){
    if(data && data.update && data.update == 1){
     for(var i = 0; i < this.results.length; i++){
       if(this.results[i].franchiseId == data.franchiseId){
         this.results[i] = data
       }
     }
    }else if(data && data.delete && data.delete == 1){
        console.log(data)
        let tempArray = this.results.filter(id => id.franchiseId != data.franchiseId)
        this.results = tempArray
    }else{
      this.results.push(data)
    }
  }

  onLogout(){
    localStorage.removeItem('isLoggedin');
  	localStorage.removeItem('loginUserData');
  	this.router.navigate(['/login']);
    if(localStorage['superAdminChange']){
      localStorage.removeItem('superAdminChange');
    }
  }

  getfrenchisedata(){
    if(this.loginData.userRole == 1 ){
    this.frenchid = 0;
    }else{
      this.frenchid = this.loginData.franchiseId;
    }
    this.AdminService.GetFrenchiesDetail(this.frenchid).subscribe(data =>{
      this.results = data.result;
      // console.log(this.results);
    },error =>{
      console.log("error");
    })
  }

  loginUserData(){
      let encrypData = localStorage['loginUserData']
      let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
      // this.loginData = JSON.parse(userData);
      return JSON.parse(userData);
  }

  changeDashboard(franchiseData){
    console.log(franchiseData)
    this.franchise_name = franchiseData.franchiseName
    this.loginData = this.loginUserData();
    this.loginData.userRole = 2
    this.loginData.franchiseId = franchiseData.franchiseId
    this.loginData.franchiseName = franchiseData.franchiseName
    let userData = JSON.stringify(this.loginData);
    let encrypData = CryptoJS.AES.encrypt(userData, 'pos_masRetail').toString()
    localStorage.setItem('loginUserData', encrypData);
    localStorage.setItem('superAdminChange', 'true');
    this.superAdmin = true
    this.AdminService.changeMessage(franchiseData.franchiseId)
    this.router.navigate(['/admin/dashboard']);
  }

  backToSuperAdminDashboard(){
    this.franchise_name = null
    this.loginData = this.loginUserData();
    this.loginData.userRole = 1
    this.loginData.franchiseId = 0
    this.loginData.franchiseName = null
    let userData = JSON.stringify(this.loginData);
    let encrypData = CryptoJS.AES.encrypt(userData, 'pos_masRetail').toString()
    localStorage.setItem('loginUserData', encrypData);
    localStorage.removeItem('superAdminChange');
    this.superAdmin = false
    this.AdminService.changeMessage(0)
    this.getfrenchisedata();
    this.router.navigate(['/admin/dashboard']);
  }

  gotToChashierBoard(){
    this.loginData.userRole = 3
    let userData = JSON.stringify(this.loginData);
    let encrypData = CryptoJS.AES.encrypt(userData, 'pos_masRetail').toString()
    localStorage.setItem('loginUserData', encrypData);
    localStorage.removeItem('isLoggedin');
    localStorage.setItem('isCashierLoggedin', 'true');
    if(localStorage['superAdminChange'] && localStorage['superAdminChange'] == 'true'){

    }else{
      localStorage.setItem('superAdminChange', 'false');
    }
    this.router.navigate(['/cashierMangement']);
  }
}
