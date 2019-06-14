import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  AdminService } from '../shared/admin/admin.service'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   
   form_title = "Login Here"
   loginFormShow = true
   LoginForm : FormGroup
   SignUpForm : FormGroup
   constructor(private adminService:AdminService,private formBuilder: FormBuilder,
   	private route: ActivatedRoute,public router: Router, private toastr: ToastrService,
   	private _location: Location, private _snackBar: MatSnackBar){

      this.LoginForm = formBuilder.group({
        'email': [null, Validators.compose([Validators.required])],
        'password' : [null, Validators.compose([Validators.required])]
      })

      this.SignUpForm = formBuilder.group({
        "name" : [null, Validators.compose([Validators.required])],
        'email': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])],
        'password' : [null, Validators.compose([Validators.required])]
      })

      if(localStorage.getItem('isLoggedin')){
      	this.router.navigate(['/admin/dashboard']);
      }
   }

  ngOnInit() {
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
          console.log(data)
          let userData = JSON.stringify(data.result);
          let encrypData = CryptoJS.AES.encrypt(userData, 'mayank').toString()
          localStorage.setItem('loginUserData', encrypData);
          localStorage.setItem('isLoggedin', 'true');
          this.router.navigate(['/admin/dashboard']);
          this.openSnackBar('Login Successful', 'OK');
        }else{
          this.openSnackBar(data.message, 'Oops!');
        }
      },err=>{
        console.log(err)
        this.openSnackBar('Something went wrong, please try after some time', 'Error');
      })
  }

  // switchForm(){
  //     this.SignUpForm.reset();
  //     this.LoginForm.reset();
  //   if(this.loginFormShow == true){
  //     this.form_title = "Sign Up Here"
  //     this.loginFormShow = false
  //   }else{
  //     this.form_title = "Login Here"
  //     this.loginFormShow = true
  //   }
  // }

  // onSignUp(){
  //   let sendData = {
  //       name : this.SignUpForm.value.name,
  //       email : this.SignUpForm.value.email,
  //       password : this.SignUpForm.value.password,
  //   }
  //   this.adminService.onSignUp(sendData).subscribe(data=>{
  //     // console.log("KKKKKKKK" + data.message);
  //     if(data.error == false){
  //       this.toastr.success(data.message, '')
  //       this.switchForm();
  //     }else{
  //       console.log(data.message)
  //       this.toastr.error(data.message, 'Error')
  //     }
  //   },err=>{
  //     console.log(err)
  //     this.toastr.error('Something went wrong, please try after some time', 'Error');
  //   })
  // }

}
