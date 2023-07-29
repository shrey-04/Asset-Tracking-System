import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RoleMaster } from 'src/app/interfaces/role-master';
import { RoleMasterService } from 'src/app/services/role-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  // roleTypeList: any = ['Admin', 'Supplier', 'Warehouse', 'Carrier', 'Super User', 'End User']
  // add_role?: Subscription;
  // formSubmitted: boolean = false;

  // createRoleForm: FormGroup = new FormGroup({
  //   roleCode: new FormControl('', Validators.required),
  //   roleName: new FormControl('', Validators.required),
  //   roleType: new FormControl('', Validators.required),
  //   roleDescription: new FormControl('', Validators.required),
  // })

  constructor(private roleMasterService: RoleMasterService) { }

  ngOnInit(): void {
  }


  // addUserRole(roleMaster: RoleMaster) {
  //   console.log("in add user role");
  //   console.log("in add user role"+roleMaster.roleCode);
  //   console.log("in add user role"+roleMaster.roleName);
  //   console.log("in add user role"+roleMaster.roleType);
  //   console.log("in add user role"+roleMaster.roleDescription);

  //   if (this.createRoleForm.valid) {
  //     console.log("in add user role if");
  //     this.formSubmitted = true;
  //     console.log("calling add user");
  //     this.add_role = this.roleMasterService.addRole(roleMaster);
  //     Swal.fire({
  //       text: 'Role Created Successfully..',
  //       icon: 'success',
  //       confirmButtonText: 'Ok'
  //     });
  //     this.createRoleForm.reset();
  //     this.formSubmitted = false;
  //     console.log("subscribe role master" + this.add_role);

  //   }
  //   else{
  //     console.log("in add user role else");
  //     console.log("errors"+this.createRoleForm.value);
  //   }

  // }

  // ngOnDestroy(): void {
  //   this.add_role?.unsubscribe();
  //   //  throw new Error('Method not implemented.');
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
