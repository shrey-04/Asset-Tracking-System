import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/interfaces/menu';
import { PrivilegeMap } from 'src/app/interfaces/privilege-map';
import { RoleMaster } from 'src/app/interfaces/role-master';
import { MenuService } from 'src/app/services/menu.service';
import { PrivilegeMasterService } from 'src/app/services/privilege-master.service';
import { RoleMasterService } from 'src/app/services/role-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-privilege-master',
  templateUrl: './privilege-master.component.html',
  styleUrls: ['./privilege-master.component.css']
})
export class PrivilegeMasterComponent implements OnInit {
  //searchCriteriaList:any=['Awaiting Approval','Approved','Rejected']
  // privilegeList: any = [];
  // getall_roles?: Subscription;
  // message: string;
  // getSingle_role?: Subscription;
  // singleRoleData: RoleMaster;
  // selectedValue: number;
  // closeResult = '';
  // searchCriteriaList: any;

  // getall_menus?: Subscription;
  // opened: boolean = false;
  // showMenu = true;
  // showSubmenu: any[] = [];
  // @Input() subMenuState: any;
  // add_Privilege?: Subscription;

  // toggleMenu: boolean = false;

  // selected: any;
  // subSelected: any;
  // checkedParentMenuIdList: any;
  // roleIdGlobal?: number;


  menuList!: Array<Menu>;
  roleList!: Array<RoleMaster>;
  role!: string;
  assignScreenForm: FormGroup = new FormGroup({
    menuId: new FormArray([], Validators.required),
    role: new FormControl('', Validators.required)
  });
  isNested: Array<boolean> = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  // toggleMenu: boolean[] = [
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  // ];


  constructor(private modalService: NgbModal
    , private menuService: MenuService, private roleMasterService: RoleMasterService
    , private _Activatedroute: ActivatedRoute, private _router: Router) {
    // this.roleList = [];
    // this.message = "Loading Data, Please wait..."
    // this.singleRoleData = {} as RoleMaster;
    // this.selectedValue = 1;
    // this.checkedParentMenuIdList = [];

  }

  ngOnInit(): void {
    this.roleMasterService.getRoles().subscribe((response:any) => {
      this.roleList = response;
    });
    this.menuService.getAllMenus().subscribe((response:any) => {
      this.menuList = response;
      for (let i = 0; i < this.menuList.length; i++) {
        for (let j = 0; j < this.menuList.length; j++) {
          if (this.menuList[j].parentMenuId == this.menuList[i].menuId) {
            this.isNested[i] = true;
            break;
          }
        }
      }
    });

  }

  viewScreens(content:any, role:string){
    this.role = role;
    (this.assignScreenForm.controls['menuId'] as FormArray).clear();
    this.modalService.open(content);
  }

  onChange(menu: Menu, event: Event) {
    const menus = (this.assignScreenForm.controls['menuId'] as FormArray);

    if ((<HTMLInputElement>event.target).checked) {
      if(menu.parentMenuId != 0) {
        if(!menus.controls.find(x => x.value === menu.parentMenuId)) {
          menus.push(new FormControl(menu.parentMenuId));
        }
      }
      menus.push(new FormControl(menu.menuId));
    } else {
      if(menu.parentMenuId != 0) {
        let count = 0;
        this.menuList.filter(val => (val.parentMenuId == menu.parentMenuId && val.menuId != menu.menuId)).forEach(element => {
          menus.controls.forEach(menuId => {
            count = menuId.value == element.menuId ? ++count : count;
          });
        });
        if(count==0){
          menus.removeAt(menus.controls.findIndex(x => x.value === menu.parentMenuId));
        }
      }
      menus.removeAt(menus.controls.findIndex(x => x.value === menu.menuId));
    }
  }

