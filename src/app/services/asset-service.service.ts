import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { Asset } from '../interfaces/asset';
import { AssetTrackingDetails } from '../interfaces/asset-tracking-details';
import { TrackingDetails } from '../interfaces/tracking-details';

@Injectable({
  providedIn: 'root'
})
export class AssetServiceService {
  urlAddAsset :string;
  urlGetAssets :string;  //get all assets
  urlGetAsset :string;   // get single asset by assetId
  urlGetTrackingDetails :string;

   // modify state url
  urlPrepareForDispatch: string;
  urlIntialMove:string;
  urlAckFinalReceiver:string;
  urlPkgOutForDelivery:string;
  urlMakeFinalDelivery:string;
 //transaction-tracking-details

  urlTransactionTrackingDetails:string;

  private url:string = "http://localhost:8088";
  // private url:string = `http://${environment.BesuIp}`;

  //assetId:number;
  private headers: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
  });

  httpParams:any;

  constructor(private httpClient:HttpClient) {
    this.urlAddAsset="http://localhost:8088/merchant/generate/asset";
    this.urlGetAssets="http://localhost:8088/merchant/retrieve/all-assets";
    this.urlGetAsset="http://localhost:8088/customer/retrieve/asset/";
    this.urlGetTrackingDetails="http://localhost:8088/customer/retrieve/tracking/";
    // this.urlAddAsset=`http://${environment.BesuIp}/merchant/generate/asset`;
    // this.urlGetAssets=`http://${environment.BesuIp}/merchant/retrieve/all-assets`;
    // this.urlGetAsset=`http://${environment.BesuIp}/customer/retrieve/asset/`;
    // this.urlGetTrackingDetails=`http://${environment.BesuIp}/customer/retrieve/tracking/`;

  // modify state url

    this.urlPrepareForDispatch="http://localhost:8088/merchant/prepare-for-dispatch/";
    this.urlIntialMove="http://localhost:8088/merchant/initial-move/";
    this.urlAckFinalReceiver="http://localhost:8088/merchant/ack-received/";
    this.urlPkgOutForDelivery="http://localhost:8088/merchant/out-for-delivery/";
    this.urlMakeFinalDelivery="http://localhost:8088/merchant/mark-delivered/"
    // this.urlPrepareForDispatch=`http://${environment.BesuIp}/merchant/prepare-for-dispatch/`;
    // this.urlIntialMove=`http://${environment.BesuIp}/merchant/initial-move/`;
    // this.urlAckFinalReceiver=`http://${environment.BesuIp}/merchant/ack-received/`;
    // this.urlPkgOutForDelivery=`http://${environment.BesuIp}/merchant/out-for-delivery/`;
    // this.urlMakeFinalDelivery=`http://${environment.BesuIp}/merchant/mark-delivered/`

    //transaction-tracking-details

    this.urlTransactionTrackingDetails="http://localhost:8088/customer/retrieve/transactions/"
    // this.urlTransactionTrackingDetails=`http://${environment.BesuIp}/customer/retrieve/transactions/`

  }
//  add  asset function
  addAsset(asset: Asset)
  {
    // console.log("in add asset"+asset);
   // return this.httpClient.post<Asset>(this.urlAddAsset,asset);

    return this.httpClient.post(this.urlAddAsset,asset,{headers:this.getAccessToken()}).pipe(catchError(this.handleError));
     // this.assetId = data;
  }
//get all asset details
  getAllShipmentDetails()
  {
    // console.log("In getAllShipmentDetails ");
    return this.httpClient.get<Array<Asset>>(this.urlGetAssets,{headers:this.getAccessToken()});
  }
//get asset by using id
  getAssetById(assetId:string)
  {

    return this.httpClient.get<Asset>(this.urlGetAsset+assetId,{headers:this.getAccessToken()});
  }
  getTrackingDetails(assetId:string)
  {
    // console.log("called.........."+assetId);
    return this.httpClient.get<Array<TrackingDetails>>(this.urlGetTrackingDetails+assetId,{headers:this.getAccessToken()});
  }

   // modify state functions
   fnPrepareForDispatch(assetId:string)
   {
    // console.log("in fnPrepareForDispatch.........."+assetId);
    return this.httpClient.get<string>(this.urlPrepareForDispatch+assetId,{headers:this.getAccessToken()}).pipe(catchError(this.handleError));
   }

   fnIntialMove(assetId:string)
   {
    // console.log("in fnPrepareForDispatch.........."+assetId);
    return this.httpClient.get<string>(this.urlIntialMove+assetId,{headers:this.getAccessToken()}).pipe(catchError(this.handleError));

   }
   fnAckFinalReceiver(assetId:string)
   {
    // console.log("in fnAckFinalReceiver.........."+assetId);
    // console.log(this.headers);
    return this.httpClient.get<string>(this.urlAckFinalReceiver+assetId,{headers:this.getAccessToken()}).pipe(catchError(this.handleError));

   }
   fnPkgOutForDelivery(assetId:string)
   {
    // console.log("in fnPkgOutForDelivery.........."+assetId);
    return this.httpClient.get<string>(this.urlPkgOutForDelivery+assetId,{headers:this.getAccessToken()}).pipe(catchError(this.handleError));

   }
   fnMakeFinalDelivery(assetId:string)
   {
    // console.log("in fnMakeFinalDelivery.........."+assetId);
    return this.httpClient.get<string>(this.urlMakeFinalDelivery+assetId,{headers:this.getAccessToken()});

   }
   //get alltransaction tracking details

   fnGetTransactionTrackingDetails(assetId:string)
   {
    // console.log("in fnGetTransactionTrackingDetails.........."+assetId);

    return this.httpClient.get<Array<AssetTrackingDetails>>(this.urlTransactionTrackingDetails+assetId,{headers:this.getAccessToken()});
   }

 
   getAllTradeRequests(pendingRequest:boolean){    
    return this.httpClient.get(`${this.url}/merchant/trade-requests/${pendingRequest}`, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
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
