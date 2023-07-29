import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { RoleMaster } from '../interfaces/role-master';
import { UserMaster } from '../interfaces/user-master';
// import * as _ from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class UserMasterService {

  private headers: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
  });

  constructor(private httpClient: HttpClient) { }



  private url:string = "http://localhost:8088";
  // private url:string = `http://${environment.BesuIp}`;

  addAdmin(data: any){
    
    return this.httpClient.post(`${this.url}/signup/admin`, data, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }
  
  getUsersByRole(role:string){
    return this.httpClient.get(`${this.url}/users-by-role?role=${role}`,{ headers:this.getAccessToken()});
  }
  
  updateUserRole(data:any){    
    return this.httpClient.post(`${this.url}/user/update-role`, data, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }

  deleteUser(emailId:string){    
    return this.httpClient.post(`${this.url}/user/delete/${emailId}`, null, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }
  registerUser(data: any){
    return this.httpClient.post(`${this.url}/signup/user`, data).pipe(catchError(this.handleError));
  }



  private getAccessToken(): HttpHeaders{
     return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access-token')}`,
    });
  }

  handleError(error:any) {
    let errorMessage = error.error.message;
    return throwError(() => {
        Swal.fire({
          icon: 'error',
          text: errorMessage,
        })
        return errorMessage;
    });
  }

  //  getDropDownText(id:any, object:any){
  //   const selObj = _.filter(object, function (o) {
  //       return (_.includes(id,o.id));
  //   });
  //   return selObj;
  // }

  // getAllRoles() {
  //   // console.log("in get all role master");
  //   return this.httpClient.get<Array<RoleMaster>>(this.urlGetAllRoles, {
  //     headers: this.headers,
  //   });
  // }
  // getAllUsers(selectedValue: number) {
  //   //  console.log("in get all users master");
  //   return this.httpClient.get<Array<UserMaster>>(
  //     this.urlGetAllUsers + selectedValue,
  //     { headers: this.headers }
  //   );
  // }
  // getSingleUser(userId: number) {
  //   // console.log("in get user"+this.urlGetSingleUser+userId);

  //   return this.httpClient.get<UserMaster>(this.urlGetSingleUser + userId, {
  //     headers: this.headers,
  //   });
  // }

  // addUser(userMaster: UserMaster) {
  //   // console.log("in add user master"+userMaster);
  //   userMaster.userPassword = 'p';
  //   userMaster.userCreatedBy = parseInt(localStorage.getItem('userId') || '{}');
  //   userMaster.userCreatedOn = this.myDate;
  //   //return this.httpClient.post(this.urlAddUser,userMaster,{responseType: 'text'}).subscribe(data => {
  //   return this.httpClient
  //     .post(this.urlAddUser, userMaster, { headers: this.headers })
  //     .subscribe((data) => {
  //       // console.log("data"+data);
  //       // console.log(data);
  //       // this.assetId = data;
  //     });
  // }

  // modifyUser(userMaster: UserMaster) {
  //   userMaster.userModifiedBy = parseInt(
  //     localStorage.getItem('userId') || '{}'
  //   );
  //   userMaster.userModifiedOn = this.myDate;
  //   return this.httpClient
  //     .post(this.urlModifyUser, userMaster, { headers: this.headers })
  //     .subscribe((data) => {
  //       // console.log("data"+data);
  //       // console.log(data);
  //       // this.assetId = data;
  //     });
  // }

  // approveUser(userId: number) {
  //   //  console.log("in approve role"+this.urlApproveUser+userId);
  //   return this.httpClient
  //     .put<any>(this.urlApproveUser + userId, userId, { headers: this.headers })
  //     .subscribe((data) => (this.userIdNumber = data.id));
  // }

  // approveUserNew(userMaster: UserMaster) {
  //   userMaster.userVerifiedBy = parseInt(
  //     localStorage.getItem('userId') || '{}'
  //   );
  //   userMaster.userVerifiedOn = this.myDate;
  //   return this.httpClient
  //     .put<any>(this.urlApproveUser, userMaster, { headers: this.headers })
  //     .subscribe((data) => (this.userIdNumber = data.id));
  // }

  // rejectUserNew(userMaster: UserMaster) {
  //   userMaster.userVerifiedBy = parseInt(
  //     localStorage.getItem('userId') || '{}'
  //   );
  //   userMaster.userVerifiedOn = this.myDate;
  //   return this.httpClient
  //     .put<any>(this.urlRejectUser, userMaster, { headers: this.headers })
  //     .subscribe((data) => (this.userIdNumber = data.id));
  // }

  // rejectUser(userId: number) {
  //   //  console.log("in reject role"+this.urlRejectUser+userId);
  //   return this.httpClient
  //     .put<any>(this.urlRejectUser + userId, userId, { headers: this.headers })
  //     .subscribe((data) => (this.userIdNumber = data.id));
  // }
}
