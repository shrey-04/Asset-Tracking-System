import { AssetTrackingDetails } from "./asset-tracking-details";
import { TrackingDetails } from "./tracking-details";

export interface Asset {

    // assetId:string;
    // assetName:string;
    // sourceAddress:string;
    // destinationAddress:string;
    // info:string;
    // assetCreationTime:string;
    // assetState:string
    // trackingDetails:string;
    // assetTrackingDetails: AssetTrackingDetails[];
    // trackingDetails: (TrackingDetails | Asset)[];

    assetId: string;
    assetCreationTime: string;
    assetState: string
    // trackingDetails: string;
    trackingDetails: TrackingDetails[];
    assetName: string,
    info: string,
    assetType: string,
    quantity: string,
    tokenAmount: number,
    destinationAddress: {
        name: string,
        email: string,
        address: string,
        mobile_no: string,
    } | string,

    sourceAddress: {
        name: string,
        email: string,
        address: string,
        mobile_no: string,
    } | string,

    // orderNo:number;
    // batchNo:number;
    // temperature:number;
    // humidity:number;
    // billOfLading:string;
    // pickUpDate:Date;
    // barcode:number;
    // invoice:string;
    // receivedDate:Date;


}

