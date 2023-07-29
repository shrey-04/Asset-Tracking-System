import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }
  private headers: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
  });
  private url:string = "http://localhost:8088";
  addAdmin(data: any){
    return this.http.post(`${this.url}/signup/admin`, data, {headers:this.headers});
  }
  getRoles(){
    return this.http.get(`${this.url}/roles`, {headers:this.headers});
  }
  getUsersByRole(role:string){
    return this.http.get(`${this.url}/users-by-role?role=${role}`, {headers:this.headers});
  }
}