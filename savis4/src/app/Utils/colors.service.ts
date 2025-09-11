import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() { }

  colorGen(number: number, colorType: string): string[] {
    let characters = "0123456789ABCDEF";
    let colorArray: string[] = [];
    for (let i = 0; i < number; i++) {
      let ANCode = '';
      for (let j = 0; j < 6; j++) {
        ANCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      let colorCode = '#' + ANCode;
      let generatedColor = '';
      switch (colorType) {
        case 'rgb':
          let arr = this.hexToRgb(colorCode);
          colorCode = 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')';
          colorArray.push(colorCode);
          break;
        case 'rgba':
          generatedColor = this.hexToRgbA(colorCode);
          colorArray.push(generatedColor);
          break;

        default:
          colorArray.push(colorCode);
          break;
      }
    }
    return colorArray;
  }

  private hexToRgb(hex: string): number[] {
    const result = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g);
    if (result) {
      return result.map(x => parseInt(x, 16));
    }
    return [];
  }

  private hexToRgbA(hex: string): string {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
    }
    throw new Error('Bad Hex');
  }

}