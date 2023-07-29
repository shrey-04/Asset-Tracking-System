import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Asset } from 'src/app/interfaces/asset';
import { MarketItem } from 'src/app/interfaces/market-item';
import { NftMarketPlaceService } from 'src/app/services/nft-market-place.service';
import { NftService } from 'src/app/services/nft.service';
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nft-details',
  templateUrl: './nft-details.component.html',
  styleUrls: ['./nft-details.component.css']
})
export class NftDetailsComponent implements OnInit {

  data!: MarketItem;
  routeState: any;
  itemId!: number;
  nfts!:number;
  showItem:boolean = false;
  userName!:string;

  tradeForm:FormGroup = new FormGroup({
    assetName: new FormControl('', Validators.required),
    info: new FormControl('', Validators.required),
    assetType: new FormControl('', Validators.required),
    quantity: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9 ]+'),
    ]),
    address: new FormControl('', Validators.required),
    mobile_no: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.pattern('^[0-9 ]+'),
    ]),
  })
  // getData:boolean = false;

  constructor(private router: Router,
    private nftService: NftService,
    private nftMarketService: NftMarketPlaceService,
    private activatedRoute: ActivatedRoute,
    private walletService: WalletService,
    private modalService: NgbModal) {

      this.activatedRoute.params.subscribe(params=>{
        this.itemId = params['itemId'];      
    });


    
  }

  ngOnInit(): void {

    this.userName = localStorage.getItem('name') || '';

    let item = {
      itemId:0,
      nftContract:'',
      tokenId: 0,
      seller: '',
      owner: '',
      price: 0,
      sold: false,
      tokenUri: '',
      metaData: {
        fileCID:'',
        sellerName:'',
        price:0,
        NFTtype:'',
        NFTName:'',
        sellerLoginId:'',
        sellerAddress:'',
        sellerMobileNo:''
      }
    }
    let itemList: MarketItem[] = [];
    let role = localStorage.getItem('role');

      this.nftMarketService.fetchMarketItems().subscribe((res1:any)=>{
        itemList = res1;
        
        this.nftMarketService.fetchUserItems().subscribe((res2:any)=>{
          itemList = [...itemList, ...res2];
          if(role=='ROLE_SUPPLIER'|| role=='ROLE_SUPER_ADMIN' || role=='ROLE_ADMIN'){
            this.nftMarketService.fetchCreatedItemsByUSer().subscribe((res3:any)=>{
              itemList = [...itemList, ...res3];
              // console.log(itemList);
              
              this.data = itemList.find(ele => ele.itemId == this.itemId) || item;
  
              this.nftService.getTokenURI(this.data.tokenId).subscribe((resData:any)=>{
                this.nftService.getDatafromCID(resData.response).subscribe((response:any)=>{
                  this.data.metaData = response;
                  this.data.tokenUri = `https://gateway.pinata.cloud/ipfs/${response.fileCID}`
                  this.showItem = true;
                });
              });
            });
          }
          else{
            this.data = itemList.find(ele => ele.itemId == this.itemId) || item;
  
              this.nftService.getTokenURI(this.data.tokenId).subscribe((resData:any)=>{
                this.nftService.getDatafromCID(resData.response).subscribe((response:any)=>{
                  this.data.metaData = response;
                  this.data.tokenUri = `https://gateway.pinata.cloud/ipfs/${response.fileCID}`
                  this.showItem = true;
                });
              });
          }
          
        });
      });
      
    
      


    
    
  }

  buyNFT(){
    let NFTdata = {
      itemId: this.data.itemId,
      price: this.data.price,
      sellerAddress: this.data.seller
    }

    Swal.fire({
      title: "Are you sure?",
      // text: "Once added, you will not be able to delete this role!",
      showCancelButton: true,
      showConfirmButton: true
    })
    .then((alert:any) => {
      if (alert.isConfirmed) {

        this.walletService.getFunds().subscribe((response:any)=>{
          if(response<this.data.price){
            Swal.fire({
              title: `Insufficient Funds!`,
              text: 'Please add funds to your wallet',
              icon: "error",
            });
          }
          else{
            this.initialLoader('Syncing to blockchain...');

          this.nftMarketService.buyNft(NFTdata).subscribe((res:any)=>{
            // console.log("BUY NFT", res);
            Swal.fire({
              text: `${res.response}`,
              icon: "success",
            }).then((res) => {
              window.location.reload();
              // this.router.navigate(['/nft-store']);
            });
          });
          }
        });
      } else {
        Swal.fire({
          text:`Token ownership not transfered!`,
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

  initiateTrade(content:any){
    this.modalService.open(content, {
      centered:true,
      size: 'md'
    });
    
  }
  sendTradeRequest(){

    let tradeRequest: any = {};
    tradeRequest.assetName = this.tradeForm.controls['assetName'].value;
    tradeRequest.assetType = this.tradeForm.controls['assetType'].value;
    tradeRequest.quantity = this.tradeForm.controls['quantity'].value;
    tradeRequest.info = this.tradeForm.controls['info'].value;
    tradeRequest.tokenAmount = this.data.price;

    tradeRequest.originAddress = {
      name: this.data.metaData.sellerName,
      email: this.data.metaData.sellerLoginId,
      mobile_no: this.data.metaData.sellerMobileNo,
      address: this.data.metaData.sellerAddress
    }
    tradeRequest.destinationAddress = {
      name: localStorage.getItem('name') || '',
      email: localStorage.getItem('email') || '',
      mobile_no: this.tradeForm.controls['mobile_no'].value,
      address: this.tradeForm.controls['address'].value
    }

    // console.log(tradeRequest);
    

    Swal.fire({
      title: "Are you sure?",
      // text: "Once added, you will not be able to delete this role!",
      showCancelButton: true,
      showConfirmButton: true
    })
    .then((alert:any) => {
      if (alert.isConfirmed) {
          this.initialLoader('Sending request to supplier...');
          this.nftMarketService.initiateTrade(tradeRequest).subscribe((res:any)=>{
            // console.log(res);
            
            Swal.fire({
              text: `${res.response}`,
              icon: "success",
            }).then((res) => {
              // window.location.reload();
              // this.router.navigate(['/nft-store']);
              this.modalService.dismissAll();
            });
          });
      } else {
        Swal.fire({
          text:`Trade not initiated!`,
          icon:"info"
        }).then(res=>{
        });
      }
    });

  }


}
