import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticatorService } from 'src/app/services/authenticator.service';
import { UserMasterService } from 'src/app/services/user-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private userMasterService:UserMasterService, private router: Router) { }
  registerForm!: FormGroup;
  passwordMatch: Boolean = true;
  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({
      email:['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password:['', [Validators.required]],
      confirmPassword:['', [Validators.required]]
    });
  }
  register(){
    // this.displayMnemonic('hat split foil wave width pigeon amazing negative opinion glimpse loud ethics')
    if(!this.registerForm.invalid && this.passwordMatch){
      
      this.userMasterService.registerUser(this.registerForm.value).subscribe((response:any) => {
        this.displayMnemonic(response.mnemonicPhrase);
        // console.log(response);

      });
      // this.router.navigate(['/login']);
    }else {
      // console.log("invalid");
    }
  }
  get form(): any {
    return this.registerForm.controls;
  }
  checkPasswords(){
      let pass = this.registerForm.value.password;
      let confirmPass = this.registerForm.value.confirmPassword;
      // console.log("changed");
      if(pass !== confirmPass){
        this.passwordMatch = false;
      }else {
        this.passwordMatch = true;
      }
  }

  displayMnemonic(mnemonicPhrase: string){
    Swal.fire({
      title: "Wallet Created",
      html: `<div>
              <span class="h5">This mnemonic phrase is the only way to restore your wallet, save them safe and secret. </span>
                <br>
                  <div class = "mt-3">
                     <span class ="fw-normal text-warning">${mnemonicPhrase}<span>
                    <br/>
                  </div>
              </div>`,

      icon: 'success',
      confirmButtonText: 'Click here to Login',
}).then(() => {
  this.router.navigate(['/login']);
});
  }

}
