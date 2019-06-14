import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js
import { AdminService } from '../shared/admin/admin.service';
declare var $;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  
  loginData;
  tableData;
  constructor(private route: ActivatedRoute,public router: Router,private AdminService: AdminService) {
  		// this.router.navigate(['/admin/dashboard']);
	if(localStorage['loginUserData']){
      let encrypData = localStorage['loginUserData']
      let userData = CryptoJS.AES.decrypt(encrypData, 'mayank').toString(CryptoJS.enc.Utf8);
      this.loginData = JSON.parse(userData);
       let userrole = this.loginData.userRole;



	}
  }

  ngOnInit() {

    this.AdminService.getFranchiseDetails().subscribe(data=>{
      this.tableData = data
       console.log(data);
    
     },err=>{
      console.log(err)
      // this.toastr.error('Something went wrong, please try after some time', 'Error');
    });
	$(document).ready(function(){
		$(".button-menu-mobile").click(function(){
			$(".forced").toggleClass("enlarged");
		});
	});
  }

  onLogout(){
  	console.log("oooooooooooooooooooo")
  	localStorage.removeItem('isLoggedin');
  	this.router.navigate(['/login']);
  }

}
