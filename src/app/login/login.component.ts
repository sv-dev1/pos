import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  AdminService } from '../shared/admin/admin.service'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   
   loginFormShow = true
   LoginForm : FormGroup
   // SignUpForm : FormGroup
   constructor(private adminService:AdminService,private formBuilder: FormBuilder,
   	private route: ActivatedRoute,public router: Router,
   	private _location: Location, private _snackBar: MatSnackBar,private translate:TranslateService){

      this.LoginForm = formBuilder.group({
        'email': [null, Validators.compose([Validators.required])],
        'password' : [null, Validators.compose([Validators.required])]
      })

      // this.SignUpForm = formBuilder.group({
      //   "name" : [null, Validators.compose([Validators.required])],
      //   'email': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])],
      //   'password' : [null, Validators.compose([Validators.required])]
      // })

      if(localStorage.getItem('isLoggedin')){
      	this.router.navigate(['/admin/dashboard']);
      }
      if(localStorage.getItem('isCashierLoggedin')){
        this.router.navigate(['/cashierMangement']);
      }
   }

  ngOnInit() {
    this.translate.setDefaultLang('sp');
    this.translate.use('sp');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


  onLogin(){
    let sendData = {
        username : this.LoginForm.value.email,
        password : this.LoginForm.value.password,
    }
      this.adminService.onLogin(sendData).subscribe(data=>{
        if(data && data.statusCode && data.statusCode != 10001){
          this.getCurrency(data.result)
        }else{
          this.openSnackBar(data.message, 'Oops!');
        }
      },err=>{
        console.log(err)
        this.openSnackBar('Something went wrong, please try after some time', 'Error');
      })
  }

  getCurrency(data){
      this.adminService.getProductDatacurrency(data.franchiseId).subscribe(res=>{
          if(res.statusCode == 200){
              if(res.result.length > 0){
                let responseData = data
                responseData.currency = res.result[0].franchiseCurrencySymbol;
                let userData = JSON.stringify(responseData);
                let encrypData = CryptoJS.AES.encrypt(userData, 'pos_masRetail').toString()
                localStorage.setItem('loginUserData', encrypData);
                this.openSnackBar('Login Successful', 'OK');
                if(data.userRole == 1 || data.userRole == 2){
                  localStorage.setItem('isLoggedin', 'true');
                  this.router.navigate(['/admin/dashboard']);
                }
                else {
                  this.router.navigate(['/cashierMangement']);
                  localStorage.setItem('isCashierLoggedin', 'true');
                }              
              }else{
                this.openSnackBar("Currency not found!", 'Error');
              }
          }else{
          }
      },err=>{
      });
  }

}
