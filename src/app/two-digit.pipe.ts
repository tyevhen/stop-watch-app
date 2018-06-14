import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoDigit'
})

export class TwoDigitPipe implements PipeTransform {

  transform(number: number): string {
    let timeFormatted: string = "";
    // if (number) {
      let strTime = number.toString();
      if (strTime.length === 1 ) {
        timeFormatted = "0"+strTime;
        return timeFormatted;
      } else {
        return strTime;
      }
    // } 
  }
}
