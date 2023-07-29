import { Timestamp } from "rxjs";

export interface UserMaster {
 
    // id:number;


    loginId:string;
    email:string;
    password:string;
    name:string;
    roles:string;
    userCreatedBy :string;
    userCreatedOn :Date;
    

    // userName:string;
    // userEmailId:string;
    // userStatus:number;
    // userRoleId:any;
    // userRoleName:string;
    // userPassword:string;

    
    
    // userModifiedBy:number;
    // userModifiedOn:Date;
    // userVerifiedBy :number;
    // userVerifiedOn: Date;

    // userCreatedByString :string;
    // userModifiedByString: string
    // userVerifiedByString: string;



}
