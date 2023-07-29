import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleConverter'
})
export class RoleConverterPipe implements PipeTransform {

  transform(value: string): string {

    value = value.substring(5).toLowerCase();

    return value;
  }

}
