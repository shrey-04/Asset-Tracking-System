import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { LoginRequest } from '../interfaces/login-request';
import { UserMaster } from '../interfaces/user-master';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {
  private url:string = "http://localhost:8088";
  // private url:string = `http://${environment.BesuIp}`;

  constructor(private httpClient: HttpClient) { }

   authenticateUser(data:any):Observable<UserMaster>
  {
   return this.httpClient.post<UserMaster>(`${this.url}/auth/login`,data).pipe(catchError(err=>this.handleError(err,'Incorrect Credentials')));
  }

  getCurrentUser(token:string){
    return this.httpClient.get(`${this.url}/user/me`, {headers:{Authorization: `Bearer ${token}`}})
  }
  getData(){
    return this.httpClient.get(`http://localhost:3001/data`);
  }


  handleError(error:any, msg:string) {
    return throwError(() => {
        Swal.fire({
          icon: 'error',
          text: msg,
        })
    });
  }
  
}
