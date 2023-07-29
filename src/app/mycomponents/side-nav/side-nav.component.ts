import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/interfaces/menu';
import { SortMenuPipe } from 'src/app/pipes/sort-menu.pipe';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  @Input() subMenuState: any;

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

  getall_menus?: Subscription;
  menuList!: Array<Menu>;
  message: string;

  opened: boolean = false;
  showMenu = true;
  showSubmenu: any[] = [];
  userRoleId?: number;

  userName!: string | null;
  userRole!: string;

  toggleMenu: boolean[] = [
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

  selected: any;
  subSelected: any;
  constructor(private menuService: MenuService, private sortMenu: SortMenuPipe) {
    this.message = 'Loading Data, Please wait...';
    this.userRoleId = this.getLocalStorageDetails();
    this.userName = localStorage.getItem('name');
    this.userRole = localStorage.getItem('role') || '';
    

    this.menuService.getMenusByRole(this.userRole).subscribe(
        (response:any) => {
          this.menuList = [...response];      
          this.menuList = sortMenu.transform(this.menuList);
          let i;
          for (i = 0; i < this.menuList.length; i++) {
            for (let j = 0; j < this.menuList.length; j++) {
              if (this.menuList[j].parentMenuId == this.menuList[i].menuId) {
                this.isNested[i] = true;
                break;
              }
            }
            
          }

          // this.message = 'Retrieved all Asstes details';
        }
      );
  }

  ngOnInit(): void {
    
  }

  ngOnChanges() {
    this.showMenu = this.subMenuState;
  }

  toogle(menuId: number) {
    this.subMenu = [];

    let index!: number;
    for (let i = 0; i < this.menuList.length; i++) {
      if (this.menuList[i].menuId == menuId) {
        index = this.menuList.indexOf(this.menuList[i]);
      }
      if (this.menuList[i].parentMenuId == menuId) {
        // this.showSubmenu[index] = !this.showSubmenu[index];
        this.subMenu.push(this.menuList[i]);
      }
    }
    if(this.toggleMenu[index] == true){
      this.toggleMenu = [
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
      this.toggleMenu[index] = true;
    }
    else{
      this.toggleMenu = [
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
    }
    // this.toggleMenu = !this.toggleMenu;
    // console.log(this.toggleMenu[index]);

    this.toggleMenu[index] = !this.toggleMenu[index];
    

  }

  ngOnDestroy(): void {
    this.getall_menus?.unsubscribe();
  }

  getLocalStorageDetails(): number {
    var loggedInMessage = localStorage.getItem('loggedInMessage');
    var roleId = localStorage.getItem('userRoleIdStorgae');

    return Number(roleId);
  }
}
