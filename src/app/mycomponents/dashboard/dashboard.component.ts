import { DashboardService } from './../../services/dashboard.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import { Asset } from 'src/app/interfaces/asset';
import { AssetTrackingDetails } from 'src/app/interfaces/asset-tracking-details';
import { SortPipePipe } from 'src/app/pipes/sort-pipe.pipe';
import {environment} from "../../../environments/environment";
Chart.register(...registerables);



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  blockSubscription!: Subscription;
  assetSubscription!: Subscription;

  statusText!: string;

  awsBesuIp: string = environment.awsBesuIp;

  blockCount!: string;
  assetCount!: string;
  assetDelivered!: string;
  assetInTransit!: number;




  myChart! :any;

  // notifications: string[] =[
  //   'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
  //   'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
  //   'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
  //   'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
  //   'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM'
  // ]

  transactions:Array<AssetTrackingDetails> = [];
  flag:boolean = false;

  constructor(private dashboardService: DashboardService, private assetService: AssetServiceService , private activatedRoute: ActivatedRoute, private router:Router,
    private sortPipe: SortPipePipe) {
    this.getNotifications();
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      if(params['token'] !== undefined){
        localStorage.setItem("access-token", params['token']);
        this.router.navigate([], {
          queryParams: {
             'token': null,
          },
          queryParamsHandling: 'merge'
       })
      }
    });


    // this.getLocation();
    this.createDoughnutChart();

    this.blockSubscription = timer(0, 10000)
      .pipe(switchMap(async () => this.dashboardService.getBlockCount()))
      .subscribe((res: any) =>
        res.subscribe((count: any) => {
          this.blockCount = count.response;
        })
      );

    this.assetSubscription = timer(0, 900000)
    .pipe(switchMap(async () => this.dashboardService.getTotalAssetCount()))
    .subscribe((res: any) =>
      res.subscribe((count: any) => {
        this.myChart.destroy();
        this.assetCount = count.response;
        this.getAssetStatus();
      })
    );

  }


  getAssetStatus(): void {
    this.dashboardService.getAssetStatus().subscribe((res: any) => {
      this.assetDelivered = res.response;
      this.assetInTransit = Number(this.assetCount) - Number(this.assetDelivered);
      if(this.assetInTransit <= 0){
        this.assetInTransit = 0;
      }
        // console.log("------------", this.assetInTransit, this.assetDelivered);
      this.createDoughnutChart();
    });
  }



  createDoughnutChart(): void{

    const data = {
      labels: [
        'Delivered: ' + this.assetDelivered,
        'In-Transit: ' + this.assetInTransit,
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [this.assetDelivered, this.assetInTransit],
        datalabels: {
          color: 'white',
          font: {
          }
        },
        backgroundColor: [
          "#76b900",
          "rgb(59, 120, 156)"

        ],
        hoverOffset: 4,
      }]
    };

    this.myChart = new Chart("myChart", {
      type: 'doughnut',
      data: data,

      options : {
        responsive: true,
        plugins:{
          tooltip:{
            callbacks: {
              label: function(tooltipItem){
                return data.labels[tooltipItem.dataIndex]
              }
            }
          }
        }
      },
    //   plugins: [{
    //     id: 'text',

    //     beforeDraw: function(chart, a, b) {
    //       var width = chart.width,
    //         height = chart.height,
    //         ctx = chart.ctx;


    //       ctx.restore();
    //       var fontSize = (height / 114).toFixed(2);
    //       ctx.font = fontSize + "em sans-serif";
    //       ctx.textBaseline = "middle";

    //       var text = "75%",
    //         textX = Math.round((width - ctx.measureText(text).width) / 2),
    //         textY = height / 2;

    //       ctx.fillText(text, textX, textY);
    //       ctx.save();
    //     }
    //   },

    // ]
    });
  }

  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
            // console.log("----------------", longitude, latitude);

        });
    } else {
      //  console.log("No support for geolocation")
    }
  }





  getNotifications(){
    let assetList!: Array<Asset>;
    this.assetService.getAllShipmentDetails().subscribe(
      response=> {
        assetList = response;
        for(let i = 0; i<assetList.length; i++){
          this.assetService.fnGetTransactionTrackingDetails(assetList[i].assetId).subscribe(
            (responseData: any) => {
              let j = 0;
              for(j = 0; j<responseData.transactions.length; j++){
                this.transactions.push({assetId:responseData.assetId, ...responseData.transactions[j]});
                if(j == responseData.transactions.length-1 && i == assetList.length-1){
                  this.flag = true;
                  this.dashboardService.changeMessage(this.transactions.length);
                  this.transactions = this.sortPipe.transform(this.transactions);
                  // console.log(this.transactions);

                }

              }

            }
          )
        }
    });
  }


  deleteNotification(i:number){
    this.transactions.splice(i, 1);
  }

  ngOnDestroy(): void {
    this.blockSubscription.unsubscribe();
    this.assetSubscription.unsubscribe();
    // console.log('destroyed!!');

}

}
