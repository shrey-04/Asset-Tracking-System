import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AssetTrackingDetails } from '../interfaces/asset-tracking-details';


@Pipe({
  name: 'getMessage'
})
export class GetMessagePipe implements PipeTransform {


  transform(value: AssetTrackingDetails): string {
    let message!:string;
    let time = new Date(value.transactionTime);
    let formatedTime = time.getDate() + '/' + String(Number(time.getMonth())+1) + '/' + time.getFullYear() + ' at ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    if(value.trackingMessage == 'Shipment created by supplier'){
      message = `The asset with Id ${value.assetId} has been created by the supplier on ${formatedTime}`;
    }
    if(value.trackingMessage == 'Shipment picked up from supplier'){
      message = 'The asset with Id ' + value.assetId + ' has been picked up by the carrier from supplier ' + formatedTime;
    }
    if(value.trackingMessage == 'Shipment arrived at warehouse'){
      message = 'The asset with Id ' + value.assetId + ' has arrived at warehouse on ' + formatedTime;
    }
    if(value.trackingMessage == 'Shipment picked up from warehouse'){
      message = 'The asset with Id ' + value.assetId +  ' has been picked up by the carrier from warehouse ' + formatedTime;
    }
    if(value.trackingMessage == 'Shipment out for delivery'){
      message = 'The asset with Id ' + value.assetId + ' is out for delivery.';
    }
    if(value.trackingMessage == 'Shipment Delivered'){
      message = 'The asset with Id ' + value.assetId + ' has been delivered on ' + formatedTime;
    }
    // console.log("----------------", formatedTime);


    return message;
  }

}
