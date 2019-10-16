import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AdminService } from '../../../shared/admin/admin.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../../Alerts/delete-confirmation/delete-confirmation.component';
import { FormGroup, FormControl,FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
declare var AOS;
import {TranslateService} from '@ngx-translate/core';

export interface PeriodicElement {
  franchiseName: string;
  franchiseAddress: string;
  franchisePhone;
  franchiseCode: string;
  createdDate : string;
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-list-franchise',
  templateUrl: './list-franchise.component.html',
  styleUrls: ['./list-franchise.component.scss']
})
export class ListFranchiseComponent implements OnInit {

	displayedColumns: string[] = ['franchiseName', 'franchiseAddress', 'franchisePhone', 'franchiseCode', 'createdDate', 'image', 'action'];
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
  length=100;
  pageSize=10;
  pageSizeOptions=[5, 10, 25, 100]; 
  itemImage: any;
	constructor(private translate:TranslateService,private AdminService: AdminService, public dialog: MatDialog,private _snackBar: MatSnackBar,
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
      this.translate.setDefaultLang('sp');
      AOS.init();
	    this.dataSource.paginator = this.paginator;
	    this.dataSource.sort = this.sort;
	    this.getFranchise();
    }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
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
        this.tableData = data.result
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
                this.openSnackBar(res.message,'Success')
                let temp = {
                   delete : 1,
                   franchiseId : id
                }
                this.AdminService.franchiseAddedOrUpdate.next(temp); 
            	}else{
            		this.openSnackBar(res.message,'Error')
            	}
            },err=>{
              this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
            });

         }
        });
    }

    

    onCancel(){
      this.itemImage = null
    	this.franchiseForm.reset();
      this.branch = {}
      this.franchiseForm.controls['uploadFile'].setValue(null)
    }

	onSubmit(formValue) {
	   if(this.franchiseForm.valid){
      if (this.franchiseForm.invalid == true && !this.branch.franchiseId) {
	      alert('Kindly fill the entire form');
	      return;
	    // }else if(!this.branch.franchiseId && formValue.uploadFile == null){
     //    alert('Please upload the franchise logo');
      }else {
	    
	      this.branch.franchiseName = formValue.Name;
	      this.branch.contactPerson = formValue.address;
	      this.branch.franchisePhone = formValue.phonenumber;
	      this.branch.franchiseCode = formValue.code;
        
        console.log(this.branch)
	      this.AdminService.insertBranch(this.branch).subscribe(res=>{
	         
            if(res.statusCode == 200){
              console.log(res.result);
              console.log(this.branch);
  			      if(this.branch.franchiseId){
                  res.result.update = 1
  			        	this.updateTableList(res.result)
                  this.openSnackBar(res.message,'')
  			      }else{	
  		            this.tableData.push(res.result)
  				        ELEMENT_DATA = this.tableData
  				        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  				        this.dataSource.paginator = this.paginator;
  				        this.dataSource.sort = this.sort;
                  this.openSnackBar(res.message,'Success')
  			      }
              this.AdminService.franchiseAddedOrUpdate.next(res.result);       	
            }else{
              this.openSnackBar(res.message,'Success')
            }
	          this.onCancel();
	      },err=>{
	          this.openSnackBar('Sever encountered with some error, please try after some time.','Error')
	      });
	    }
     }else{
        this.validateAllFormFields(this.franchiseForm);
     }
	}


    validateAllFormFields(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        }
      });
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
    this.branch.ImageLogo = null
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
        this.franchiseForm.controls['uploadFile'].setValue(null)
        return;
    }
    const fr = new FileReader();
    fr.onloadend = (loadEvent) => {
      let mainImage = fr.result;
      this.branch.ImageLogo = mainImage;
      this.itemImage = mainImage;
    };
    fr.readAsDataURL(file);
    // this.onuploadFiles(evt,type)
  }

  openEdit(data){
    
    console.log(data)
    this.itemImage = data.imageLogo
  	this.branch.franchiseId = data.franchiseId
  	this.franchiseForm.controls['Name'].setValue(data.franchiseName)
  	this.franchiseForm.controls['address'].setValue(data.contactPerson)
  	this.franchiseForm.controls['code'].setValue(data.franchiseCode)
    this.franchiseForm.controls['phonenumber'].setValue(data.franchisePhone)
    window.scroll(0,0);
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