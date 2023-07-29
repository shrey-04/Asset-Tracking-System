export interface TradeInitiationRequest {
    
    assetName: string;
    info: string;
    assetType: string;
    quantity: number;
    senderName: string;
    senderEmail: string;
    senderAddress: string;
    senderMobileNo: string;
    receiverName: string;
    receiverEmail: string;
    receiverAddress: string;
    receiverMobileNo: string;
    tokenAmount: number;
    uniqueTradeId: string;
}
