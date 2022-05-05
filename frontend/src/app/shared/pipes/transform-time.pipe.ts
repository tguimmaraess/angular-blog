import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformTime'
})
export class TransformTimePipe implements PipeTransform {

  /** Gets date and time and transforms to time
  * @param{Date} value - Date value
  * @returns {string} returns extracted time
  */
  transform(value: Date): string {
    if (value !== undefined) {
      let extractedTime = value.toString().split('T').join(':').split(':');
      return `${extractedTime[1]}:${extractedTime[2]}`;
    } else {
      return value;
    }
  }

}
