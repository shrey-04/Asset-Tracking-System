import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { RoleMaster } from 'src/app/interfaces/role-master';
import { UserMaster } from 'src/app/interfaces/user-master';
import { RoleMasterService } from 'src/app/services/role-master.service';
import { UserMasterService } from 'src/app/services/user-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {
  
  constructor(private userMasterService: UserMasterService, 
    private roleMasterService: RoleMasterService, 
    private modalService: NgbModal) {


  }

  isUserList:boolean = false;
  userList!: Array<UserMaster>;
  roleList!: Array<RoleMaster>;
  changeRoleForm:FormGroup = new FormGroup({
    emailId: new FormControl(),
    roleToUpdate: new FormControl('Search Role', Validators.required)
  });
  addUserForm:FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    role: new FormControl('Search Role', Validators.required),
  })


  ngOnInit(): void {
    this.roleList = [];
    this.roleMasterService.getRoles().subscribe((response:any) => {
      this.roleList = response;
    })
  }


  getUsersByRole(event: any){
    this.userList = [];
    this.isUserList = false
    this.userMasterService.getUsersByRole(event.target.value).subscribe((res:any) => {
      // console.log("-------------------", res.status);
      this.isUserList = true;
      this.userList = res
    });
  }

  changeUserRole(){

    let data = {emailId:this.changeRoleForm.controls['emailId'].value,
    roleToUpdate: this.changeRoleForm.controls['roleToUpdate'].value};

    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      showConfirmButton: true
    })
    .then((alert:any) => {
      if (alert.isConfirmed) {
        this.userMasterService.updateUserRole(data).subscribe((res:any)=>{
            // console.log(res);
            Swal.fire({
              text: `Role updated successfully!`,
              icon: "success",
            }).then((res) => {
              this.modalService.dismissAll();
              window.location.reload();
            });
          });
        
      } else {
        Swal.fire({
          text:`Role not updated!`,
          icon:"info"
        }).then(res=>{
          this.modalService.dismissAll();
        });
      }
    });
    
    
    // this.userMasterService.updateUserRole(data).subscribe();
    // this.modalService.dismissAll();
    // window.location.reload();
  }

  deleteUser(loginId:string){
    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      showConfirmButton: true
    })
    .then((alert:any) => {
      if (alert.isConfirmed) {
        this.userMasterService.deleteUser(loginId).subscribe((res:any)=>{
            // console.log(res);
            Swal.fire({
              text: `User deleted successfully!`,
              icon: "success",
            }).then((res) => {
              // this.modalService.dismissAll();
              window.location.reload();
            });
          });
        
      } else {
        Swal.fire({
          text:`User not deleted!`,
          icon:"info"
        });
      }
    });
    // console.log(loginId);
    // this.userMasterService.deleteUser(loginId).subscribe()
    // window.location.reload();
  }

  addNewUser(){

    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      showConfirmButton: true
    })
    .then((alert:any) => {
      if (alert.isConfirmed) {
        this.userMasterService.addAdmin(this.addUserForm.value).subscribe((res:any)=>{
            // console.log(res);
            Swal.fire({
              text: `User successfully added!`,
              icon: "success",
            }).then((res) => {
              this.modalService.dismissAll();
              window.location.reload();
            });
          });
        
      } else {
        Swal.fire({
          text:`User not added!`,
          icon:"info"
        }).then(res=>{
          this.modalService.dismissAll();
        });
      }
    });
    
  }

  openEditUserRole(content: any, email:string) {
    this.modalService.open(content);
    this.changeRoleForm.controls['emailId'].setValue(email)  ;
    this.changeRoleForm.controls['emailId'].disable();
  }

  openAddUser(content: any) {
    this.modalService.open(content);
  }
  

}
