import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminService } from '../../../shared/admin/admin.service';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.scss']
})
export class AddInventoryComponent implements OnInit {

    public user = {
        name: undefined,
        father_name: undefined,
        address: undefined,
        email: undefined,
		    mob_no: undefined
	  };

    model: any = {};
    Form : FormGroup
  constructor(private websiteService:AdminService, private fb:FormBuilder) { 
    this.Form = fb.group({
      'first_name' : [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z\s]*$')])],
      'last_name' : [null, Validators.compose([Validators.pattern('^[a-zA-Z\s]*$')])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])],
      'address' : [null, Validators.compose([Validators.required])],
      'country' : [0, Validators.compose([Validators.required])],
      'state' : [0, Validators.compose([Validators.required])],
      'city' : [0],
      'zip': [null, Validators.compose([Validators.required, Validators.minLength(1),Validators.maxLength(6)])]
    })

  }

  ngOnInit() {
  	// alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model))
  }

  public onSubmit() {
  	
  }

    // public onSubmit() {
    //   let sendData = {
    //       name : this.user!.name || 'Unknown',
    //       father_name : this.user!.father_name || 'Unknown',
    //       address : this.user!.address || 'N/A',
    //       email : this.user!.email || 'N/A',
    //       mob_no : this.user!.mob_no || '',
    //   }
    //   // console.log(sendData)
    //   this.websiteService.onUsersForm(sendData).subscribe(data=>{
    //     // console.log("KKKKKKKK" + data.message);
    //     if(data.error == false){
    //       this.toastr.success(data.message, '')
    //       let NewDate = new Date();
    //       let sendData2 = {
    //           name : this.user!.name || 'Unknown',
    //           father_name : this.user!.father_name || 'Unknown',
    //           address : this.user!.address || 'N/A',
    //           email : this.user!.email || 'N/A',
    //           mob_no : this.user!.mob_no || '',
    //           createdAt : NewDate.toJSON(),
    //           updatedAt : NewDate.toJSON(),
    //           _id : data.body._id
    //       }
    //       this.websiteService.changeMessage(sendData2);
    //       this.formReset();
    //     }else{
    //       console.log(data.message)
    //       this.toastr.error(data.message, 'Error')
    //     }
    //   },err=>{
    //     console.log(err)
    //     this.toastr.error('Something went wrong, please try after some time', 'Error');
    //   })
    // }

    // formReset(){
    //   this.user = {
    //       name: undefined,
    //       father_name: undefined,
    //       address: undefined,
    //       email: undefined,
    //       mob_no: undefined
    //   };
    // }

}
