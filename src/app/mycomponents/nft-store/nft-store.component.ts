import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketItem } from 'src/app/interfaces/market-item';
import { NftMarketPlaceService } from 'src/app/services/nft-market-place.service';
import { NftService } from 'src/app/services/nft.service';


@Component({
  selector: 'app-nft-store',
  templateUrl: './nft-store.component.html',
  styleUrls: ['./nft-store.component.css']
})
export class NftStoreComponent implements OnInit {

  marketItemList!: MarketItem[];
  showList: boolean = false;
  showLoader:boolean= true;
  // src="https://gateway.pinata.cloud/ipfs/QmXZZaKGQD94we4fPxwuexYwYWeyE2sYiNNN3hwzrqD3DL";

  constructor(private nftMarketService: NftMarketPlaceService,
    private nftService: NftService,
    private router: Router) { }

  ngOnInit(): void {
    this.nftMarketService.fetchMarketItems().subscribe((res:any)=>{
      this.marketItemList = res;
      if(this.marketItemList.length==0){
        this.showLoader = false;
      }
      // console.log("market items", res);
      for(let i = 0; i < this.marketItemList.length; i++){
        this.nftService.getTokenURI(this.marketItemList[i].tokenId).subscribe((response:any)=>{         
          this.nftService.getDatafromCID(response.response).subscribe((resData:any)=>{
            this.marketItemList[i].metaData = resData;
            this.marketItemList[i].tokenUri = `https://gateway.pinata.cloud/ipfs/${resData.fileCID}`
            if(i == (this.marketItemList.length-1)){
              this.showList = true;
              this.showLoader = false;
              // console.log(this.marketItemList);
              
            }
          });
        })
        
      }
      
    });

   
  }

  toDetails(itemId:number){
    // console.log(itemId);
    let nft = this.marketItemList.find(ele => ele.itemId == itemId);
    this.router.navigate(['/nft-market-place/details/',itemId]);
  }

}
