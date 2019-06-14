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
  branchName: string;
  branchAddress: string;
  phone: number;
  branchCode: string;
  date : string;
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-list-franchise',
  templateUrl: './list-franchise.component.html',
  styleUrls: ['./list-franchise.component.scss']
})
export class ListFranchiseComponent implements OnInit {

	displayedColumns: string[] = ['branchName', 'branchAddress', 'phone', 'branchCode', 'date', 'image', 'action'];
	dataSource = new MatTableDataSource(ELEMENT_DATA);
	  // @ViewChild(MatPaginator) paginator: MatPaginator;
	  // @ViewChild(MatSort) sort: MatSort;
	  
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	formList : any;
	tableData = []
  franchiseForm: FormGroup;
  sendImage : any;
  branch : any
	constructor(private AdminService: AdminService, public dialog: MatDialog,
		private formbulider: FormBuilder, private route: ActivatedRoute,public router: Router) { 
        
      this.branch = {}
	    this.franchiseForm = this.formbulider.group({
		    Name: [null, [Validators.required]],
		    address: [null, [Validators.required]],
		    code: [null, [Validators.required]],
		    phonenumber: [null, [Validators.required]],
		    uploadFile : [null]
	    });
	}

    ngOnInit() {
	    this.dataSource.paginator = this.paginator;
	    this.dataSource.sort = this.sort;
	    this.getFranchise();
    }

	applyFilter(filterValue: string) {
	    this.dataSource.filter = filterValue.trim().toLowerCase();
	    if (this.dataSource.paginator) {
	      this.dataSource.paginator.firstPage();
	    }
	}

    getFranchise() {
      this.AdminService.getFranchiseDetails().subscribe(data=>{
        console.log(data);
        this.tableData = data
        ELEMENT_DATA = this.tableData
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },err=>{
        console.log(err)
        // this.toastr.error('Something went wrong, please try after some time', 'Error');
      })
    }

    openDelete(id): void {
      console.log("................")
        let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            width: '470px',
        });
        dialogRef.afterClosed().subscribe(result => {
         if (result) {
           // this.onDelete(id)
           console.log(id, result)

            this.AdminService.onDeleteFranchise(id).subscribe(res=>{
            	if(res){
		           	this.tableData = this.tableData.filter(data => data.franchiseId != id)
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

    // openEdit(data): void{
    //     let dialogRef = this.dialog.open(EditFormDialog, {
    //         width: '500px',
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //      	if (result) {

    //      	}
    //     });
    // }

    onCancel(){
    	this.franchiseForm.reset();
    	this.branch = {}
    }

	onSubmit(formValue) {
	    if (this.franchiseForm.invalid == true && !this.branch.franchiseId) {
	      alert('Kindly fill the entire form');
	      return;
	    // }else if(!this.branch.franchiseId && formValue.uploadFile == null){
     //    alert('Please upload the franchise logo');
      }else {
	    	console.log(formValue)
	      this.branch.franchiseName = formValue.Name;
	      this.branch.franchiseAddress = formValue.address;
	      this.branch.franchisePhone = formValue.phonenumber;
	      this.branch.franchiseCode = formValue.code;
	      	// this.AdminService.uploadFranchiseLogo(this.sendImage).subscribe(res => {
	       //    if(res){
	       //      console.log(res)
	            // this.branch.ImageLogo = res

	            this.AdminService.insertBranch(this.branch).subscribe(res=>{
	                console.log(res)
			        if(this.branch.franchiseId){
			        	this.updateTableList(res)
			        }else{		        	
		                this.tableData.push(res)
				        ELEMENT_DATA = this.tableData
				        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
				        this.dataSource.paginator = this.paginator;
				        this.dataSource.sort = this.sort;
			        }
	                this.onCancel();
	            },err=>{
	              alert("server encountered with some error!")
	            });
	       //    }else{
	       //      alert("Server encountered with some error!")
	       //    }
	       //  },err=>{
	       //    alert("server encountered with some error!")
	      	// });
	    }
	}

	updateTableList(data){
		let tempArray = []
		for(var i = 0; i < this.tableData.length ; i++){
			if(this.tableData[i].franchiseId == data.franchiseId){
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

  onFileChange(event) {
    // debugger;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const uploadData = new FormData();
      var reader = new FileReader();
      uploadData.append('myFile', file, file.name);
      
      this.sendImage = uploadData
    }
  }

  onUpload(evt:any){
    console.log(evt)
    if (!evt.target) {
        return;
    }
    if (!evt.target.files) {
        return;
    }
    if (evt.target.files.length !== 1) {
        return;
    }
    const file = evt.target.files[0];
    if (file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'image/jpg') {
        alert('You can upload image only!')
        return;
    }
    const fr = new FileReader();
    fr.onloadend = (loadEvent) => {
      let mainImage = fr.result;
      this.branch.ImageLogo = mainImage;
      console.log(this.branch.ImageLogo)
    };
    fr.readAsDataURL(file);
    // this.onuploadFiles(evt,type)
  }

  openEdit(data){
  	console.log(data)
  	this.branch.franchiseId = data.franchiseId
  	this.franchiseForm.controls['Name'].setValue(data.franchiseName)
  	this.franchiseForm.controls['address'].setValue(data.franchiseAddress)
  	this.franchiseForm.controls['code'].setValue(data.franchiseCode)
  	this.franchiseForm.controls['phonenumber'].setValue(data.franchisePhone)
  }

  onSeeFranchiseUsers(franchiseId){
  	console.log(franchiseId)
  	// this.router.navigate(['/admin/'+franchiseId]);
  }

}

@Component({
  selector: 'edit-form-dialog',
  templateUrl: 'edit-franchise.html'
})

export class EditFormDialog {

  constructor( public dialogRef: MatDialogRef<EditFormDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
   private AdminService: AdminService, public dialog: MatDialog) {

       }


     onNoClick(): void {
      this.dialogRef.close();
    }

    public onSubmit() {

      console.log()
      // this.websiteService.updateFormRecord(sendData).subscribe(data=>{
      //   console.log(data);
      //   if(data.error == false){
      //     this.toastr.success(data.message, '')
      //     this.dialogRef.close(sendData);
      //   }else{
      //     console.log(data.message)
      //     this.toastr.error(data.message, 'Error')
      //   }
      // },err=>{
      //   console.log(err)
      //   this.toastr.error('Something went wrong, please try after some time', 'Error');
      // })
    }

}