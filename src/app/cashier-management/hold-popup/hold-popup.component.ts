import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-hold-popup',
  templateUrl: './hold-popup.component.html',
  styleUrls: ['./hold-popup.component.scss']
})
export class HoldPopupComponent implements OnInit {
    
    on_hold_form : FormGroup
    constructor(public dialogRef: MatDialogRef<HoldPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog, private formbulider: FormBuilder) {

        this.on_hold_form = this.formbulider.group({
            orderName : [null, [Validators.required]],
        });
    }

	ngOnInit() {
	}

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        // if(this.on_hold_form.valid){
        console.log(this.on_hold_form.value.orderName)
        var sendData
        if (this.on_hold_form.value.orderName == null) {
            sendData = {
                orderName: ''
            }
        } else {
            sendData = {
                orderName: this.on_hold_form.value.orderName
            }
        }
        this.dialogRef.close(sendData);
        // }

    }
}
