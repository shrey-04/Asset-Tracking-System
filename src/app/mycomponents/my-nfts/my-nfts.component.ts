import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketItem } from 'src/app/interfaces/market-item';
import { NftMarketPlaceService } from 'src/app/services/nft-market-place.service';
import { NftService } from 'src/app/services/nft.service';


@Component({
  selector: 'app-my-nfts',
  templateUrl: './my-nfts.component.html',
  styleUrls: ['./my-nfts.component.css']
})
export class MyNftsComponent implements OnInit {

  ItemList!: MarketItem[];
  showList: boolean = false;
  showLoader:boolean= true;

  constructor(private nftMarketService: NftMarketPlaceService,
    private nftService: NftService,
    private router: Router) { }

  ngOnInit(): void {

    this.nftMarketService.fetchUserItems().subscribe((res:any)=>{
      this.ItemList = res;
      if(this.ItemList.length==0){
        this.showLoader = false;
      }
      // console.log("market items", res);
      for(let i = 0; i < this.ItemList.length; i++){
        this.nftService.getTokenURI(this.ItemList[i].tokenId).subscribe((response:any)=>{
          // this.marketItemList[i].tokenUri = response;
          // console.log("tokenURI ", response);
          
          this.nftService.getDatafromCID(response.response).subscribe((resData:any)=>{
            this.ItemList[i].metaData = resData;
            this.ItemList[i].tokenUri = `https://gateway.pinata.cloud/ipfs/${resData.fileCID}`
            // console.log("metaData", this.ItemList);
            if(i == (this.ItemList.length-1)){
              this.showList = true;
              this.showLoader = false;
            }
            
          });
        })
        
      }
      
    });    
  }

  toDetails(itemId:number){
    // console.log(itemId);
    
    let nft = this.ItemList.find(ele => ele.itemId == itemId);
    this.router.navigate(['/nft-market-place/details/',itemId]);
  }

}
