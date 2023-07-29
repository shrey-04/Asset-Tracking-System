import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  private url: string = "http://localhost:8088/dashboard";
  // private url:string = `http://${environment.BesuIp}/dashboard`;

  private messageSource = new BehaviorSubject(0);

  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }


  getBlockCount() {
    return this.http.get(`${this.url}/block-count`);
  }

  getTotalAssetCount() {
    return this.http.get(`${this.url}/asset-count`);
  }

  getAssetStatus() {
    return this.http.get(`${this.url}/asset-delivered-count`)
  }

  getAssetCountBasedOnCities(){
    return this.http.get(`${this.url}/city-based-asset-count`)
  }


  getMonthlyAssetCount(){
    return this.http.get(`${this.url}/monthly-asset-count`)
  }

  storeData(data: string){
    return this.http.post(`http://localhost:3001/store`, {data});
  }


  changeMessage(message: number) {
    this.messageSource.next(message)
  }
}
