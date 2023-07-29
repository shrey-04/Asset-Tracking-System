import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NftService {

  private tokenUrl: string = "http://localhost:8088";
  // private url:string = `http://${environment.BesuIp}`;
  private pinata_postUrl: string = "https://api.pinata.cloud/pinning";
  private pinata_getUrl: string = "https://gateway.pinata.cloud/ipfs";

  private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiYTk4MjhhYy02MDRkLTQ1YmUtOGU1NC0wNGY3NGUwNmQ0MGIiLCJlbWFpbCI6InNocmV5YWJhd2Fza2FyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3MGE3ODM0MzFlNmU1ZTQwMTFmZCIsInNjb3BlZEtleVNlY3JldCI6ImIxNTVmZDM5OTg5NjZiMjM4Y2IxNmRlNDAwY2IwMDJhNGYzYzNmY2RiOGM0NDFhMGM1ODA1NmY2MzdhMGU0OGYiLCJpYXQiOjE2ODA0MjkwNjd9.hQI9U-kx_8HF3v-zCBeTDS14Yg0Dq94BBGe6J5T2NXY";
  private headers: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Access-Control-Allow-Origin': '*' 
  });

  constructor(private httpClient: HttpClient) { }

  getTokenURI(tokenId: number) {
    return this.httpClient.get(`${this.tokenUrl}/market/nft-metadata/${tokenId}`, { headers: this.getAccessToken() });
  }

  getCIDOfFile(data: any) {
    return this.httpClient.post(`${this.pinata_postUrl}/pinFileToIPFS`, data, { headers: this.headers }).pipe(catchError(this.handleError));
  }

  getCIDOfData(data: any) {
    return this.httpClient.post(`${this.pinata_postUrl}/pinJSONToIPFS`, data, { headers: this.headers }).pipe(catchError(this.handleError));
  }

  getDatafromCID(tokenUri:string){
    return this.httpClient.get(`${tokenUri}`);
  }


  private getAccessToken(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access-token')}`,
    });
  }


  handleError(error: any) {
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
