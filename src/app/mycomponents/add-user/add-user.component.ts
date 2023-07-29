import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RoleMaster } from 'src/app/interfaces/role-master';
import { UserMaster } from 'src/app/interfaces/user-master';
import { UserMasterService } from 'src/app/services/user-master.service';
import Swal from 'sweetalert2';
import { UserMasterComponent } from '../user-master/user-master.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  getAllRoles?: Subscription;
  userRoleList: Array<RoleMaster>;
  message: string;
  add_User?: Subscription;
  selectedValue: any;
  selectedProduct: UserMaster;
  values = '';
  mySelect: any;
  userRoleId: number;
  formSubmitted: boolean = false;



  createUserForm: FormGroup = new FormGroup({
    loginId: new FormControl("", Validators.required),
    userName: new FormControl("", Validators.required),
    userRoleName: new FormControl("", Validators.required),
    userEmailId: new FormControl("", Validators.required),
  })
  constructor(private userMasterService: UserMasterService) {
    this.message = "Loading Data, Please wait...";
    this.userRoleList = [];
    this.selectedValue = 1;
    this.selectedProduct = {} as UserMaster;
    this.userRoleId = 1;
  }

  ngOnInit(): void {
    // console.log("in on it");
    // console.log("fetching user roles");
    // this.getAllRoles = this.userMasterService.getAllRoles().subscribe(
    //   responseData => {
    //     this.userRoleList = [...responseData];
    //     console.log("responseData" + responseData);

    //     this.message = "Retrieved all roles details";
    //     //this.flag=false;
    //   }, (error: string) => {
    //   this.message = error;
    // }
    // );

  }
  selectChange() {
    // console.log("hellooo" + this.mySelect)
    this.userRoleId = this.mySelect;
    // console.log("hellooo  vvvvvvvvv" + this.userRoleId)


  }
  // addNewUser(userMaster: UserMaster) {
  //   userMaster.userRoleId = this.userRoleId;
  //   console.log("in add new user " + userMaster);
  //   console.log("userMaster.userRoleId" + userMaster.userRoleId);
  //   if (this.createUserForm.valid) {
  //     this.formSubmitted = true;
  //     console.log("calling add user");
  //     this.add_User = this.userMasterService.addUser(userMaster);
  //     Swal.fire({
  //       text: 'User Created Successfully..',
  //       icon: 'success',
  //       confirmButtonText: 'Ok'
  //     });
  //     this.createUserForm.reset();
  //     this.formSubmitted = false;
  //     console.log("subscribe role master" + this.add_User);
  //   }

  // }

  handleChange(index: any) {
    // console.log("in handle add user 1"+index.userRoleName);
    // console.log("in handle add user 2" + index.value);
    // console.log("in handle add user 3"+index.userRoleId);

    // console.log("in handle add user 2" + this.userRoleList.values);

    this.selectedValue = index.value;
  }

  onOptionsSelected(value: string, index: string) {
    // console.log("the selected value is " + value);
    // console.log("the selected index is " + index.toString);
    // console.log("in handle add user name 4" + index);

    this.selectedValue = index;
    //this.selectedValue=+index.itemSelected.value;
    // console.log("the selected index is " + this.selectedValue);



  }
  onChange(deviceValue: any) {
    // console.log("device" + deviceValue);
    this.values += deviceValue.target.value + ' | ';
    // console.log("values" + this.values);
    let id = <number><unknown>this.values;
    // console.log("xxxxxxxxxxxxyyyyyyyy" + id);

    var a = this.values as string;
    var x = +a;
    // console.log("xxxxxxxxxxxx" + a.toString);

    // console.log("xxxxxxxxxxxx" + x);

  }


  ngOnDestroy(): void {
    this.getAllRoles?.unsubscribe();
    this.add_User?.unsubscribe();
    //  throw new Error('Method not implemented.');
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
