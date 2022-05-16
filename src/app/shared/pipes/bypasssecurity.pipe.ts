import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'bypassSecurity'
})
export class BypassSecurityPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }

  /** Bypass security (use with caution)
   * @params {string} value - String to be bypassed
   * @returns {string} returns bypassed security
   */
  transform(value: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(value);
  }
  
}
