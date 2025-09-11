import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  private csvDataSubject = new BehaviorSubject<string>('');
  csvData$ = this.csvDataSubject.asObservable();

  setCsvData(data: string): void {
    this.csvDataSubject.next(data);
  }
}
