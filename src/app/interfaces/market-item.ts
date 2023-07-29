import { NftMetadata } from "./nft-metadata";

export interface MarketItem {
    itemId:number;
    nftContract: string;
    tokenId: number;
    seller: string;
    owner: string;
    price: number;
    sold: boolean;
    tokenUri: string;
    metaData: NftMetadata;
}
