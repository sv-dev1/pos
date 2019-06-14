import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AdminService } from '../../../shared/admin/admin.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

export interface PeriodicElement {
    UserName: string;
    FirstName: string;
    LastName: number;
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-franchise-user',
  templateUrl: './franchise-user.component.html',
  styleUrls: ['./franchise-user.component.scss']
})
export class FranchiseUserComponent implements OnInit {
    displayedColumns: string[] = ['username', 'firstname', 'lastname', 'role', 'action'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    franchiseData : any;
    tableData : any;
    user : any;
	userForm : FormGroup;

      foods = [
        {value: 'steak-0', viewValue: 'Steak'},
        {value: 'pizza-1', viewValue: 'Pizza'},
        {value: 'tacos-2', viewValue: 'Tacos'}
      ];
      roles
    constructor(private AdminService: AdminService, public dialog: MatDialog,
		private formbulider: FormBuilder, private route: ActivatedRoute,public router: Router) { 
        
        this.franchiseData = {}
	    this.route.paramMap.subscribe(params => {
	      this.franchiseData.id = parseInt(params.get("id"))
	      this.franchiseData.name = params.get("franchise_name")
	    })

        this.user = {};
        // this.userForm = this.formbulider.group({
        //     Name: [null, [Validators.required]],
        //     Password: [null],
        //     firstname: [null, [Validators.required]],
        //     lastname: [null],
        //     role:[null,[Validators.required]]
        // });
    }

	ngOnInit() {
        this.onFranchiseUserRoles();
		this.getUsers(this.franchiseData.id);
        // this.getFranchise();
        this.addForm();
	}

    addForm(){
        this.userForm = this.formbulider.group({
            Name: [null, [Validators.required]],
            Password: [null, [Validators.required]],
            firstname: [null, [Validators.required]],
            lastname: [null],
            role:[null,[Validators.required]]
        });
    }

    editForm(){
        this.userForm = this.formbulider.group({
            Name: [null, [Validators.required]],
            Password: [null],
            firstname: [null, [Validators.required]],
            lastname: [null],
            role:[null,[Validators.required]]
        });
    }

    onFranchiseUserRoles(){
        this.AdminService.GetFranchiseUserRoles().subscribe(data => {
            // console.log(data);
            if(data.statusCode == 200){
                 this.roles = data.result
            }else{

            }
        }, err => {
            alert("Error, please try after some time!")
            console.log(err)
        })
    }

    
	applyFilter(filterValue: string) {
	    this.dataSource.filter = filterValue.trim().toLowerCase();
	    if (this.dataSource.paginator) {
	      this.dataSource.paginator.firstPage();
	    }
	}

    getUsers(id) {
        // debugger;
        this.AdminService.GetUserDetails(id).subscribe(data => {
            console.log(data);
            if(data.statusCode == 200){
                this.tableData = data.result
                ELEMENT_DATA = this.tableData
                this.dataSource = new MatTableDataSource(ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }else{
                // alert()
            }
        }, err => {
            console.log(err)
            // this.toastr.error('Something went wrong, please try after some time', 'Error');
        })
    }

    getRole(id){
        console.log(id)
        for(var i=0; i<= this.roles.length; i++){
            if(this.roles[i].roleId == id){
                return this.roles[i].roleName
            }
        }
    }

    onSubmit(formValue){
    	console.log(formValue)
        if (this.userForm.invalid) {
            alert('Kindly fill the entire form');
            return;
        // }else if(!this.user.userid && (formValue.Password == null || formValue.Password == '')){
        // 	alert("Please fill user password")
        }else {
            // debugger;
            if(formValue.Password != null && formValue.Password != ''){
                this.user.Password = formValue.Password;
            }
            this.user.FranchiseId = this.franchiseData.id;
            this.user.UserName = formValue.Name;
            this.user.FirstName = formValue.firstname;
            this.user.LastName = formValue.lastname;
            this.user.UserRole = formValue.role;
            this.AdminService.AddUser(this.user).subscribe(data=>{
            	console.log(data)
            	if(data.statusCode == 200){
            		if(this.user.userid){
            			this.updateTableList(data.result);
            		}else{        			
			            this.tableData.push(data.result)
			            ELEMENT_DATA = this.tableData
			            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
			            this.dataSource.paginator = this.paginator;
			            this.dataSource.sort = this.sort;
			            this.onCancel();
            		}
            	}else{
            		alert(data.message)
            	}
            },err=>{

            });
        }
    }


	updateTableList(data){
		let tempArray = []
		for(var i = 0; i < this.tableData.length ; i++){
			if(this.tableData[i].userId == data.userId){
				this.tableData[i] = data
		        ELEMENT_DATA = this.tableData
		        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
		        this.dataSource.paginator = this.paginator;
		        this.dataSource.sort = this.sort;
			}
		}
		// let index = this.tableData.indexOf(data=>{
		// 	if(data.franchiseId == id){
		// 		return;
		// 	}
		// })
		// console.log(id)
	}

    onCancel(){
    	this.userForm.reset();
    	this.user = {}
        this.addForm();
    }

  openEdit(data){
  	console.log(data)
    this.editForm();
  	this.user.userid = data.userId
  	this.userForm.controls['firstname'].setValue(data.firstName)
  	this.userForm.controls['lastname'].setValue(data.lastName)
    this.userForm.controls['Name'].setValue(data.userName)
  	this.userForm.controls['role'].setValue(data.userRole)
  }

    openDelete(id): void {
      console.log("................",id)
        let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            width: '470px',
        });
        dialogRef.afterClosed().subscribe(result => {
         if (result) {
           // this.onDelete(id)
           console.log(id, result)

            this.AdminService.onDeleteFranchiseUser(id).subscribe(res=>{
            	if(res){
		           	this.tableData = this.tableData.filter(data => data.userId != id)
			        ELEMENT_DATA = this.tableData
			        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
			        this.dataSource.paginator = this.paginator;
			        this.dataSource.sort = this.sort;
            	}else{
            		alert("server encountered with some error!")
            	}
            },err=>{
              alert("server encountered with some error!")
            });

         }
        });
    }

}
