import { TrackingDetails } from "./tracking-details";

export interface Qrdata {
  assetId: string;
  assetCreationTime: string;
  assetState: string
  assetName: string,
  info: string,
  assetType: string,
  quantity: string,
  trackingDetails: TrackingDetails[] | undefined;
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
}
