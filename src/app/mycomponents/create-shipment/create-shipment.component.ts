import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Asset } from 'src/app/interfaces/asset';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import Swal from 'sweetalert2';
import { UserMaster } from 'src/app/interfaces/user-master';
import { UserMasterService } from 'src/app/services/user-master.service';
import { TradeInitiationRequest } from 'src/app/interfaces/trade-initiation-request';
import { NftMarketPlaceService } from 'src/app/services/nft-market-place.service';
@Component({
  selector: 'app-create-shipment',
  templateUrl: './create-shipment.component.html',
  styleUrls: ['./create-shipment.component.css'],
})
export class CreateShipmentComponent implements OnInit, OnDestroy {
  flag: boolean;
  add_asset?: Subscription;
  addAseetResponse: Array<Asset>;
  message: string;
  formSubmitted: boolean = false;
  shipmentDetails!: Asset;
  userList!: Array<UserMaster>;
  uniqueTradeId!:string;
  assetDetails: FormGroup = new FormGroup({
    assetName: new FormControl('', Validators.required),
    info: new FormControl('', Validators.required),
    assetType: new FormControl('', Validators.required),
    tokenAmount: new FormControl('', Validators.required),
    quantity: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9 ]+'),
    ]),
  });
  supplierDetails: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', Validators.required),
    mobile_no: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.pattern('^[0-9 ]+'),
    ]),
  });
  consigneeDetails: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', Validators.required),
    mobile_no: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.pattern('^[0-9 ]+'),
    ]),
  });
  constructor(
    private assetServiceService: AssetServiceService,
    private router: Router,
    private nftMarketService: NftMarketPlaceService,
    private activatedRoute: ActivatedRoute,
    private userMasterService: UserMasterService
  ) {
    this.flag = false;
    this.addAseetResponse = [];
    this.message = 'Loading Data, Please wait...';

  //   this.activatedRoute.params.subscribe(params=>{
  //     this.uniqueTradeId = params['uniqueTradeId'];      
  // });
  }
  ngOnDestroy(): void {
    this.add_asset?.unsubscribe();
    //  throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    // let req = {
    //   assetName: '', info: '', assetType: '', quantity: 0,
    //   senderName: '', senderEmail: '', senderAddress: '', senderMobileNo: '',
    //   receiverName: '', receiverEmail: '', receiverAddress: '', receiverMobileNo: '',
    //   tokenAmount: 0, uniqueTradeId: ''
    // }
    // let requests: TradeInitiationRequest[];
    // this.assetServiceService.getAllTradeRequests(true).subscribe((res:any)=>{
    //   requests = res;
    //   let request:TradeInitiationRequest = requests.find(ele => ele.uniqueTradeId == this.uniqueTradeId) || req;
    //   this.assetDetails.controls['assetName'].setValue(request.assetName);
    //   this.assetDetails.controls['assetType'].setValue(request.assetType);
    //   this.assetDetails.controls['quantity'].setValue(request.quantity);
    //   this.assetDetails.controls['info'].setValue(request.info);
    //   this.assetDetails.controls['tokenAmount'].setValue(request.tokenAmount);

    //   this.supplierDetails.controls['name'].setValue(request.senderName);
    //   this.supplierDetails.controls['email'].setValue(request.senderEmail);
    //   this.supplierDetails.controls['address'].setValue(request.senderAddress);
    //   this.supplierDetails.controls['mobile_no'].setValue(request.senderMobileNo);

    //   this.consigneeDetails.controls['name'].setValue(request.receiverName);
    //   this.consigneeDetails.controls['email'].setValue(request.receiverEmail);
    //   this.consigneeDetails.controls['address'].setValue(request.receiverAddress);
    //   this.consigneeDetails.controls['mobile_no'].setValue(request.receiverMobileNo);

    // });
    
    this.supplierDetails.controls['name'].setValue(localStorage.getItem('name'));
    this.supplierDetails.controls['email'].setValue(localStorage.getItem('email'));
    // this.supplierDetails.controls['name'].disable();
    // this.supplierDetails.controls['email'].disable();
    this.userMasterService.getUsersByRole("ROLE_USER").subscribe((res:any) => {
      this.userList = res
    });
    // this.consigneeDetails.controls['email'].disable();
  }
  addAsset() {
    
    this.formSubmitted = true;
    this.flag = false;
    if (
      this.supplierDetails.valid &&
      this.assetDetails.valid &&
      this.consigneeDetails.valid
    ) {
      // console.log('calling add asset');
      // this.supplierDetails.controls['name'].enable();
      // this.supplierDetails.controls['email'].enable();
      // this.consigneeDetails.controls['email'].enable();

      this.shipmentDetails = {
        ...this.assetDetails.value,
        originAddress: this.supplierDetails.value,
        destinationAddress: this.consigneeDetails.value,
      };
      // console.log(this.shipmentDetails);
      this.initialLoader();

      // this.nftMarketService.approveAssetRequest(this.uniqueTradeId).subscribe((res:any)=>{
      //   // console.log("Asset created ", res);
        
      //   Swal.fire({
      //           html: `<div>
      //                   <span>Shipment created successfully </span>
      //                   <br>
      //                   <div class = "mt-3">
      //                     <small class="fw-bold" >Asset Id : <span class ="fw-normal">${res.asset_id}<span> </small>
      //                     <br/>
      //                   </div>
      //                 </div>`,
      //           icon: 'success',
      //           confirmButtonText: 'Ok',
      //         }).then(() => {
      //           this.router.navigate([
      //             'shipmentDetails/transactions/' + res.asset_id,
      //           ]);
      //         });
      // })

      this.add_asset = this.assetServiceService
        .addAsset(this.shipmentDetails)
        .subscribe((res: any) => {
          Swal.fire({
            html: `<div>
                    <span>Shipment created successfully </span>
                    <br>
                    <div class = "mt-3">
                      <small class="fw-bold" >Asset Id : <span class ="fw-normal">${res.asset_id}<span> </small>
                      <br/>
                    </div>
                  </div>`,
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then(() => {
            this.router.navigate([
              'shipmentDetails/transactions/' + res.asset_id,
            ]);
          });
        });
      this.assetDetails.reset();
      this.supplierDetails.reset();
      this.consigneeDetails.reset();
      this.formSubmitted = false;
    }
  }

  getUserDetails(event: any){
    // this.userList = [];
    // this.isUserList = false
    // this.userMasterService.getUsersByRole("ROLE_USER").subscribe((res:any) => {
      // console.log("-------------------", res.status);
      // this.isUserList = true;
      // this.userList = res
    // });
    for (let index = 0; index < this.userList.length; index++) {
      const element = this.userList[index].name;
      if(this.userList[index].name == event.target.value){
        this.consigneeDetails.controls['email'].setValue(this.userList[index].email);
        break;
      }
      
    }
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

  getValidationMessages(formControl: any) {
    let messages: string[] = [];
    if (formControl.errors) {
      for (let errorName in formControl.errors) {
        switch (errorName) {
          case 'required':
            messages.push(`This field is required`);
            break;
          case 'pattern':
            messages.push(`This field contain illegal character`);
            break;
          case 'minlength':
            messages.push(`This field must contain 10 digits `);
            break;
          case 'maxlength':
            messages.push(`This field must contain 10 digits`);
            break;
        }
      }
    }
    return messages;
  }
}
