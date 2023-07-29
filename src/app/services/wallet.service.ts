import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private url:string = "http://localhost:8088";
  // private url:string = `http://${environment.BesuIp}`;

  constructor(private httpClient: HttpClient) { }

  getFunds(){
    return this.httpClient.get(`${this.url}/profile/funds`, {headers:this.getAccessToken()});
  }

  getWalletKeys(){
    return this.httpClient.get(`${this.url}/wallet/get-keys`, {headers:this.getAccessToken()});
  }

  requestFunds(amount:number){
    return this.httpClient.put(`${this.url}/profile/request-funds/${amount}`, {}, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }

  approveFundRequest(response:boolean, uniqueId:string){
    return this.httpClient.get(`${this.url}/profile/sanction-funds/${uniqueId}/${response}`, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }

  getAllPendingFundRequests(){
    return this.httpClient.get(`${this.url}/profile/list-pending-funds`, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
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
