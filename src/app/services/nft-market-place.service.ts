import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NftMarketPlaceService {

  private url:string = "http://localhost:8088";
  // private url:string = `http://${environment.BesuIp}`;

  constructor(private httpClient: HttpClient) { }

  mintNft(data:any){
    return this.httpClient.post(`${this.url}/market/mint`, data, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }

  buyNft(data:any){
    return this.httpClient.put(`${this.url}/market/buy-token`, data, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }

  fetchMarketItems(){
    return this.httpClient.get(`${this.url}/market/unsold-items`, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }

  fetchCreatedItemsByUSer(){
    return this.httpClient.get(`${this.url}/market/supplier-items`, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }

  fetchUserItems(){
    return this.httpClient.get(`${this.url}/market/user-nft`, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }


  // initiating trade
  initiateTrade(data:any){
    return this.httpClient.post(`${this.url}/customer/initiate-trade`, data, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
  }

  // After creating asset - asset request fulfilled
  approveAssetRequest(uniqueTradeId:any){
    return this.httpClient.get(`${this.url}/merchant/create-trade-asset/${uniqueTradeId}`, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
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
