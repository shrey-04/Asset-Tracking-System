import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserMaster } from 'src/app/interfaces/user-master';
import { UserMasterService } from 'src/app/services/user-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {
  getSingle_user?:Subscription;
  singleUserData:UserMaster;
  modify_user?:Subscription;

  message:string;
  userId!: number;
  formSubmitted: boolean = false;

  modifyUserForm: FormGroup = new FormGroup({
    loginId: new FormControl("", Validators.required),
    userName: new FormControl("", Validators.required),
    userRoleName: new FormControl("", Validators.required),
    userEmailId: new FormControl("", Validators.required),
  })
  constructor(private _Activatedroute:ActivatedRoute,private _router:Router
    ,private userMasterService: UserMasterService) {
      this.singleUserData={} as UserMaster;
      this.message="Loading Data, Please wait..."
     }

  ngOnInit(): void {

    this.getSingle_user=this._Activatedroute.paramMap.subscribe(params => {
      // console.log("params are"+params);
      // this.assetString = params.get('assetId');
      this.userId=this._Activatedroute.snapshot.params['userId']
      // console.log("this.role"+this.userId);

   });

  //  console.log("in single role details"+this.userId);
  //  this.getSingle_user=this.userMasterService.getSingleUser(this.userId).subscribe(
  //    responseData=>{
  //      this.singleUserData=responseData;
  //      console.log("responseData"+responseData);

  //      this.message="Retrieved Single Role details";
       
  //    }
  //    ,(error:string)=>
  //    {
  //      this.message=error;
  //    }

  //  );

  }

  // modifyUser(userMaster: UserMaster)
  // {
  //   console.log("in modify user role"+userMaster.id);
  //   console.log("this.uset"+this.userId);
  //   userMaster.id=this.userId;
  //   userMaster.userStatus=4;
  //   this.modify_user=this.userMasterService.modifyUser(userMaster);
  //   Swal.fire({
  //     text: 'User Modified Successfully..',
  //     icon: 'success',
  //     confirmButtonText: 'Ok'
  //   });
  //   console.log("subscribe role master"+this.modify_user);

  // }

  ngOnDestroy(): void {
    this.modify_user?.unsubscribe();
    this.getSingle_user?.unsubscribe();
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
