import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private numberOfSimulationsSubject = new BehaviorSubject<number>(0);
  numberOfSimulations$ = this.numberOfSimulationsSubject.asObservable();

  setNumberOfSimulations(value: number): void {
    this.numberOfSimulationsSubject.next(value);
  }
}
