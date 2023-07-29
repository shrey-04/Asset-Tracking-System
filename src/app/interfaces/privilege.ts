import { PrivilegeMap } from "./privilege-map";

export interface Privilege {

    id?:number;
    roleId?:number;
    privilegeMapList?: PrivilegeMap[];
}
