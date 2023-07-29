import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserMaster } from 'src/app/interfaces/user-master';
import { UserMasterService } from 'src/app/services/user-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approve-user',
  templateUrl: './approve-user.component.html',
  styleUrls: ['./approve-user.component.css']
})
export class ApproveUserComponent implements OnInit {
  getSingle_user?: Subscription;
  singleUserData: UserMaster;
  message: string;
  userId!: number;
  approve_user?: Subscription;
  reject_user?: Subscription;
  formSubmitted: boolean = false;
  userMasterObject: UserMaster;

  approveUserForm: FormGroup = new FormGroup({
    loginId: new FormControl("", Validators.required),
    userName: new FormControl("", Validators.required),
    userRoleName: new FormControl("", Validators.required),
    userEmailId: new FormControl("", Validators.required),
  })


  constructor(private _Activatedroute: ActivatedRoute, private _router: Router
    , private userMasterService: UserMasterService) {

    this.singleUserData = {} as UserMaster;
    this.message = "Loading Data, Please wait..."
    this.userMasterObject={} as UserMaster;
  }

  ngOnInit(): void {

    this.getSingle_user = this._Activatedroute.paramMap.subscribe(params => {
      // console.log("params are" + params);
      // this.assetString = params.get('assetId');
      this.userId = this._Activatedroute.snapshot.params['userId']
      // console.log("this.role" + this.userId);

    });

    // console.log("in single role details" + this.userId);
    // this.getSingle_user = this.userMasterService.getSingleUser(this.userId).subscribe(
    //   responseData => {
    //     this.singleUserData = responseData;
    //     console.log("responseData" + responseData);

    //     this.message = "Retrieved Single User details";

    //   }
    //   , (error: string) => {
    //     this.message = error;
    //   }

    // );

  }

  // approveUserNew()
  // {

  //   console.log("this.uset"+this.userId);
  //   this.userMasterObject.id=this.userId;
  //   this.userMasterObject.userStatus=2;
  //   this.approve_user=this.userMasterService.approveUserNew(this.userMasterObject);
  //   Swal.fire({
  //     text: 'User Approved Successfully..',
  //     icon: 'success',
  //     confirmButtonText: 'Ok'
  //   });
  //   console.log("subscribe role master"+this.approve_user);

  // }

  // rejectUserNew()
  // {

  //   console.log("this.uset"+this.userId);
  //   this.userMasterObject.id=this.userId;
  //   this.userMasterObject.userStatus=3;
  //   this.approve_user=this.userMasterService.rejectUserNew(this.userMasterObject);
  //   Swal.fire({
  //     text: 'User Rejected Successfully..',
  //     icon: 'success',
  //     confirmButtonText: 'Ok'
  //   });
  //   console.log("subscribe role master"+this.approve_user);

  // }

  // approveUser() {
  //   if (this.approveUserForm.valid) {
  //     this.formSubmitted = true;
  //     console.log("calling approve user");
  //     console.log("in approve role " + this.userId);
  //     this.userMasterService.approveUser(this.userId);
  //     Swal.fire({
  //       text: 'User Approved Successfully..',
  //       icon: 'success',
  //       confirmButtonText: 'Ok'
  //     });
  //     //this.approveUserForm.reset();
  //     //this.formSubmitted = false;

  //   }


  // }
  // rejectUser() {
  //   if (this.approveUserForm.valid) {
  //     this.formSubmitted = true;
  //     console.log("calling reject user");
  //     // console.log("in approve role "+this.userId);
  //     console.log("in reject role" + this.userId);
  //     this.userMasterService.rejectUser(this.userId);
  //     Swal.fire({
  //       text: 'User Rejected Successfully..',
  //       icon: 'success',
  //       confirmButtonText: 'Ok'
  //     });
  //   }
  // }
  ngOnDestroy(): void {
    this.approve_user?.unsubscribe();
    this.reject_user?.unsubscribe();
    this.getSingle_user?.unsubscribe();
    //  throw new Error('Method not implemented.');
  }

}
