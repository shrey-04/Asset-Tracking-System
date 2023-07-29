import { DashboardService } from './../../services/dashboard.service';
import { Router } from '@angular/router';
import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserMasterService } from 'src/app/services/user-master.service';
import { Asset } from 'src/app/interfaces/asset';
import { AssetTrackingDetails } from 'src/app/interfaces/asset-tracking-details';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import { SortPipePipe } from 'src/app/pipes/sort-pipe.pipe';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { WalletService } from 'src/app/services/wallet.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription, switchMap, timer } from 'rxjs';
import { Notification } from 'src/app/interfaces/notification';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() menuState = new EventEmitter();
  opened: boolean = true;
  showMenu = false; /* false by default, since hidden */
  length!: number;
  statusClass = 'not-active';
  styleExp = '250px';
  // notifications: string[] = [
  //   'Asset with asset id 1234 is delivered',
  //   'Asset with asset id 1234 is out for delivery',
  //   'Asset with asset id 1234 has left the fascility',
  //   'Asset with asset id 1234 is ready for dipatched',
  //   'Asset with asset id 1234 is ready for delivered',

  // ];

  funds!:number;
  walletAddress!:string;
  userName!:string;
  showWallet!:boolean
  transactions:Array<AssetTrackingDetails> = [];
  flag:boolean = false;
  notificationSubscription!: Subscription;
  notifications:Notification[] = [];

  // length = this.notifications.length;

  constructor(private dashboard: DashboardService, 
    private router: Router,
    private assetService: AssetServiceService,
    private sortPipe: SortPipePipe,
    private dashboardService: DashboardService,
    private walletService:WalletService,
    private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.walletService.getWalletKeys().subscribe((response:any) => {
      // console.log(response);
      this.walletAddress = response.accountAddress;
    });
    this.dashboard.currentMessage.subscribe((res:number) => {
      this.length = res;
    });
    this.userName = localStorage.getItem('name') || '';
    this.getNotifications();
    this.notificationSubscription = timer(0, 3000)
      .pipe(switchMap(async () => this.notificationService.getAllUnreadNotifications()))
      .subscribe((res: any) =>
        res.subscribe((response: any) => { 
          // console.log(response);
                 
          this.notifications = response;
        })
      );

  }

  toggleMenu() {
    // console.log('inside toggleMenu');
    // console.log('hellloooo' + this.showMenu);
    this.showMenu = !this.showMenu;
    this.menuState.emit(this.showMenu);
    if (this.showMenu == true) {
      this.styleExp = '250px';
    } else {
      this.styleExp = '0px';
    }
  }

  logOut(): void {
    // console.log("-------", "logged out!");

    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('access-token');
    localStorage.removeItem('role');
    localStorage.removeItem('loginId');
      this.router.navigate(["/login"]);
    // this.dashboardService.storeData(localStorage.getItem("assetList")||'').subscribe(res => {
    //   this.router.navigate(["/login"]);
    // });
  }

  getUserWalletDetails(): void{
    this.showWallet = true;
    
    this.walletService.getFunds().subscribe((response:any) => {
      this.funds = response;
    });
  }

  readNotification(notification: Notification){
    
    let data = {
      isRead: true,
      uniqueNotificationId: notification.uniqueNotificationId
    }
    // console.log("Read Notification", data);
    this.notificationService.readNotification(data).subscribe(res=>{
      // console.log(res);
      
    })
  }

  getNotifications(){
    this.transactions = [];
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
                  this.transactions = this.transactions.slice(0, 5);
                }

              }

            }
          )
        }
    });
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();

}

  generatePdf() {

    let tableData = [
      ['User Name', localStorage.getItem('name')],
      ['Login ID', localStorage.getItem('email')],
      ['User Role', localStorage.getItem('role')],
      ['Wallet Adddress', this.walletAddress],
    ]

    var pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text('Supplier Trade Agreement', 50, 10);
    pdf.setFontSize(12);
    pdf.setTextColor(99);


    (pdf as any).autoTable({
    body: tableData,
    theme: 'striped',
    didDrawCell: (data:any) => {
        // console.log(data.column.index)
    }
    })

    // Open PDF document in browser's new tab
    pdf.output('dataurlnewwindow')

    // Download PDF doc  
    // pdf.save('trade-agreement.pdf');
}  


}
