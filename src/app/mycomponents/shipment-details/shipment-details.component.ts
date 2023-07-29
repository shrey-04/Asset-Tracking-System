import { Qrdata } from './../../interfaces/QrData';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Asset } from 'src/app/interfaces/asset';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import {NgbModal, ModalDismissReasons}
      from '@ng-bootstrap/ng-bootstrap';
import { TrackingDetails } from 'src/app/interfaces/tracking-details';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-shipment-details',
  templateUrl: './shipment-details.component.html',
  styleUrls: ['./shipment-details.component.css']
})
export class ShipmentDetailsComponent implements OnInit  {

  singleAsset:any;
  AssetList:Array<Object> = [];

  getall_asset?:Subscription;
  getSingle_asset?:Subscription;
  getTracking_details?:Subscription;

  assetDetailsList:Array<Asset>;
  singleAssetData:Asset;
  assetTrackingDetails:Array<TrackingDetails>;
  message: string;
  flag:boolean=false;
  closeResult = '';
  qrCodeAssetData!: string;
  qrDataObject!: Qrdata;


  userRoleName!:string;

  greyColor: string = "rgb(165, 161, 161)";
  greenColor: string = "rgb(12, 170, 12)";
  emptyBarColor: string = "linear-gradient(to right, rgb(165, 161, 161) 0%, rgb(165, 161, 161) 100%)";
  completeBarColor: string = "linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 100%)";

  icons: string[] = ["fas fa-clipboard", "fas fa-warehouse", "fas fa-check-circle"];
  iconColor: string[] = [this.greyColor, this.greyColor, this.greyColor];
  barColor: string[] = [this.emptyBarColor, this.emptyBarColor];


  constructor(private assetServiceService: AssetServiceService,private modalService: NgbModal
    ,private router: Router, private route: ActivatedRoute) {


    // console.log("in constructor");
    this.assetDetailsList=[];
    this.singleAssetData={} as Asset;

    this.assetTrackingDetails=[];
    this.message="Loading Data, Please wait..."
    //this.flag=false;
  }

  ngOnInit(): void {
    this.userRoleName=localStorage.getItem("role")|| '{}';
    // console.log("in on it");
    this.getall_asset=this.assetServiceService.getAllShipmentDetails().subscribe(
      responseData=>{
        // console.log("-----------------", responseData);


        this.assetDetailsList= [...responseData];
        // console.log("responseData"+responseData[0].assetState);
        // console.log(this.assetDetailsList[0].assetState);


        this.message="Retrieved all Asstes details";
        //this.flag=false;
      },(error:string)=>
      {
        this.message=error;
        this.flag=false;
      }
    );




  }

  ngOnDestroy(): void {
    this.getall_asset?.unsubscribe();
    this.getSingle_asset?.unsubscribe();
  //  throw new Error('Method not implemented.');
  }

  open(content: any, assetId:any) {
    // console.log("assetId"+assetId);
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>
       {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult =
         `Dismissed ${this.getDismissReason(reason)}`;
    });
    // console.log("calling getSingleAssetDetails");
    this.getSingleAssetDetails(assetId);
    this.AssetList = JSON.parse(localStorage.getItem("assetList") || '[]');
   this.singleAsset = this.AssetList.find((val:any) => val.assetId == assetId);

  }




  openTrackingDetails(content: any, assetId:any) {
    // console.log(" Open tracking details assetId"+assetId);
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>
       {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult =
         `Dismissed ${this.getDismissReason(reason)}`;
    });
    // console.log("calling getTrackingDetailsByAssetId");
    this.getTrackingDetailsByAssetId(assetId);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getSingleAssetDetails(assetId:string)
  {
    // console.log("in single asset details"+assetId);
    this.getSingle_asset=this.assetServiceService.getAssetById(assetId).subscribe(
      responseData=>{
        this.singleAssetData = responseData;

        let asset:any;
        if(localStorage.getItem("assetList")){
          this.AssetList = JSON.parse(localStorage.getItem("assetList") || '[]');
          asset = this.AssetList.find((val:any) => val.assetId == assetId);
        }
        this.qrDataObject = {...responseData, ...{invoice:asset.invoice, receivedDate:asset.receivedDate}} ;
        delete this.qrDataObject.trackingDetails;

        this.qrCodeAssetData = JSON.stringify(this.qrDataObject, null, "\t");

        this.message="Retrieved Single Asstes details";
        //this.flag=true;


      }
      ,(error:string)=>
      {
        this.message=error;
        this.flag=false;
      }

    );

  }
  getTrackingDetailsByAssetId(assetId:string)
  {
    this.getTracking_details=this.assetServiceService.getTrackingDetails(assetId).subscribe(
      responseData=>{
        this.assetTrackingDetails= [...responseData];
        // console.log("responseData"+responseData);

        this.iconColor= [this.greyColor, this.greyColor, this.greyColor];
        this.barColor = [this.emptyBarColor, this.emptyBarColor];
        const index = this.assetTrackingDetails.length;
        // console.log("assettrackingdetails "+ index);

        if(index>=1){
          this.iconColor[0] = this.greenColor;
          if(index==2){
            this.barColor[0] = "linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 30%, rgb(165, 161, 161) 30%, rgb(165, 161, 161) 100%)";
          }
          if(index==3){
            this.barColor[0] = "linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 60%, rgb(165, 161, 161) 60%, rgb(165, 161, 161) 100%)";
          }
          if(index>=4){
            this.barColor[0] = this.completeBarColor;
            this.iconColor[1] = this.greenColor;
          }
          if(index>=5){
            this.barColor[1] = "linear-gradient(to right, rgb(12, 170, 12) 0%, rgb(12, 170, 12) 50%, rgb(165, 161, 161) 50%, rgb(165, 161, 161) 100%)";
          }
          if(index==6){
            this.barColor[1] = this.completeBarColor;
            this.iconColor[2] = this.greenColor
          }
        }

        this.message="Retrieved all Asstes details";
        this.flag=true;
      }, (error:string)=>
      {
        this.message=error;
        this.flag=false;
      }
    )





  }
   showModifyState()
   {
     this.router.navigate(['ModifyStateComponent'], {relativeTo: this.route});
   }

   exportToPdf(assetId:string): void {
    let data = document.getElementById("pdfData")!;
    html2canvas(data).then(canvas => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth / canvas.width ) - 50;
      const FILEURI = canvas.toDataURL('image/jpeg')
      let PDF = new jsPDF('p', 'mm', 'letter');
      let position = 20;
      PDF.addImage(FILEURI, 'JPEG', 3, position, fileWidth, fileHeight);
      PDF.save(`asset-${assetId}.pdf`);
  });
 }


}
