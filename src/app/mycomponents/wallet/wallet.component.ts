import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserMasterService } from 'src/app/services/user-master.service';
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  funds!:number;
  walletAddress!:string;
  userName!:string;
  privateKey!:string;
  publicKey!:string;

  requestLST: FormGroup = new FormGroup({
    amount: new FormControl(null, Validators.required)
  });

  constructor(private modalService: NgbModal,
    private walletService:WalletService) { }

  ngOnInit(): void {
    this.walletService.getWalletKeys().subscribe((response:any) => {
      // console.log(response);
      this.walletAddress = response.accountAddress;
      this.privateKey = response.privateKey;
      this.publicKey = response.publicKey;
    });
    this.walletService.getFunds().subscribe((response:any) => {
      this.funds = response;
    });
    this.userName = localStorage.getItem('name') || '';
  }

  showPrivateKey(content:any){
    this.modalService.open(content, {
      centered:true,
      size: 'md'
      // modalDialogClass: 'customModalClass'
      // windowClass:'customModalClass'

    });
    
  }

  addFunds(content:any){
    this.modalService.open(content, {
      centered:true,
      size: 'md'
      // modalDialogClass: 'customModalClass'
      // windowClass:'customModalClass'

    });
  }

  sendFundrequest(){

    Swal.fire({
      title: "Are you sure?",
      // text: "Once added, you will not be able to delete this role!",
      showCancelButton: true,
      showConfirmButton: true
    })
    .then((alert:any) => {
      if (alert.isConfirmed) {
        this.initialLoader('Sending request...');

        this.walletService.requestFunds(this.requestLST.controls['amount'].value).subscribe((res:any)=>{
          // console.log("Fund Request ", res);
          Swal.fire({
            text: `${res.response}`,
            icon: "success",
          }).then((res) => {
            // window.location.reload();
            this.modalService.dismissAll();
            // this.router.navigate(['/nft-store']);
          });
          
        });
      } else {
        Swal.fire({
          text:`Funds not requested!`,
          icon:"info"
        }).then(res=>{
        });
      }
    });

    
  }

  initialLoader(msg:string): void {
    Swal.fire({
      title: `${msg}`,
      html: 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }


}
