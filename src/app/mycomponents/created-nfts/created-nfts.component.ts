import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketItem } from 'src/app/interfaces/market-item';
import { NftMarketPlaceService } from 'src/app/services/nft-market-place.service';
import { NftService } from 'src/app/services/nft.service';

@Component({
  selector: 'app-created-nfts',
  templateUrl: './created-nfts.component.html',
  styleUrls: ['./created-nfts.component.css']
})
export class CreatedNftsComponent implements OnInit {

  createdNFTList!: MarketItem[];
  showList: boolean = false;
  role!: string;
  showLoader:boolean= true;

  constructor(private nftMarketService: NftMarketPlaceService,
    private nftService: NftService,
    private router: Router) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    if (this.role == 'ROLE_SUPER_ADMIN' || this.role == 'ROLE_ADMIN' || this.role=='ROLE_SUPPLIER') {
      this.nftMarketService.fetchCreatedItemsByUSer().subscribe((res: any) => {
        this.createdNFTList = res;
        if(this.createdNFTList.length==0){
          this.showLoader = false;
        }
        // console.log("market items", res);
        for (let i = 0; i < this.createdNFTList.length; i++) {
          this.nftService.getTokenURI(this.createdNFTList[i].tokenId).subscribe((response: any) => {
            // this.marketItemList[i].tokenUri = response;
            // console.log("tokenURI ", response);

            this.nftService.getDatafromCID(response.response).subscribe((resData: any) => {
              this.createdNFTList[i].metaData = resData;
              this.createdNFTList[i].tokenUri = `https://gateway.pinata.cloud/ipfs/${resData.fileCID}`
              // console.log("metaData", this.createdNFTList);
              if (i == (this.createdNFTList.length - 1)) {
                this.showList = true;
                this.showLoader = false;
              }

            });
          })
          

        }

      });
    }
    else{
      this.showLoader = false;
    }

  }

  toDetails(itemId: number) {
    // console.log(itemId);

    let nft = this.createdNFTList.find(ele => ele.itemId == itemId);
    this.router.navigate(['/nft-market-place/details/', itemId]);
  }
}
