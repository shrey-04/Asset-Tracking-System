import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { FundRequest } from 'src/app/interfaces/fund-request';
import { TradeInitiationRequest } from 'src/app/interfaces/trade-initiation-request';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userName!:string;
  email!:string;
  fundRequestList!:FundRequest[];
  assetRequestList!:TradeInitiationRequest[];
  role!:string;
  walletAddress!:string;
  menuId!:any;

  // @ViewChild('pendingAssetRequest') pendingAssetRequest!: TemplateRef<any>;


  constructor(private walletService: WalletService,
    private assetService: AssetServiceService,
    private modalService: NgbModal,
    private router: Router) {
      if (this.router.getCurrentNavigation()?.extras.state) {      
        let routeState:any = this.router.getCurrentNavigation()?.extras.state;
        if (routeState) {
          this.menuId =  routeState.menuId ? routeState.menuId : '';
          // console.log("MenuId   ",this.menuId);
        }
      }
     }

  ngOnInit(): void {

    // if(this.menuId){
    //   this.showRequests(this.pendingAssetRequest);
    // }
    

    this.userName = localStorage.getItem('name') || '';
    this.email = localStorage.getItem('email') || '';
    this.role = localStorage.getItem('role') || '';

    // if(this.role=='ROLE_SUPER_ADMIN' || this.role=='ROLE_ADMIN'){
    //   this.walletService.getAllPendingFundRequests().subscribe((res:any)=>{
    //     this.fundRequestList = res;
    //   });
    // }

    // if(this.role=='ROLE_SUPER_ADMIN' || this.role=='ROLE_ADMIN' || this.role=='ROLE_SUPPLIER'){
    //   this.assetService.getAllTradeRequests(true).subscribe((res:any)=>{
    //     this.assetRequestList = res;
    //     // console.log("Request List ", res);
        
    //   });
      // this.assetService.getAllTradeRequests(true);
    // }

    
    this.walletService.getWalletKeys().subscribe((response:any) => {
      // console.log(response);
      this.walletAddress = response.accountAddress;
    });
  }

  // ngAfterViewInit(): void {
    // if(this.menuId){
    //     this.showRequests(this.pendingAssetRequest);
    //   }
  // }

  

  // showRequests(content:any){
  //   this.modalService.open(content, {
  //     centered:true,
  //     size: 'lg'

  //   });
  // }

  // approveAssetRequest(uniqueTradeId: string){
  //   Swal.fire({
  //     // title: "Are you sure?",
  //     text: "Please create asset on create shipment page, you will be redirected to create shipment!",
  //     showCancelButton: true,
  //     showConfirmButton: true
  //   })
  //   .then((alert:any) => {
  //     if (alert.isConfirmed) {
  //       // this.initialLoader('Approving fund request...');
  //       this.modalService.dismissAll();
  //       this.router.navigate(['/createAsset/',uniqueTradeId]);

  //       // this.walletService.approveFundRequest(true, uniqueTradeId).subscribe((res:any)=>{
  //       //   // console.log(res);
  //       //   Swal.fire({
  //       //     text: `${res.response}`,
  //       //     icon: "success",
  //       //   }).then((res) => {
  //       //     // this.modalService.dismissAll();
  //       //     window.location.reload();
  //       //   });
  //       // });

  //     } else {
  //       Swal.fire({
  //         text:`Trade request still pending!`,
  //         icon:"info"
  //       }).then(res=>{
  //       });
  //     }
  //   });
  // }

  // approveFundRequest(uniqueId: string){
  //   Swal.fire({
  //     title: "Are you sure?",
  //     // text: "Once added, you will not be able to delete this role!",
  //     showCancelButton: true,
  //     showConfirmButton: true
  //   })
  //   .then((alert:any) => {
  //     if (alert.isConfirmed) {
  //       this.initialLoader('Approving fund request...');

  //       this.walletService.approveFundRequest(true, uniqueId).subscribe((res:any)=>{
  //         // console.log(res);
  //         Swal.fire({
  //           text: `${res.response}`,
  //           icon: "success",
  //         }).then((res) => {
  //           // this.modalService.dismissAll();
  //           window.location.reload();
  //         });
  //       });

  //     } else {
  //       Swal.fire({
  //         text:`Fund request not approved!`,
  //         icon:"info"
  //       }).then(res=>{
  //       });
  //     }
  //   });
  // }


  // initialLoader(msg:string): void {
  //   Swal.fire({
  //     title: `${msg}`,
  //     html: 'Please wait...',
  //     allowEscapeKey: false,
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     },
  //   });
  // }


//   generatePdf() {

//     let tableData = [
//       ['User Name', localStorage.getItem('name')],
//       ['Login ID', localStorage.getItem('email')],
//       ['User Role', localStorage.getItem('role')],
//       ['Wallet Adddress', this.walletAddress],
//     ]

//     var pdf = new jsPDF();

//     pdf.setFontSize(40);
//     pdf.text('Supplier Trade Agreement', 30, 30);
//     pdf.setTextColor(99);

//     pdf.setFontSize(60);
//     pdf.text('Sample Trade', 40, 140);
//     pdf.text('Agreement', 50, 160);
//     pdf.setTextColor('#808080');
    

//     autoTable(pdf, 
//       {
//         body: tableData,
//         theme: 'striped',
//         bodyStyles:{
//           fontSize:20,
//           minCellWidth:50
//         },
//         margin: { top: 45 },
//         didDrawCell: (data:any) => {
//             // console.log(data.column.index)
//         }
//       });
//     // pdf.autoTable({
//     //   StyleDef: {
//     //     fontSize: 300,
//     //     font: 'helvetica',
//     //     fontStyle: 'bold'
//     //   },
//     //   body: tableData,
//     //   theme: 'striped',
//     //   margin: { top: 30 },
    
//     //   didDrawCell: (data:any) => {
//     //       // console.log(data.column.index)
//     //   }
//     // })

//     // Open PDF document in browser's new tab
//     // pdf.output('dataurlnewwindow')

//     // Download PDF doc  
//     pdf.save('trade-agreement.pdf');
// } 

}
