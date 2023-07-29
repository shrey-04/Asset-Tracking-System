import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoleMaster } from 'src/app/interfaces/role-master';
import { RoleMasterService } from 'src/app/services/role-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-role',
  templateUrl: './modify-role.component.html',
  styleUrls: ['./modify-role.component.css']
})
export class ModifyRoleComponent implements OnInit {
  // getSingle_role?:Subscription;
  // singleRoleData:RoleMaster;
  // modify_role?:Subscription;
  // formSubmitted: boolean = false;

  // message:string;
  // roleId!: number;

  // modifyRoleForm: FormGroup = new FormGroup({
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

//   modifyUserRole(roleMaster: RoleMaster)
//   {
//     console.log("in modify user role"+roleMaster.id);
//     console.log("this.role"+this.roleId);
//     roleMaster.id=this.roleId;
//     roleMaster.userRoleStatus=4;
//     this.modify_role=this.roleMasterService.modifyRole(roleMaster);
//     Swal.fire({
//       text: 'Role Modified Successfully..',
//       icon: 'success',
//       confirmButtonText: 'Ok'
//     });
//     console.log("subscribe role master"+this.modify_role);

//   }

//    ModifyControl($scope: { id: any; }) {
//     this.roleId=$scope.id
//     console.log("roleId"+this.roleId)
//  }
//  ngOnDestroy(): void {
//   this.modify_role?.unsubscribe();
//   this.getSingle_role?.unsubscribe();
// //  throw new Error('Method not implemented.');
// }
// getValidationMessages(formControl: any) {
//   let messages: string[] = [];
//   if (formControl.errors) {
//     for (let errorName in formControl.errors) {
//       switch (errorName) {
//         case 'required':
//           messages.push(`This field is required`);
//           break;
//         case 'pattern':
//           messages.push(`This field contain illegal character`);
//           break;
//         case 'minlength':
//           messages.push(`This field must contain 10 digits `);
//           break;
//         case 'maxlength':
//           messages.push(`This field must contain 10 digits`);
//           break;
//       }
//     }
//   }
//   return messages;
// }


}
