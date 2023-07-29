import { Pipe, PipeTransform } from '@angular/core';
import { AssetTrackingDetails } from '../interfaces/asset-tracking-details';

@Pipe({
  name: 'sort'
})
export class SortPipePipe implements PipeTransform {

  transform(value: Array<AssetTrackingDetails>) {

    let transactions = value.sort((a,b) =>{
      if (new Date(a.transactionTime).getTime() < new Date(b.transactionTime).getTime()) {
        return 1;
      } else if (new Date(a.transactionTime).getTime() > new Date(b.transactionTime).getTime()) {
        return -1;
      }
      else{
        return 0;
      }
    });    
    
    return transactions;
  }

}
