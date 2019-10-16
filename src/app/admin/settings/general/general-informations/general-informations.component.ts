import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AdminService } from '../../../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js';   //https://www.npmjs.com/package/crypto-js

@Component({
  selector: 'app-general-informations',
  templateUrl: './general-informations.component.html',
  styleUrls: ['./general-informations.component.scss']
})
export class GeneralInformationsComponent implements OnInit {

    loginData : any;
    formServiceData : any;
    infoForm : FormGroup;
	frenchiseid: number;
	results: any;
    constructor(private AdminService: AdminService, private _snackBar: MatSnackBar,
		private formbulider: FormBuilder, private route: ActivatedRoute,public router: Router) { 

    	this.formServiceData = {}
	    this.infoForm = this.formbulider.group({
		    FranchiseId : [null],
			FranchiseName : [null, [Validators.required]],
			FranchiseAddress : [null, [Validators.required]],
			FranchiseAddress2 : [null, [Validators.required]],
			FranchiseCode : [null, [Validators.required]],
			FranchisePhone : [null, [Validators.required]],
			FranchiseEmail : [null, [Validators.required]],
			FranchisePobox : [null ,[Validators.required]],
			FranchiseAdditionalDetails : [null, [Validators.required]],
			FranchiseCity : [null, [Validators.required]],
	    });

	    if(localStorage['loginUserData']){
	        let encrypData = localStorage['loginUserData']
	        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
	        this.loginData = JSON.parse(userData);
			// console.log(this.loginData)
			if(this.loginData.userRole == 1){
				this.frenchiseid = 1;
			}else{
				this.frenchiseid = this.loginData.franchiseId;
			}
	    }
    }

	ngOnInit() {
		// console.log(this.frenchiseid)
		this._getSingleFranchiseDetail();
		this._getFranchise();
	}

	openSnackBar(message: string, action: string) {
	    this._snackBar.open(message, action, {
	      duration: 2000,
	    });
	}

  _getFranchise(){
      this.AdminService.getFranchiseDetails1(this.frenchiseid).subscribe(data=>{
      	if(data.statusCode == 200){
			  this.formServiceData.franchiseList = data.result
			  console.log(this.formServiceData.frechiseList);
          if(this.loginData.userRole != 1){
            this.infoForm.controls['FranchiseId'].setValue(this.frenchiseid)
            // this.infoForm.controls['FranchiseId'].disable();
            this._getSingleFranchiseDetail()
          }
      	}else{
      		// console.log(data.message)
      	}
      },err=>{
        // console.log(err)
      })
  }

    _getSingleFranchiseDetail(){
    	this.formServiceData.selectedFranchise = null
        this.AdminService.GetFrenchiesDetail(this.frenchiseid).subscribe(data => {
            if(data.statusCode == 200){
				//console.log(data.result);
				this.results = data.result;
				for(let i=0;i<this.results.length;i++){
					this.formServiceData.selectedFranchise = data.result;
					this.infoForm.controls['FranchiseName'].setValue(this.results[i].franchiseName)
					this.infoForm.controls['FranchiseAddress'].setValue(this.results[i].franchiseAddress)
					this.infoForm.controls['FranchiseAddress2'].setValue(this.results[i].contactPerson)
					this.infoForm.controls['FranchiseCode'].setValue(this.results[i].franchiseCode)
					this.infoForm.controls['FranchisePhone'].setValue(this.results[i].franchisePhone)
					this.infoForm.controls['FranchiseEmail'].setValue(this.results[i].franchiseEmail)
					this.infoForm.controls['FranchisePobox'].setValue(this.results[i].franchisePobox)
					this.infoForm.controls['FranchiseAdditionalDetails'].setValue(this.results[i].franchiseAdditionalDetails)
					this.infoForm.controls['FranchiseCity'].setValue(this.results[i].franchiseCity)
				}
               
                // console.log(this.formServiceData.selectedFranchise)
            }
        }, err => {
            // console.log(err)
        })
    }

    onCancel(){
    	
			for(let i=0;i<this.results.length;i++){
				// this.formServiceData.selectedFranchise = data.result;
				this.infoForm.controls['FranchiseName'].setValue(this.results[i].franchiseName)
				this.infoForm.controls['FranchiseAddress'].setValue(this.results[i].franchiseAddress)
				this.infoForm.controls['FranchiseAddress2'].setValue(this.results[i].contactPerson)
				this.infoForm.controls['FranchiseCode'].setValue(this.results[i].franchiseCode)
				this.infoForm.controls['FranchisePhone'].setValue(this.results[i].franchisePhone)
				this.infoForm.controls['FranchiseEmail'].setValue(this.results[i].franchiseEmail)
				this.infoForm.controls['FranchisePobox'].setValue(this.results[i].franchisePobox)
				this.infoForm.controls['FranchiseAdditionalDetails'].setValue(this.results[i].franchiseAdditionalDetails)
				this.infoForm.controls['FranchiseCity'].setValue(this.results[i].franchiseCity)
			
        }
    }

    onSubmit(formValue){
    	let sendData = this.structureTheFields();
    	// console.log(sendData)
        this.AdminService.insertBranch(sendData).subscribe(data => {
            // console.log(data);
            if(data.statusCode == 200){
            	// if(this.loginData.userRole == 1){
            	// 	this.onCancel();
            	// }
            	this.openSnackBar(data.message,'Success')
            	this.updateFranchiseListData(data.result);
            	this.AdminService.settingEditFranchise.next(data.result);
            	data.result.update = 1;
            	this.AdminService.franchiseAddedOrUpdate.next(data.result);
                this.updateLoginUserData();
                if(this.loginData.userRole != 1){
                    this.AdminService.franchiseNameUpdate.next(this.infoForm.value.FranchiseName)
                }
            }else{
            	this.openSnackBar(data.message,'Error');
            }
        }, err => {
            // console.log(err)
            this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
        })
    }

    updateLoginUserData(){
        let encrypData = localStorage['loginUserData']
        let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
        this.loginData = JSON.parse(userData);
        this.loginData.franchiseName = this.infoForm.value.FranchiseName
        userData = JSON.stringify(this.loginData);
        encrypData = CryptoJS.AES.encrypt(userData, 'pos_masRetail').toString()
        localStorage.setItem('loginUserData', encrypData);
    }

    structureTheFields(){
    	let data = {
    		FranchiseId : this.frenchiseid,
			FranchiseName : this.infoForm.value.FranchiseName,
			FranchiseAddress : this.infoForm.value.FranchiseAddress,
			contactPerson : this.infoForm.value.FranchiseAddress2,
			FranchiseCode : this.infoForm.value.FranchiseCode,
			FranchisePhone : this.infoForm.value.FranchisePhone,
			FranchiseEmail : this.infoForm.value.FranchiseEmail,
			FranchisePobox : this.infoForm.value.FranchisePobox,
			FranchiseAdditionalDetails : this.infoForm.value.FranchiseAdditionalDetails,
			FranchiseCity : this.infoForm.value.FranchiseCity,
    	}
    	if(this.loginData.userRole == 1){
    		data.FranchiseId = 1;
    	}else{
    		data.FranchiseId = this.frenchiseid
    	}
    	return data
    }

    updateFranchiseListData(data){
    	 console.log(data)
    	for(var i = 0; i < this.formServiceData.franchiseList.length; i++){
    		// console.log(this.formServiceData.franchiseList[i])
    		if(this.formServiceData.franchiseList[i].franchiseId == data.franchiseId){
				this.formServiceData.franchiseList[i] = data
				// console.log("kkkkkkkkkkkkkkkkkkkkkkkk")
    		}
    	}
    }
}
