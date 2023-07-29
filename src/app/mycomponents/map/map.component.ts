import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'src/app/interfaces/asset';
import { Location } from '@angular/common';
import { AssetServiceService } from 'src/app/services/asset-service.service';
declare var L : any;



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map:any;
  assetDetails!: Asset;
  assetId!: string ;

  AssetList:Array<Object> = [] ;
  singleAsset:any;
  waypoint:any;

  constructor(
    private assetServiceService: AssetServiceService,
    private _Activatedroute: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(
      (params) => {
        // console.log('params are' + params);
        // this.assetString = params.get('assetId');
        this.assetId = this._Activatedroute.snapshot.params['assetId'];
        // console.log('this.assetId' + this.assetId);
      }
    );

    this.AssetList = JSON.parse(localStorage.getItem("assetList") || '[]');
    this.singleAsset = this.AssetList.find((val:any) => val.assetId == this.assetId);

    if(this.singleAsset && this.singleAsset.warehouseAddress){
      this.waypoint = this.singleAsset.warehouseAddress;
    }
    

    this.assetServiceService.getAssetById(this.assetId).subscribe(
      responseData=>{
        this.assetDetails=responseData;
        // console.log("responseData"+responseData);
        this.openMap();
      }
    );

  }

  openMap(){
    L.mapquest.key = 'nknGMQC55mzAxEKmeUoM9uv6vx9CAAPT';

    this.map = L.mapquest.map('map', {
      center: [20.5937, 78.9629],
      layers: L.mapquest.tileLayer('map'),
      zoom: 7
    });

    this.map.addControl(L.mapquest.control());
    
    
      L.mapquest.directions().route({
        start: this.assetDetails.sourceAddress,
        end: this.assetDetails.destinationAddress,
        waypoints: [this.waypoint]
      });

  }

  navigateBack(){
    this.location.back();
  }

}
