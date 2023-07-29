import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoleMaster } from 'src/app/interfaces/role-master';
import { RoleMasterService } from 'src/app/services/role-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approve-role',
  templateUrl: './approve-role.component.html',
  styleUrls: ['./approve-role.component.css']
})
export class ApproveRoleComponent implements OnInit {
  // getSingle_role?:Subscription;
  // singleRoleData:RoleMaster;
  // message:string;
  // roleId!: number;
  // approve_role?:Subscription;
  // reject_role?:Subscription;
  // formSubmitted:boolean = false;
  // roleMasterObject: RoleMaster;

  
  // approveRoleForm: FormGroup = new FormGroup({
  //   roleCode: new FormControl("", Validators.required),
  //   roleName: new FormControl("", Validators.required),
  //   roleType: new FormControl("", Validators.required),
  //   roleDescription: new FormControl("", Validators.required),
  // })
  constructor(private _Activatedroute:ActivatedRoute,private _router:Router
    ,private roleMasterService: RoleMasterService)
  { 
    // this.singleRoleData={} as RoleMaster;
    // this.message="Loading Data, Please wait..."
    // this.roleMasterObject={} as RoleMaster;

  }
  ngOnInit(): void {

  //   this.getSingle_role=this._Activatedroute.paramMap.subscribe(params => {
  //     console.log("params are"+params);
  //     // this.assetString = params.get('assetId');
  //     this.roleId=this._Activatedroute.snapshot.params['roleId']
  //     console.log("this.role"+this.roleId);

  //  });

  //  console.log("in single role details"+this.roleId);
  //   this.getSingle_role=this.roleMasterService.getSingleRole(this.roleId).subscribe(
  //     responseData=>{
  //       this.singleRoleData=responseData;
  //       console.log("responseData"+responseData);

  //       this.message="Retrieved Single Role details";
        
  //     }
  //     ,(error:string)=>
  //     {
  //       this.message=error;
  //     }

  //   );
  }

  // approveRole()
  // {
  //   if(this.approveRoleForm.valid){
  //     this.formSubmitted = true;
  //     console.log("calling add user");
  //   console.log("in approve role "+this.roleId);
  //   this.roleMasterService.approveRole(this.roleId);
  //   Swal.fire({
  //     text: 'Role Approved Successfully..',
  //     icon: 'success',
  //     confirmButtonText: 'Ok'
  //   });
  //   this.approveRoleForm.reset();
  //   this.formSubmitted = false;
  //   }


  // }
  // rejectRole()
  // {
  //   if(this.approveRoleForm.valid){
  //     this.formSubmitted = true;
  //    // console.log("calling add user");
  //   console.log("in approve role "+this.roleId);
  //   console.log("in reject role"+this.roleId);
  //   this.roleMasterService.rejectRole(this.roleId);
  //   Swal.fire({
  //     text: 'Role Rejected Successfully..',
  //     icon: 'success',
  //     confirmButtonText: 'Ok'
  //   });
  //   }
  // }

  // approveUserRoleNew()
  // {

  //   console.log("this.uset"+this.roleId);
  //   this.roleMasterObject.id=this.roleId;
  //   this.roleMasterObject.userRoleStatus=2;
  //   this.approve_role=this.roleMasterService.approveUserRoleNew(this.roleMasterObject);
  //   Swal.fire({
  //     text: 'Role Approved Successfully..',
  //     icon: 'success',
  //     confirmButtonText: 'Ok'
  //   });
  //   console.log("subscribe role master"+this.approve_role);

  // }

  // rejectUserRoleNew()
  // {

  //   console.log("this.uset"+this.roleId);
  //   this.roleMasterObject.id=this.roleId;
  //   this.roleMasterObject.userRoleStatus=3;
  //   this.approve_role=this.roleMasterService.rejectUserRoleNew(this.roleMasterObject);
  //   Swal.fire({
  //     text: 'Role Rejected Successfully..',
  //     icon: 'success',
  //     confirmButtonText: 'Ok'
  //   });
  //   console.log("subscribe role master"+this.approve_role);

  // }
  // ngOnDestroy(): void {
  //   this.approve_role?.unsubscribe();
  //   this.reject_role?.unsubscribe();
  //   this.getSingle_role?.unsubscribe();
  // //  throw new Error('Method not implemented.');
  // }
}
