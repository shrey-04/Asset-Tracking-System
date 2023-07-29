import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { RoleMaster } from '../interfaces/role-master';

@Injectable({
  providedIn: 'root',
})
export class RoleMasterService {
  // urlAddRole: string;
  // urlGetAllRoles: string;
  // urlGetSingleRole: string;
  // urlModifyRole: string;
  // urlApproveRole: string;
  // urlRejectRole: string;
  // roleIdNumber: number;
  // myDate = new Date();
  private headers: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
  });
  constructor(private httpClient: HttpClient) {
  }

  private url:string = "http://localhost:8088";
  // private url:string = `http://${environment.BesuIp}`;

  // updateRole(data:any){    
  //   return this.httpClient.post(`${this.url}/role/update`, data, {headers:this.getAccessToken()});
  // }

  addRole(data:any){    
    return this.httpClient.post(`${this.url}/role/add/${data}`, null, {headers:this.getAccessToken(), responseType: 'text' as 'json'}).pipe(catchError(this.handleError));
  }

  getRoles(){
    return this.httpClient.get(`${this.url}/role/get-all-roles`, {headers:this.getAccessToken()});
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
 
}
