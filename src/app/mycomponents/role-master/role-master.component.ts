import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { RoleMaster } from 'src/app/interfaces/role-master';
import { RoleMasterService } from 'src/app/services/role-master.service';
import { UserMasterService } from 'src/app/services/user-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.css']
})
export class RoleMasterComponent implements OnInit {
  
  constructor(private userMasterService: UserMasterService, 
    private roleMasterService: RoleMasterService, 
    private modalService: NgbModal) {  }

  roleList!: Array<RoleMaster>;
  currentRole!:string;
  changeRoleForm:FormGroup = new FormGroup({
    existingRole: new FormControl(),
    // newName: new FormControl('Search Role', Validators.required),
    newName: new FormControl('', Validators.required)
  });
  addRoleForm:FormGroup = new FormGroup({
    proposedRole: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.roleMasterService.getRoles().subscribe((response:any) => {
      this.roleList = response;
    })
  }

  addNewRole(){
    Swal.fire({
      title: "Are you sure?",
      text: "Once added, you will not be able to delete this role!",
      showCancelButton: true,
      showConfirmButton: true
    })
    .then((alert:any) => {
      if (alert.isConfirmed) {
        this.roleMasterService.addRole(this.addRoleForm.controls['proposedRole'].value).subscribe((res:any)=>{
            // console.log(res);
            Swal.fire({
              text: `${this.addRoleForm.controls['proposedRole'].value} role is added!`,
              icon: "success",
            }).then((res) => {
              this.modalService.dismissAll();
              window.location.reload();
            });
          });
        
      } else {
        Swal.fire({
          text:`${this.addRoleForm.controls['proposedRole'].value} role is not added!`,
          icon:"info"
        }).then(res=>{
          this.modalService.dismissAll();
        });
      }
    });
    // this.roleMasterService.addRole(this.addRoleForm.controls['proposedRole'].value).subscribe((res:any)=>{
    //   console.log(res);
    // });
    // this.modalService.dismissAll();
    // window.location.reload();
  }



  // changeRole(){
  //   let data = {existingRole:this.changeRoleForm.controls['existingRole'].value,
  //   newName: this.changeRoleForm.controls['newName'].value};
  //   this.roleMasterService.updateRole(data).subscribe();
  //   this.modalService.dismissAll();
  //   window.location.reload();
  // }

  
  openEditRole(content: any, currentRole:string) {
    this.modalService.open(content);
    this.changeRoleForm.controls['existingRole'].setValue(currentRole)  ;
    this.changeRoleForm.controls['existingRole'].disable();

  }

  openAddRole(content: any) {
    this.modalService.open(content);
  }

  


}
