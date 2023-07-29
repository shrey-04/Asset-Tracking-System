import { Component, OnInit } from '@angular/core';
import { Asset } from 'src/app/interfaces/asset';
import { AssetTrackingDetails } from 'src/app/interfaces/asset-tracking-details';
import { SortPipePipe } from 'src/app/pipes/sort-pipe.pipe';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: string[] =[
    'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
    'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
    'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
    'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
    'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
    'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
    'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
    'Asset with asset id 12345 has been dispatched on 20th Dec 2021 at 11:00 PM',
  ]
  transactions:Array<AssetTrackingDetails> = [];
  flag:boolean = false;

  constructor(private dashboardService: DashboardService, private assetService: AssetServiceService, private sortPipe: SortPipePipe) {
    this.getNotifications();
   }

  ngOnInit(): void {
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


}
