import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'limitText'
})
export class LimitTextPipe implements PipeTransform {

  /** Limits the text and returns whatever is defined. three dots is returned by default if
      nothing is defined also default number of characters is 100 if no max characters is specified
   *
   * @param {number} [numberOfCharacters] - number of charaters that will be displayed
   * @param {string} text - Text that will be limited
   * @returns {string} returns limited text with read more text
   */
  transform(text: string, numberOfCharacters?: number | null): string {
    if (numberOfCharacters !== undefined && numberOfCharacters !== null) {
      if (text.length > numberOfCharacters) {
        return `${text.substring(0, numberOfCharacters)}...`;
      }
    }
    if (text.length > 100) {
      return `${text.substring(0, 100)}...`;
    } else {
      return text;
    }
  }

}
