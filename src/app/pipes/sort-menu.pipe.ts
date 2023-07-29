import { Pipe, PipeTransform } from '@angular/core';
import { Menu } from '../interfaces/menu';

@Pipe({
  name: 'sortMenu'
})
export class SortMenuPipe implements PipeTransform {

  transform(value: Array<Menu>): Array<Menu> {
    let menuList = value.sort((a,b) =>{
      if (a.menuId > b.menuId) {
        return 1;
      } else if (a.menuId < b.menuId) {
        return -1;
      }
      else{
        return 0;
      }
    });    
    
    return menuList;
  }

}
