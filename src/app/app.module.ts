import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule,FormGroup, FormBuilder, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './shared/guard/auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ToastrModule } from 'ngx-toastr';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AdminModule } from './admin/admin.module';
import { AdminService } from './shared/admin/admin.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // MainScreenComponent,
    // IgxNavbarComponent,
    // UserFormComponent,
    // MisComponent,
    // FormDataDeleteConfirmation,
    // EditFormDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
	ReactiveFormsModule,
	RouterModule,
	BrowserAnimationsModule,
	ToastrModule.forRoot(),
  MatFormFieldModule,
  MatTableModule,
  MatInputModule,
  MatCardModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSnackBarModule,
  AdminModule
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  AdminService,
    AuthGuard
  ],
  entryComponents:[],
  bootstrap: [AppComponent]
})
export class AppModule { }
