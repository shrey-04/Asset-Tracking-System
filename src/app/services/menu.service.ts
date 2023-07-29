import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { Menu } from '../interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private url:string = "http://localhost:8088";
  // private url:string = `http://${environment.BesuIp}`;
  


  private headers: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
  });


  constructor(private httpClient:HttpClient) { }

   getAllMenus()
   {
    return this.httpClient.get(`${this.url}/menu/all-menus`, {headers:this.getAccessToken()});
   }

   getMenusByRole(role:string)
   {
    return this.httpClient.get(`${this.url}/menu/menus-by-role/${role}`, {headers:this.getAccessToken()});
   }

   assignMenuToRole(data:any){
    return this.httpClient.post(`${this.url}/menu/assign-screens`, data, {headers:this.getAccessToken()}).pipe(catchError(this.handleError));
   }

   private getAccessToken(): HttpHeaders{
    return new HttpHeaders({
     Authorization: `Bearer ${localStorage.getItem('access-token')}`,
   });
 }


 handleError(error:any) {
  let errorMessage = error.error.message;
  return throwError(() => {
      Swal.fire({
        icon: 'error',
        text: errorMessage,
      })
      return errorMessage;
  });
}

}
