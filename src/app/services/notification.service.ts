import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private url: string = "http://localhost:8088";

  constructor(private httpClient: HttpClient) { }

  getAllNotifications(){
    return this.httpClient.get(`${this.url}/all-notifications`, { headers: this.getAccessToken() });
  }

  getAllUnreadNotifications(){
    return this.httpClient.get(`${this.url}/all-unread-notifications`, { headers: this.getAccessToken() });
  }

  readNotification(data:any){
    return this.httpClient.post(`${this.url}/read-notification`, data, {headers:this.getAccessToken()})
  }

  private getAccessToken(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access-token')}`,
    });
  }
}
