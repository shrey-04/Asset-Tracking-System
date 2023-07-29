import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Privilege } from '../interfaces/privilege';
import { PrivilegeMap } from '../interfaces/privilege-map';
import { RoleMaster } from '../interfaces/role-master';

@Injectable({
  providedIn: 'root',
})
export class PrivilegeMasterService {
  urlGetAllRoles: string;
  urlGetSingleRole: string;
  urlAssignPrivilege: string;
  // privilegeMap:Array<PrivilegeMap>;
  privilegeMap: Array<PrivilegeMap> = [];
  privilege: Privilege = {
    roleId: undefined,
    id: undefined,
    privilegeMapList: [],
  };
  // privilegeMap:PrivilegeMap[]=[]
  privilegeMapObject: PrivilegeMap = {
    id: undefined,
    menuId: undefined,
    parentMenuId: undefined,
    menuDisplayName: undefined,
    routerName: undefined,
    menuIconName: undefined,
    menuStatus: undefined,
    menuOrderBy: undefined,

    // subMenuList: []
  };
  private headers: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
  });

  constructor(private httpClient: HttpClient) {
    this.urlGetAllRoles = 'http://localhost:8088/role/getRoles/';
    this.urlGetSingleRole = 'http://localhost:8088/role/getRole/';
    this.urlAssignPrivilege =
      'http://localhost:8088/privilege/assignPrivilege/';
    //this.privilegeMap=[];
  }

  getAllRoles(selectedValue: number) {
    //  console.log("in get all role master");
    return this.httpClient.get<Array<RoleMaster>>(
      this.urlGetAllRoles + selectedValue,
      { headers: this.headers }
    );
  }

  getSingleRole(roleId: number) {
    // console.log("in get role"+this.urlGetSingleRole+roleId);

    return this.httpClient.get<RoleMaster>(this.urlGetSingleRole + roleId, {
      headers: this.headers,
    });
  }

  assignPrivilege(roleId?: number, assignedPrivilegeList?: any) {
    // console.log('length is' + assignedPrivilegeList.length);
    for (let i = 0; i < assignedPrivilegeList.length; i++) {
      //  const modal: this.privilegeMapObject = new this.privilegeMapObject(){};
      const privilegeMapObject = {} as PrivilegeMap;
      privilegeMapObject.menuId = assignedPrivilegeList[i];
      //  console.log("object "+i +" this.privilegeMapObject.menuId"+privilegeMapObject.menuId);
      //  console.log("this.privilegeMapObject"+privilegeMapObject);
      this.privilegeMap.push(privilegeMapObject);
    }

    this.privilege.roleId = roleId;
    this.privilege.privilegeMapList = this.privilegeMap;

    return this.httpClient
      .post(this.urlAssignPrivilege, this.privilege, { headers: this.headers })
      .subscribe((data) => {
        // console.log("data"+data);
        // console.log(data);
        // this.assetId = data;
      });
  }
}
