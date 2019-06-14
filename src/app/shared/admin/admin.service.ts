import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/Rx';
import {environment} from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';

import { branch } from '../common_class/branch';
import { user } from '../common_class/user';


   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    httpOptions.headers.append('Access-Control-Allow-Headers', 'Content-Type');
    httpOptions.headers.append('Access-Control-Allow-Methods', 'GET');
    httpOptions.headers.append('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  // public messageSource = new BehaviorSubject({_id : undefined});
  // currentMessage = this.messageSource.asObservable();
  url = environment.apiUrl
  constructor(private http: HttpClient) { }

    // changeMessage(message) {
    //     this.messageSource.next(message)
    // }

    insertBranch(branch: branch): Observable<any>{
        let api = this.url + "addFranchiseDetails";
        console.log(api);
        return this.http.post(api, branch, httpOptions)
        .map(response =>{
            return response;
        }).catch(error =>{
            return error;
        })
    }

    getFranchiseDetails(): Observable<any>{
        let api = this.url + "AllBranchDetails";
        console.log(api);
        return this.http.get(api, httpOptions)
        .map(response =>{
            return response;
        }).catch(error =>{
            return error;
        })
    }

    // uploadFranchiseLogo(body : FormData): Observable<any>{
    //     console.log(body)
    //     let api = environment.apiUrl+"uploadImage";
    //     console.log(api);
    //     return this.http.post(api, body)
    //     .map(response =>{
    //         return response;
    //     }).catch(error =>{
    //         return error;
    //     })
    // }

    onDeleteFranchise(id): Observable<any>{
        let api = this.url + "DeleteFranchise?franchiseId="+id;
        console.log(api);
        return this.http.delete(api, httpOptions)
        .map(response =>{
            return response;
        }).catch(error =>{
            return error;
        })
    }


    onLogin(body): Observable<any>{
        let api = this.url + "LoginUser";
        console.log(api);
        return this.http.post(api, body, httpOptions)
        .map(response =>{
            console.log(response)
            return response;
        }).catch(error =>{
            console.log(error)
            alert(error.text)
            return error;
        })
    }
    
    GetUserDetails(id): Observable<any> {
        // debugger;
        let api = environment.apiUrl + "GetUserDetails?FranchiseId="+id;
        console.log(api);
        return this.http.get(api, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }

    AddUser(user: user): Observable<any> {
        // debugger;
        let api = environment.apiUrl + "AddEditUserDetail";
        console.log(api);
        return this.http.post(api, user, httpOptions)
            .map(response => {
                return response;
            }).catch(error => {
                return error;
            })
    }

    onDeleteFranchiseUser(id): Observable<any>{
        let api = this.url + "DeleteUser?userid="+id;
        console.log(api);
        return this.http.delete(api,httpOptions)
        .map(response =>{
            return response;
        }).catch(error =>{
            return error;
        })
    }

    GetFranchiseUserRoles(): Observable<any>{
        let api = this.url + "GetUserRoles";
        console.log(api);
        return this.http.get(api,httpOptions)
        .map(response =>{
            return response;
        }).catch(error =>{
            return error;
        })
    }
 
}
