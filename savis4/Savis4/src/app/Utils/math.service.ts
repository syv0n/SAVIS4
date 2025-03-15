import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() { }

  static mean(itr: any): number {
    let sum = 0;
    let count = 0;
    for (let item of itr) {
      sum += item;
      count += 1;
    }
    return sum / count;
  }

  static stddev(itr: number[]): number {
    return Math.sqrt(this.variance(itr));
  }

  static sampleStddev(itr: number[]): number {
    const n = itr.length;
    if (n <= 1) return NaN;
    const sampleMean = this.mean(itr);
    const devSquare = itr.reduce((acc, x) => {
      return (x - sampleMean) * (x - sampleMean) + acc;
    }, 0);
    return Math.sqrt(devSquare / (n - 1));
  }

  static variance(itr: number[]): number {
    let sum = 0;
    let count = 0;
    let sumOfSquares = 0;
    for (let item of itr) {
      sum += item;
      sumOfSquares += item * item;
      count += 1;
    }
    let mean = sum / count;
    return sumOfSquares / count - mean * mean;
  }

  static roundToPlaces(value: number, places: number): number {
    let pow10 = Math.pow(10, places);
    return Math.round(value * pow10) / pow10;
  }

  static minInArray(arr: number[]): number {
    if (!arr || arr.length === 0) return NaN;
    return arr.reduce((acc, x) => {
      return acc < x ? acc : x;
    }, arr[0]);
  }

  static maxInArray(arr: number[]): number {
    if (!arr || arr.length === 0) return NaN;
    return arr.reduce((acc, x) => {
      return acc > x ? acc : x;
    }, arr[0]);
  }

  static countWhere(itr: any[], p: (item: any) => boolean): number {
    if (itr === undefined || p === undefined) {
      throw new Error("Missing parameter");
    }
    let res = 0;
    for (let item of itr) {
      if (p(item)) {
        res += 1;
      }
    }
    return res;
  }

  static z_value(probability: number): number {
    var Z_MAX = 6;
    let p = probability
    var Z_EPSILON = 0.000001;     /* Accuracy of z approximation */
    var minz = -Z_MAX;
    var maxz = Z_MAX;
    var zval = 0.0;
    var pval;
    if( p < 0.0 ) p = 0.0;
    if( p > 1.0 ) p = 1.0;

    while ((maxz - minz) > Z_EPSILON) {
      pval = this.poz(zval);
      if (pval > p) {
          maxz = zval;
      } else {
          minz = zval;
      }
      zval = (maxz + minz) * 0.5;
    }
    return zval
  }

  static z_score_alpha_2(confidenceLevel: number): number {
    const alpha = (confidenceLevel / 100.0)
    const alpha_over_2 = (1 - alpha) / 2.0
    return Math.abs(this.roundToPlaces(this.z_value(alpha_over_2), 2))
  }

  static getOneMeanConfidenceInterval(confidenceLevel: number, sampleMean: number, populationStd: number, sampleSize: number): [number, number] {
    const z_alpha_2 = this.z_score_alpha_2(confidenceLevel)
    const sampleStd = (populationStd + 0.0) / Math.sqrt(sampleSize)
    const leftBound = sampleMean - (z_alpha_2 * sampleStd)
    const rightBound = sampleMean + (z_alpha_2 * sampleStd)
    return [leftBound, rightBound]
  }

  static getCutOffInterval(confidenceLevel: number, totalSize: number): [number, number] {
    confidenceLevel = confidenceLevel / 100.0
    const alpha2 = (1 - confidenceLevel)/ 2.0
    let lowerBound = alpha2 * totalSize;
    let upperBound = totalSize - (alpha2 * totalSize)
    lowerBound = Math.floor(lowerBound)
    upperBound = Math.floor(upperBound)
    return [lowerBound, upperBound]
  }

  static poz(z: number): number {
    var Z_MAX = 6;

    var y, x, w;
  
    if (z == 0.0) {
        x = 0.0;
    } else {
        y = 0.5 * Math.abs(z);
        if (y > (Z_MAX * 0.5)) {
            x = 1.0;
        } else if (y < 1.0) {
            w = y * y;
            x = ((((((((0.000124818987 * w
                     - 0.001075204047) * w + 0.005198775019) * w
                     - 0.019198292004) * w + 0.059054035642) * w
                     - 0.151968751364) * w + 0.319152932694) * w
                     - 0.531923007300) * w + 0.797884560593) * y * 2.0;
        } else {
            y -= 2.0;
            x = (((((((((((((-0.000045255659 * y
                           + 0.000152529290) * y - 0.000019538132) * y
                           - 0.000676904986) * y + 0.001390604284) * y
                           - 0.000794620820) * y - 0.002034254874) * y
                           + 0.006549791214) * y - 0.010557625006) * y
                           + 0.011630447319) * y - 0.009279453341) * y
                           + 0.005353579108) * y - 0.002141268741) * y
                           + 0.000535310849) * y + 0.999936657524;
        }
    }
    return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
  }

}