import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AdminService } from '../../../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {
  
    loginData  :any
    formServiceData : any
    currencyForm : any
	data: boolean = true;
	frenchiseid: number;
	results: any;
    constructor(private AdminService: AdminService, private _snackBar: MatSnackBar,
		private formbulider: FormBuilder, private route: ActivatedRoute,public router: Router) { 

    	this.formServiceData = {}
	    
	    if(localStorage['loginUserData']){
	        let encrypData = localStorage['loginUserData']
	        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
	        this.loginData = JSON.parse(userData);
			console.log(this.loginData)
			if(this.loginData.userRole == 1){
				this.frenchiseid = 1;
			}else{
				this.frenchiseid = this.loginData.franchiseId;
			}
		}
		
		this.currencyForm = this.formbulider.group({
		    FranchiseId : this.frenchiseid,
		    currencySymbol: [null, [Validators.required]],
		    currencySymbolFormat: [null, [Validators.required]],
		});
		

    }
	
	ngOnInit() {
		this.data = true;
		this._getFranchise();
	    this.AdminService.settingEditFranchise.subscribe((data) => {
	      this.updateFranchiseListData(data);
	    });
	}

	openSnackBar(message: string, action: string) {
	    this._snackBar.open(message, action, {
	      duration: 2000,
	    });
	}

  _getFranchise(){
      this.AdminService.getFranchiseDetails1(this.frenchiseid).subscribe(data=>{
		  console.log(data);
      	if(data.statusCode == 200){
			  this.formServiceData.franchiseList = data.result[0]
			  this.results = data.result[0];
			  this.currencyForm.controls['currencySymbol'].setValue(this.formServiceData.franchiseList.franchiseCurrencySymbol)
			  this.currencyForm.controls['currencySymbolFormat'].setValue(this.formServiceData.franchiseList.franchiseIsocurrencyFormat)
          if(this.loginData.userRole != 1){
            this.currencyForm.controls['FranchiseId'].setValue(this.frenchiseid)
            this.currencyForm.controls['FranchiseId'].disable();
            this._getSingleFranchiseDetail(this.frenchiseid)
          }
      	}else{
      		console.log(data.message)
      	}
      },err=>{
        console.log(err)
      })
  }

    _getSingleFranchiseDetail(franchiseId){
    	this.formServiceData.selectedFranchise = null
        this.AdminService.GetFrenchiesDetail(franchiseId).subscribe(data => {
            console.log(data);
            if(data.statusCode == 200){
                this.formServiceData.selectedFranchise = data.result[0]
                this.currencyForm.controls['currencySymbol'].setValue(this.formServiceData.selectedFranchise.franchiseCurrencySymbol)
               	this.currencyForm.controls['currencySymbolFormat'].setValue(this.formServiceData.selectedFranchise.franchiseIsocurrencyFormat)
                console.log(this.formServiceData.selectedFranchise)
            }
        }, err => {
            console.log(err)
        })
    }

	onCancel(){
		this.currencyForm.controls['currencySymbol'].setValue(this.formServiceData.franchiseList.franchiseCurrencySymbol)
		this.currencyForm.controls['currencySymbolFormat'].setValue(this.formServiceData.franchiseList.franchiseIsocurrencyFormat)
	}

    onSubmit(formValue){
    	let sendData = this.structureTheFields();
    	console.log(sendData)
        this.AdminService.insertBranch(sendData).subscribe(data => {
            console.log(data);
            if(data.statusCode == 200){
            	
            	this.openSnackBar(data.message,'Success')
              this.updateLocalStorage();
            }else{
            	this.openSnackBar(data.message,'Error')
            }
        }, err => {
            console.log(err)
            this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
        })
    }

    updateLocalStorage(){
      this.loginData.currency = this.currencyForm.value.currencySymbol
      let userData = JSON.stringify(this.loginData);
      let encrypData = CryptoJS.AES.encrypt(userData, 'pos_masRetail').toString()
      localStorage.setItem('loginUserData', encrypData);
    }

    structureTheFields(){
    	let data = {
    		FranchiseId : null,
			FranchiseCurrencySymbol : this.currencyForm.value.currencySymbol,
			FranchiseIsocurrencyFormat : this.currencyForm.value.currencySymbolFormat,
    	}
    	if(this.loginData.userRole == 1){
    		data.FranchiseId = 1
    	}else{
    		data.FranchiseId = this.currencyForm.value.FranchiseId
    	}
    	return data
    }

    updateFranchiseListData(data){
    	// console.log(data)
    	for(var i = 0; i < this.formServiceData.franchiseList.length; i++){
    		// console.log(this.formServiceData.franchiseList[i])
    		if(this.formServiceData.franchiseList[i].franchiseId == data.franchiseId){
				this.formServiceData.franchiseList[i] = data
				// console.log("kkkkkkkkkkkkkkkkkkkkkkkk")
    		}
    	}
    }

}