  assignScreen(){
    this.assignScreenForm.controls['role'].setValue(this.role)  ;
    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      showConfirmButton: true
    })
    .then((alert:any) => {
      if (alert.isConfirmed) {
        this.menuService.assignMenuToRole(this.assignScreenForm.value).subscribe((res:any)=>{
            // console.log(res);
            Swal.fire({
              text: `Screens assigned successfully!`,
              icon: "success",
            }).then((res) => {
              this.modalService.dismissAll();
            });
          });
        
      } else {
        Swal.fire({
          text:`Screens not assigned!`,
          icon:"info"
        }).then(res=>{
          this.modalService.dismissAll();
        });
      }
    });
    
    
    // console.log(this.assignScreenForm.value);
    // this.menuService.assignMenuToRole(this.assignScreenForm.value).subscribe();
    // this.modalService.dismissAll();
  }

  

  // handleChange(index: any) {
  //   console.log("in privilege handle" + index.value);
  //   this.selectedValue = index.value;
  // }

  // getSingleRole(roleId: number) {
  //   console.log("in single role details" + roleId);
  //   this.roleIdGlobal = roleId;
  //   this.getSingle_role = this.privilegeMasterService.getSingleRole(roleId).subscribe(
  //     responseData => {
  //       this.singleRoleData = responseData;
  //       console.log("responseData" + responseData);

  //       this.message = "Retrieved Single Role details";

  //     }
  //     , (error: string) => {
  //       this.message = error;
  //     }

  //   );

  // }

  // viewPrivileges(content: any, roleId: any) {
  //   console.log("roleId in privilege" + roleId);
  //   this.roleIdGlobal = roleId;
  //   this.modalService.open(content);
  //   console.log("calling getSingleAssetDetails");
  //   this.getAllPrivileges();
  // }

  // getAllUserRoles() {
  //   console.log("get allroles");
  //   this.getall_roles = this.privilegeMasterService.getAllRoles(this.selectedValue).subscribe(
  //     responseData => {
  //       this.roleList = [...responseData];
  //       console.log("responseData" + responseData);

  //       this.message = "Retrieved all Asstes details";
  //       //this.flag=false;
  //     }, (error: string) => {
  //     this.message = error;
  //   }
  //   );

  // }

  // termsChange(selected: any): void {
  //   console.log("checkbox" +
  //     selected.target.name,
  //     selected.target.value,
  //     selected.target.checked,

  //     // this.checkedParentMenuIdList.push(selected.target.value)
  //   );

  //   if (selected.target.value > 0 && selected.target.checked) {
  //     console.log("in push");
  //     this.checkedParentMenuIdList.push(selected.target.value);
  //     console.log("in push list" + this.checkedParentMenuIdList);

  //     if(selected.target.value==3000)
  //     {
  //       this.checkedParentMenuIdList.push(3050);
  //       this.checkedParentMenuIdList.push(3100);
  //       this.checkedParentMenuIdList.push(3150);
  //     }
  //     if(selected.target.value==4000)
  //     {
  //       this.checkedParentMenuIdList.push(4050);
  //       this.checkedParentMenuIdList.push(4100);
  //     }

  //   }
  //   else if (selected.target.value > 0) {
  //     console.log("in remove");
  //     const index = this.checkedParentMenuIdList.indexOf(selected.target.value);
  //     // this.checkedParentMenuIdList.remove(selected.target.value);
  //     console.log("removing index" + index);

  //     if (index !== -1) this.checkedParentMenuIdList.splice(index, 1);
  //     console.log("in remove list" + this.checkedParentMenuIdList);

  //     if(selected.target.value==3000)
  //     {
  //       const index1 = this.checkedParentMenuIdList.indexOf(3000);
  //       const index2 = this.checkedParentMenuIdList.indexOf(3050);
  //       const index3 = this.checkedParentMenuIdList.indexOf(3100);
  //       const index4 = this.checkedParentMenuIdList.indexOf(3150);

  //       if (index1 !== -1) this.checkedParentMenuIdList.splice(index1, 1);
  //       if (index2 !== -1) this.checkedParentMenuIdList.splice(index2, 1);
  //       if (index3 !== -1) this.checkedParentMenuIdList.splice(index3, 1);
  //       if (index4 !== -1) this.checkedParentMenuIdList.splice(index4, 1);

  //     }
  //     if(selected.target.value==4000)
  //     {
  //       const index5 = this.checkedParentMenuIdList.indexOf(4000);
  //       const index6 = this.checkedParentMenuIdList.indexOf(4050);
  //       const index7 = this.checkedParentMenuIdList.indexOf(4100);

  //       if (index5 !== -1) this.checkedParentMenuIdList.splice(index5, 1);
  //       if (index6 !== -1) this.checkedParentMenuIdList.splice(index6, 1);
  //       if (index7 !== -1) this.checkedParentMenuIdList.splice(index7, 1);

  //     }

  //   }

  // }

  // getAllPrivileges() {
  //   console.log("get all menus");
  //   this.getall_menus = this.menuService.getAllMenus().subscribe(
  //     responseData => {
  //       // this.menuList = [...responseData];
  //       for (let i = 0; i < this.menuList.length; i++) {
  //         for (let j = 0; j < this.menuList.length; j++) {
  //           if (this.menuList[j].parentMenuId == this.menuList[i].menuId) {
  //             // this.showSubmenu[index] = !this.showSubmenu[index];
  //             this.isNested[i] = true;
  //             break;
  //           }
  //         }
  //       }
  //       console.log("responseData" + responseData);
  //       this.message = "Retrieved all Asstes details";
  //       //this.flag=false;
  //     }, (error: string) => {
  //     this.message = error;
  //   }
  //   );

  // }

  // assignPrivileges(roleId?: number) {
  //   this.checkedParentMenuIdList;
  //   console.log("assign privileges " + roleId);
  //   console.log("this.checkedParentMenuIdList " + this.checkedParentMenuIdList);

  //   this.add_Privilege = this.privilegeMasterService.assignPrivilege(roleId, this.checkedParentMenuIdList);
  //   Swal.fire({
  //     text: 'Privilege assigned Successfully..',
  //     icon: 'success',
  //     confirmButtonText: 'Ok'
  //   });

  // }





  ngOnChanges() {
    // console.log("inside ngOnChanges with subMenuState: ", this.subMenuState);
    // this.showMenu = this.subMenuState;
  }


  // toogle(menuId: number) {
  //   this.subMenu = [];
  //   for (let i = 0; i < this.menuList.length; i++) {
  //     if (this.menuList[i].parentMenuId == menuId) {
  //       // this.showSubmenu[index] = !this.showSubmenu[index];
  //       this.subMenu.push(this.menuList[i]);
  //     }
  //   }
  //   this.toggleMenu = !this.toggleMenu;
  // }

  // ngOnDestroy(): void {
  //   this.getall_roles?.unsubscribe();
  //   this.getall_menus?.unsubscribe();
  //   this.getSingle_role?.unsubscribe();
  // }

}
