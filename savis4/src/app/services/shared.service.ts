import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private data = new BehaviorSubject<any>(null)
  currentData = this.data.asObservable()

  constructor() { }

  changeData(newData: string) {
    this.data.next(newData)
  }
}
