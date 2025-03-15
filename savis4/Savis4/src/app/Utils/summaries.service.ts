import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor() { }

  loadSummaryElements(dom: Document): Record<string, Element[]> {
    let summaryElements: Record<string, Element[]> = {};
    let summaryElementList = dom.querySelectorAll('[summary]');
    for (let summaryElement of Array.from(summaryElementList)) {
      let key = summaryElement.getAttribute('summary');
      if (key !== null && !summaryElements[key]) {
        summaryElements[key] = [];
      }
      if (key !== null) {
        summaryElements[key].push(summaryElement);
      }
    }
    return summaryElements;
  }

  updateSummaryElements(summaryElements: Record<string, Element[]>, state: Record<string, any>): void {
    for (let [key, value] of Object.entries(state)) {
      let elems = summaryElements[key];
      if (elems) {
        for (let summaryElem of elems) {
          if (summaryElem.hasAttribute('summaryint')) {
            value = Math.round(value);
          }
          else if (typeof value === 'number') {
            value = value.toFixed(2);
          }
          (summaryElem as HTMLElement).innerText = value + '';
        }
      }
    }
  }
}