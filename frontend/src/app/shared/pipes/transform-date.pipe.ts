import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDate'
})
export class TransformDatePipe implements PipeTransform {

  /** Gets date and time and trasnforms to date
  * @param{Date} value - Date value
  * @returns {string} returns extracted date
  */
  transform(value: Date): string {
    if (value !== undefined) {
      let extractedTime = value.toString().split('T');
      return extractedTime[0].split(':')[0];
    } else {
      return value;
    }
  }

}
