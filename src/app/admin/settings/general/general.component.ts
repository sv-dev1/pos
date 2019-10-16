import { Component, OnInit } from '@angular/core';
declare var AOS;
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js'; 
declare var $;

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  data:boolean;
  is_edit : boolean = true;
	loginData
    constructor( private _snackBar: MatSnackBar,
      private formbulider: FormBuilder, private route: ActivatedRoute) { 
        if(localStorage['loginUserData']){
	        let encrypData = localStorage['loginUserData']
	        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
	        this.loginData = JSON.parse(userData);
          console.log(this.loginData)
          if(this.loginData.userRole == 2){
            this.data == true;
          }

	    }
    }


  	ngOnInit() {
      AOS.init();
      this.data == true;
      // setTimeout(function() {    
      //    let b =document.getElementsByClassName("mat-tab-header")[0].classList.add("mat-tab-header-pagination-controls-enabled")
      //    let a =document.getElementsByClassName("mat-tab-header")[0].classList
      //    console.log(a)
      // }, 1000);
  	}

}
