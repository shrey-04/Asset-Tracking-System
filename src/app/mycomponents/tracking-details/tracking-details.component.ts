import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Asset } from 'src/app/interfaces/asset';
import { AssetTrackingDetails } from 'src/app/interfaces/asset-tracking-details';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import {environment} from "../../../environments/environment";
declare var L : any;

@Component({
  selector: 'app-tracking-details',
  templateUrl: './tracking-details.component.html',
  styleUrls: ['./tracking-details.component.css'],
})
export class TrackingDetailsComponent implements OnInit {

  AssetList:Array<Object> = [];

  getAssetTrackingDetails?: Subscription;
  // assetTrackingDetails:AssetTrackingDetails;
  assetTrackingDetailsList: Array<AssetTrackingDetails>;
  singleAssetData: AssetTrackingDetails;
  assetId: string = '';
  message: string;
  qrTrackingDetails!: string;
  // qrCodeData !: {
  //   assetId:any,
  //   txHash: any[]
  // }
  private map:any;
  assetDetails!: Asset;

  awsBesuIp: string = `${environment.awsBesuIp}/tx/`;


  constructor(
    private assetServiceService: AssetServiceService,
    private _Activatedroute: ActivatedRoute,
    private _router: Router
  ) {
    this.assetTrackingDetailsList = [];
    this.singleAssetData = {} as AssetTrackingDetails;
    this.message = 'Loading Data, Please wait...';
  }

  origin = { lat: 19.07609, lng: 72.877426 };
  destination = { lat: 18.516726, lng: 73.856255 };
  greyColor: string = 'rgb(165, 161, 161)';
  greenColor: string = 'rgb(12, 170, 12)';
  emptyBarColor: string =
    'linear-gradient(to right, rgb(165, 161, 161) 0%, rgb(165, 161, 161) 100%)';
  completeBarColor: string =
    'linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 100%)';

  icons: string[] = [
    'fas fa-clipboard',
    'fas fa-warehouse',
    'fas fa-check-circle',
  ];
  iconColor: string[] = [this.greyColor, this.greyColor, this.greyColor];
  barColor: string[] = [this.emptyBarColor, this.emptyBarColor];

  ngOnInit(): void {
    console.log('in TrackingDetailsComponent');
    this.getAssetTrackingDetails = this._Activatedroute.paramMap.subscribe(
      (params) => {
        // console.log('params are' + params);
        // this.assetString = params.get('assetId');

        this.assetId = this._Activatedroute.snapshot.params['assetId'];
        // console.log('this.assetId' + this.assetId);
      }
    );

    // this.assetServiceService.getAssetById(this.assetId).subscribe(
    //   responseData=>{
    //     this.assetDetails=responseData;
    //     console.log("responseData"+responseData);
    //     this.openMap();
    //   }
    // );

    this.getAssetTrackingDetails = this.assetServiceService
      .fnGetTransactionTrackingDetails(this.assetId)
      .subscribe(
        (responseData: any) => {
          this.setQRCodeData(responseData);
          // console.log('-------qrdetails---------', this.qrTrackingDetails);

          this.assetTrackingDetailsList = responseData.transactions;
          this.singleAssetData = this.assetTrackingDetailsList[0];
          // console.log('responseData single asset' + responseData);
          this.message = 'Retrieve Transaction tracking details succesfully';

          this.iconColor = [this.greyColor, this.greyColor, this.greyColor];
          this.barColor = [this.emptyBarColor, this.emptyBarColor];
          const index = this.assetTrackingDetailsList.length;
          // console.log('assettrackingdetails ' + index);

          if (index >= 1) {
            this.iconColor[0] = this.greenColor;
            if (index == 2) {
              this.barColor[0] = 'linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 50%, rgb(165, 161, 161) 50%, rgb(165, 161, 161) 100%)';
                // 'linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 30%, rgb(165, 161, 161) 30%, rgb(165, 161, 161) 100%)';
            }
            if (index >= 3) {
              this.barColor[0] = this.completeBarColor;
              this.iconColor[1] = this.greenColor;
              // this.barColor[0] =
              //   'linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 60%, rgb(165, 161, 161) 60%, rgb(165, 161, 161) 100%)';
            }
            if (index >= 4) {
              this.barColor[1] = 'linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 30%, rgb(165, 161, 161) 30%, rgb(165, 161, 161) 100%)';
              // this.iconColor[1] = this.greenColor;
            }
            if (index >= 5) {
              // this.barColor[1] =
              //   'linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 50%, rgb(165, 161, 161) 50%, rgb(165, 161, 161) 100%)';
              this.barColor[1] =
                'linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 60%, rgb(165, 161, 161) 60%, rgb(165, 161, 161) 100%)';
            }
            if (index == 6) {
              this.barColor[1] = this.completeBarColor;
              this.iconColor[2] = this.greenColor;
            }
          }
          //  ------------- store invoice and receivedDate -------------------
          if (index == 6) {
            if(localStorage.getItem("assetList")){
              this.AssetList = JSON.parse(localStorage.getItem("assetList") || '[]');

              let asset:any = this.AssetList.find((val:any) => val.assetId == this.assetId);

              if(asset && !asset.invoice){
                let index = this.AssetList.indexOf(asset);
                asset.invoice = this.randomSequence('ABCDEFGHIJKLMNOPQRSTUVWXYZ',6) + '-' + this.randomSequence('0123456789',9);
                asset.receivedDate = this.assetTrackingDetailsList[5].transactionTime;

                this.AssetList[index] = asset;
              }
              localStorage.setItem('assetList', JSON.stringify(this.AssetList));
            }
          }
          //  ------------- store invoice and receivedDate -------------------



        },
        (error: string) => {
          this.message = error;
        }
      );
  }

  randomSequence(chracters:string, length:number) {
    // var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += chracters.charAt(Math.floor(Math.random() * chracters.length));
    }
    return result;
}


  setQRCodeData(data:any){
    let qrCodeData: {
      assetId: string,
      txHash:any[]
    } = {
      assetId: '',
      txHash:[]
    };
    qrCodeData.assetId = data.assetId;
    data.transactions.forEach((element:any) => {
      qrCodeData.txHash.push(element.transactionHash);
    });
    this.qrTrackingDetails = JSON.stringify(qrCodeData, null, '\t');

  }

  // openMap(content: any) {
  //   this.modalService.open(content,
  //  {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>
  //      {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult =
  //        `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // openMap(){
  //   L.mapquest.key = 'nknGMQC55mzAxEKmeUoM9uv6vx9CAAPT';

  //   this.map = L.mapquest.map('map', {
  //     center: [20.5937, 78.9629],
  //     layers: L.mapquest.tileLayer('map'),
  //     zoom: 7
  //   });

  //   this.map.addControl(L.mapquest.control());


  //   L.mapquest.directions().route({
  //     start: this.assetDetails.sourceAddress,
  //     end: this.assetDetails.destinationAddress
  //   });
  // }

}
