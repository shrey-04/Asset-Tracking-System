import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  // roleTypeList: any = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_USER'];
  formSubmitted: boolean = false;
  createUserForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  constructor(private loginService: LoginService) { }
  ngOnInit(): void {
  }
  addAdmin(): void {
    // console.log("--------------", this.createUserForm.value);
    this.initialLoader();
    this.loginService.addAdmin(this.createUserForm.value).subscribe(res => {
      this.alertMaker("User added successfully");
      this.createUserForm.reset();
    });
  }
  alertMaker(message: string): void {
    Swal.fire({
      text: `${message}.`,
      icon: 'success',
      confirmButtonText: 'Ok',
    });
  }
  initialLoader(): void {
    Swal.fire({
      html: 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
  getValidationMessages(formControl: any) {
    let messages: string[] = [];
    if (formControl.errors) {
      for (let errorName in formControl.errors) {
        switch (errorName) {
          case 'required':
            messages.push(`This field is required`);
            break;
          case 'pattern':
            messages.push(`This field contain illegal character`);
            break;
          case 'minlength':
            messages.push(`This field must contain 10 digits `);
            break;
          case 'maxlength':
            messages.push(`This field must contain 10 digits`);
            break;
        }
      }
    }
    return messages;
  }
}