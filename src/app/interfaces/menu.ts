import { Submenu } from "./submenu";

export interface Menu {

    id:number;
    menuId:number;
    parentMenuId:number;
    menuDisplayName:string;
    routerName:string;
    menuIconName:string;
    menuStatus:number;
    menuOrderBy:number;

    //subMenuList: Submenu[];
}
