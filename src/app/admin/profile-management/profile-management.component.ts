import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../shared/admin/admin.service';
import * as CryptoJS from 'crypto-js';   

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss']
})
export class ProfileManagementComponent implements OnInit {

  displayedColumns: string[] = ['username', 'firstname', 'lastname', 'role', 'action'];
 // dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  formServiceData : any;
  franchiseData : any;
  tableData : any;
  user : any;
  userForm : FormGroup;
  userId:any;

  loginData : any;
  loginProfileData:any;
  frenchiseid;

  constructor(private AdminService: AdminService, public dialog: MatDialog,private _snackBar: MatSnackBar,
		private formbulider: FormBuilder, private route: ActivatedRoute,public router: Router) { 

      this.formServiceData = {}
      this.userForm = this.formbulider.group({
        userId:[0],
        userName: [null, [Validators.required]],
        password: [null, [Validators.required]],
        firstName: [null, [Validators.required]],
        lastName: [null],
        userRole:[0]
       
        });

        if(localStorage['loginUserData']){
          let encrypData = localStorage['loginUserData']
          let userData = CryptoJS.AES.decrypt(encrypData, 'pos_masRetail').toString(CryptoJS.enc.Utf8);
          debugger;
            this.loginData = JSON.parse(userData);
            this.userId = this.loginData.userId;
            console.log(this.loginData);
            console.log();
            if (this.loginData.userRole == 1) {
                this.frenchiseid = 0;
                console.log(this.frenchiseid)
              } else {
  
                this.frenchiseid = this.loginData.franchiseId;
               // console.log(this.frenchiseid);
            }
           
      }	
    }

  ngOnInit() 
  {
       // debugger;
        this.getProfileData();
        
  }

  getProfileData()
  {

   // debugger;
    this.AdminService.GetUserRecord(this.userId).subscribe(data => {
     
        if (data.statusCode == 200) {
          // debugger;
            this.userForm.controls['userId'].setValue(data.result[0].userId)
            this.userForm.controls['userName'].setValue(data.result[0].userName)
            this.userForm.controls['password'].setValue(data.result[0].password)
            this.userForm.controls['firstName'].setValue(data.result[0].firstName)
            this.userForm.controls['lastName'].setValue(data.result[0].lastName)
            this.userForm.controls['userRole'].setValue(data.result[0].userRole)

        } else {
            console.log(data.message)
        }
    }, err => {
        console.log(err)
    })

  }

  onSubmit(formValue)
  {
    
    if(formValue.userId == 0 || formValue.userId == null)
    {
      delete formValue.userId
    }


    if (this.userForm.invalid) {
        alert('Kindly fill the entire form');
        return;
    // }else if(!this.user.userid && (formValue.Password == null || formValue.Password == '')){
    // 	alert("Please fill user password")
    }else {
        // debugger;
       
        this.AdminService.EditUserProfile(formValue).subscribe(data=>{
          console.log(data)
          if(data.statusCode == 200){
           
            this.openSnackBar(data.message,'Success');
          }else{
            alert(data.message)
                this.openSnackBar(data.message,'Error')
          }
        },err=>{
            this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
        });
    }

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onCancel(){
     //this.userForm.reset();
     this.getProfileData();
  }



}
