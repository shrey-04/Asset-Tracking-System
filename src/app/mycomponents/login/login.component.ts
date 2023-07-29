import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginRequest } from 'src/app/interfaces/login-request';
import { UserMaster } from 'src/app/interfaces/user-master';
import { AuthenticatorService } from 'src/app/services/authenticator.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  returnUrl !: string;
  // flag? : Boolean;
  // loginRequest: LoginRequest;
  
  loginForm: FormGroup = new FormGroup({
    email: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  })

  constructor(private authenticatorService : AuthenticatorService, private route: ActivatedRoute ,
    private router: Router ,private menuService:MenuService) {
      // this.returnUrl = "";
      // this.loginRequest = {} as LoginRequest;

   }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // console.log(params['token']);
      if(params['token'] !== undefined){
        localStorage.setItem("access-token", params['token']);

        this.router.navigate([], {
          queryParams: {
             'token': null,
          },
          queryParamsHandling: 'merge'
       });
       this.authenticatorService.getCurrentUser(params['token']).subscribe((response:any)=>{
        localStorage.setItem("email",response.email);
        localStorage.setItem("loginId",response.loginId);
        localStorage.setItem("name",response.name);
        localStorage.setItem("role",response.roles);
        this.router.navigate(['/dashboard']);
      })
       
      }
    });
  


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }


  loginProcess()
  {
           this.authenticatorService.authenticateUser(this.loginForm.value).subscribe((result:any) =>{
             localStorage.setItem("access-token",result.accessToken);
             this.authenticatorService.getCurrentUser(result.accessToken).subscribe((response:any)=>{
               localStorage.setItem("email",response.email);
               localStorage.setItem("loginId",response.loginId);
               localStorage.setItem("name",response.name);
               localStorage.setItem("role",response.roles);
              //  this.authenticatorService.getData().subscribe((res:any)=> {
              //   console.log("AssetList ",res.response);
              //   localStorage.setItem("assetList",res.response);
              //   this.router.navigate([this.returnUrl]);
              // });
              this.router.navigate([this.returnUrl]);

             })


           
           }
          );
  



  }


  ngOnDestroy(){
  }

}
