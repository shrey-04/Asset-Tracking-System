import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-assign-privilege',
  templateUrl: './assign-privilege.component.html',
  styleUrls: ['./assign-privilege.component.css']
})
export class AssignPrivilegeComponent implements OnInit {
  getall_menus?:Subscription;
  menuList!: Array<Menu>;
  message:string;
  opened: boolean=false;
  showMenu = true;
  showSubmenu: any[] = [];
  @Input() subMenuState:any;
  checkedParentMenuIdList:any;
  toggleMenu:boolean=false;
  subMenu: Array<Menu> = [];
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

  selected:any;
  subSelected:any;
  constructor(private menuService:MenuService) { 
    this.message="Loading Data, Please wait...";
    this.checkedParentMenuIdList = [];
  }

  ngOnInit(): void {

    
    // console.log("get all menus");
    this.getall_menus=this.menuService.getAllMenus().subscribe(
      responseData=>{
        // this.menuList= [...responseData];
        for (let i = 0; i < this.menuList.length; i++) {
          for (let j = 0; j < this.menuList.length; j++) {
            if (this.menuList[j].parentMenuId == this.menuList[i].menuId) {
              // this.showSubmenu[index] = !this.showSubmenu[index];
              this.isNested[i] = true;
              break;
            }
          }
        }
        // console.log("responseData"+responseData);
        this.message="Retrieved all Asstes details";
        //this.flag=false;
      },(error:string)=>
      {
        this.message=error;
      }
      );
  }

  getAllPrivileges()
  {
  }

  ngOnChanges(){
    // console.log("inside ngOnChanges with subMenuState: ",this.subMenuState );
    this.showMenu = this.subMenuState;
  }

  
  toogle(menuId: number) {
    this.subMenu = [];
    for (let i = 0; i < this.menuList.length; i++) {
      if (this.menuList[i].parentMenuId == menuId) {
        // this.showSubmenu[index] = !this.showSubmenu[index];
        this.subMenu.push(this.menuList[i]);
      }
    }
    this.toggleMenu = !this.toggleMenu;
  }

  termsChange(selected: any): void {
    // console.log("checkbox"+
    //      selected.target.name,
    //      selected.target.value,
    //      selected.target.checked,
         
    //     // this.checkedParentMenuIdList.push(selected.target.value)
    //    );
     
       if(selected.target.value >0 && selected.target.checked)
       {
        //  console.log("in push");
        this.checkedParentMenuIdList.push(selected.target.value);
        // console.log("in push list"+this.checkedParentMenuIdList);

       }
       else if(selected.target.value >0 )
       {
        // console.log("in remove");
        const index = this.checkedParentMenuIdList.indexOf(selected.target.value);
       // this.checkedParentMenuIdList.remove(selected.target.value);
      //  console.log("removing index"+index);

        if (index !== -1) this.checkedParentMenuIdList.splice(index, 1);
        // console.log("in remove list"+this.checkedParentMenuIdList);

       }
         
      }

   ngOnDestroy(): void {
    this.getall_menus?.unsubscribe();
  }

}
