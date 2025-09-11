import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getSampleDataDirectory(): string {
    return "../sampleData";
  }

  getDefaultValues(): { mean: string, standardDeviation: string } {
    return {
      mean: 'NaN',
      standardDeviation: 'NaN'
    };
  }

  extractDataByColumn(data: any[], columnName: string): any[] {
    return data.map(row => row[columnName]);
  }

  computeDataSimilarity(data1Frequencies: any, data2Frequencies: any): boolean {
    let data1Keys = Object.keys(data1Frequencies);
    let data2Keys = Object.keys(data2Frequencies);
    if (data1Keys.length !== data2Keys.length) {
      return false;
    }
    for (let key of data2Keys) {
      if (data1Frequencies[key] !== data2Frequencies[key]) {
        return false;
      }
    }
    return true;
  }

  computeFrequencies(data: any[]): any {
    let freqs: { [object: number]: any } = {};
    data.forEach((object) => {
      if (freqs.hasOwnProperty(object)) {
        freqs[object] += 1;
      } else {
        freqs[object] = 1;
      }
    });
    return freqs;
  }

  sortAlphaNumString(rawData: string[]): string[] {
    let numbers = rawData.filter(x => !isNaN(Number(x))).sort((a, b) => Number(a) - Number(b)).map(x => `${Number(x)}`);
    let strings = rawData.filter(x => isNaN(Number(x))).sort((a, b) => a.localeCompare(b));

    // For checking if numbers are complete
    const limit = numbers.length;
    for (let it = 0; it < limit; it++) {
      const rest = Number(numbers[it + 1]) - Number(numbers[it]);
      if (rest > 1) {
        for (let jt = 0; jt < rest - 1; jt++) {
          numbers.push(String(Number(numbers[it]) + jt + 1));
        }
      }
    }
    numbers.sort((a, b) => Number(a) - Number(b)).map(x => `${Number(x)}`);
    return numbers.concat(strings);
  }

}