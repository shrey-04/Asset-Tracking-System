import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Asset } from 'src/app/interfaces/asset';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-state',
  templateUrl: './modify-state.component.html',
  styleUrls: ['./modify-state.component.css'],
})
export class ModifyStateComponent implements OnInit {
  isReq!: boolean;
  AssetList: Array<Object> = [];
  @ViewChild('pickUpDate') pickUpDate!: ElementRef;
  @ViewChild('billOfLading') billOfLading!: ElementRef;
  @ViewChild('humidity') humidity!: ElementRef;
  @ViewChild('temperature') temperature!: ElementRef;
  @ViewChild('orderNo') orderNo!: ElementRef;
  @ViewChild('batchNo') batchNo!: ElementRef;
  @ViewChild('barcode') barcode!: ElementRef;
  @ViewChild('warehouseAddress') warehouseAddress!: ElementRef;

  singleAsset: any;

  getSingle_asset?: Subscription;
  singleAssetData: Asset;
  assetResponse: string;

  message: string;
  flag: boolean;
  assetId: string;
  hideShow: string = 'Created';

  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    private assetServiceService: AssetServiceService
  ) {
    // console.log('in constructor');
    this.singleAssetData = {} as Asset;
    this.message = 'Loading Data, Please wait...';
    this.flag = false;
    this.assetId = '';
    this.hideShow;
    this.assetResponse = '';
  }

  ngOnInit(): void {
    // console.log('-----------check------', localStorage.getItem('token'));

    // console.log('Hiiiiii');

    this.getSingle_asset = this._Activatedroute.paramMap.subscribe((params) => {
      // console.log('params are' + params);
      // this.assetString = params.get('assetId');
      this.assetId = this._Activatedroute.snapshot.params['assetId'];
      // console.log('this.assetId' + this.assetId);
    });

    this.AssetList = JSON.parse(localStorage.getItem('assetList') || '[]');
    this.singleAsset = this.AssetList.find(
      (val: any) => val.assetId == this.assetId
    );
    if (!this.singleAsset) {
      this.singleAsset = {};
    }
    if (!this.singleAsset.orderNo && !this.singleAsset.batchNo) {
      this.singleAsset.orderNo = this.randomSequence('1234567890', 15);
      this.singleAsset.batchNo = this.randomSequence(
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
        8
      );
    }
    if (!this.singleAsset.barcode) {
      this.singleAsset.barcode = this.randomSequence('1234567890', 12);
    }

    this.getSingle_asset = this.assetServiceService
      .getAssetById(this.assetId)
      .subscribe(
        (responseData) => {
          this.singleAssetData = responseData;
          // console.log('responseData single asset' + responseData);
          this.hideShow = responseData.assetState;
          this.message = 'Retrieved Single Asstes details';
          // this.flag=true;
          this.assetResponse = responseData.assetState;
        },
        (error: string) => {
          this.message = error;
          this.flag = false;
        }
      );
  }

   //Pick up from Supplier
  prepareForDispatch(assetId: string) {
    // -----------store orderNo and BatchNo -----------
    if (localStorage.getItem('assetList')) {
      this.AssetList = JSON.parse(localStorage.getItem('assetList') || '[]');
    }
    this.AssetList.push({
      assetId: assetId,
      orderNo: this.orderNo.nativeElement.value,
      batchNo: this.batchNo.nativeElement.value,
      warehouseAddress:  this.warehouseAddress.nativeElement.value
    });
    localStorage.setItem('assetList', JSON.stringify(this.AssetList));
    // -----------store orderNo and BatchNo -----------

    // console.log("in Prepare For Dispatch"+assetId);
    this.initialLoader();
    this.getSingle_asset = this.assetServiceService
      .fnPrepareForDispatch(assetId)
      .subscribe(
        (responseData) => {
          this.assetResponse = responseData;
          // console.log('responseData' + responseData);
          this.message = 'Retrieved Single Asstes details';
          this.assetResponse = responseData;
          // console.log('assetResponse' + this.assetResponse);
          this.flag = true;
          this.alertMaker('Shipment picked up from supplier');
        },
        (error: string) => {
          this.message = error;
          this.flag = false;
        }
      );
  }

  //Received at warehouse
  intialMove(assetId: string) {
    // -----------store pickUpDate and billOfLading -----------
    if (localStorage.getItem('assetList')) {
      this.AssetList = JSON.parse(localStorage.getItem('assetList') || '[]');

      let asset: any = this.AssetList.find(
        (val: any) => val.assetId == assetId
      );

      if (asset) {
        let index = this.AssetList.indexOf(asset);
        asset.pickUpDate = this.pickUpDate.nativeElement.value;
        asset.billOfLading = this.billOfLading.nativeElement.value;
        this.AssetList[index] = asset;
      }
      localStorage.setItem('assetList', JSON.stringify(this.AssetList));
    }
    // -----------store pickUpDate and billOfLading -----------

    // console.log("in Initial Move"+assetId);
    this.initialLoader();
    this.getSingle_asset = this.assetServiceService
      .fnIntialMove(assetId)
      .subscribe(
        (responseData) => {
          this.assetResponse = responseData;
          // console.log('responseData' + responseData);

          this.message = 'Retrieved Single Asstes details';
          this.assetResponse = responseData;
          // console.log('assetResponse' + this.assetResponse);
          this.flag = true;
          this.alertMaker('Shipment arrived at warehouse');
        },
        (error: string) => {
          this.message = error;
          this.flag = false;
        }
      );
  }

  //Pick up from warehouse
  acknowledgementFinalReceiver(assetId: string) {
    // -----------store humidity and temperature -----------
    if (this.humidity && this.temperature) {
      if (localStorage.getItem('assetList')) {
        this.AssetList = JSON.parse(localStorage.getItem('assetList') || '[]');

        let asset: any = this.AssetList.find(
          (val: any) => val.assetId == assetId
        );

        if (asset) {
          let index = this.AssetList.indexOf(asset);
          asset.humidity = this.humidity.nativeElement.value;
          asset.temperature = this.temperature.nativeElement.value;

          this.AssetList[index] = asset;
        }
        localStorage.setItem('assetList', JSON.stringify(this.AssetList));
      }
    }

    // -----------store humidity and temperature -----------

    // console.log("in acknowldgement final receiver "+assetId);
    this.initialLoader();
    this.getSingle_asset = this.assetServiceService
      .fnAckFinalReceiver(assetId)
      .subscribe(
        (responseData) => {
          this.assetResponse = responseData;
          // console.log('responseData' + responseData);

          this.message = 'Retrieved Single Asstes details';
          this.assetResponse = responseData;
          // console.log('assetResponse' + this.assetResponse);
          this.flag = true;
          this.alertMaker('Shipment picked up from warehouse');
        },
        (error: string) => {
          this.message = error;
          this.flag = false;
        }
      );
  }

  //Out For Delivery
  packageOutForDelivery(assetId: string) {
    // console.log('in packageOutForDelivery' + assetId);
    this.initialLoader();
    this.getSingle_asset = this.assetServiceService
      .fnPkgOutForDelivery(assetId)
      .subscribe(
        (responseData) => {
          this.assetResponse = responseData;
          // console.log('responseData' + responseData);

          this.message = 'Retrieved Single Asstes details';
          this.assetResponse = responseData;
          // console.log('assetResponse' + this.assetResponse);
          this.flag = true;
          this.alertMaker('Shipment out for delivery');
        },
        (error: string) => {
          this.message = error;
          this.flag = false;
        }
      );
  }

  //Mark Delivered
  makeFinalDelivery(assetId: string) {
    // -----------store barcode -----------
    if (localStorage.getItem('assetList')) {
      this.AssetList = JSON.parse(localStorage.getItem('assetList') || '[]');

      let asset: any = this.AssetList.find(
        (val: any) => val.assetId == assetId
      );

      if (asset) {
        let index = this.AssetList.indexOf(asset);
        asset.barcode = this.barcode.nativeElement.value;

        this.AssetList[index] = asset;
      }
      localStorage.setItem('assetList', JSON.stringify(this.AssetList));
    }
    // -----------store barcode -----------

    // console.log("in make Final Delivery "+assetId);
    this.initialLoader();
    this.getSingle_asset = this.assetServiceService
      .fnMakeFinalDelivery(assetId)
      .subscribe(
        (responseData) => {
          this.assetResponse = responseData;
          // console.log('responseData' + responseData);

          this.message = 'Retrieved Single Asstes details';
          this.assetResponse = responseData;
          // console.log('assetResponse' + this.assetResponse);
          this.flag = true;
          this.alertMaker('Shipment delivered to consignee');
        },
        (error: string) => {
          this.message = error;
          this.flag = false;
        }
      );
  }

  initialLoader(): void {
    Swal.fire({
      title: 'Syncing to blockchain...',
      html: 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  alertMaker(message: string): void {
    Swal.fire({
      text: `${message}.`,
      icon: 'success',
      confirmButtonText: 'Ok',
    }).then(() => {
      this._router.navigate(['shipmentDetails/transactions/' + this.assetId]);
    });
  }

  isRequired(monitoringReq: string) {
    // console.log(monitoringReq);

    if (monitoringReq === 'yes') {
      this.isReq = true;
    } else {
      this.isReq = false;
    }
  }

  randomSequence(chracters: string, length: number) {
    var result = '';
    for (var i = 0; i < length; i++) {
      result += chracters.charAt(Math.floor(Math.random() * chracters.length));
    }
    return result;
  }

  ngOnDestroy(): void {
    this.getSingle_asset?.unsubscribe();
    //  throw new Error('Method not implemented.');
  }
}
