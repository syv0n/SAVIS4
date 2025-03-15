import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Sampling {

    constructor() { }

    randomInt(from: number, to: number): number {
        return Math.floor((to - from) * Math.random()) + from;
    }

    shuffle(arr: any[]): any[] {
        let clone = arr.concat([]);
        const swap = (i: number, j: number) => {
            let tmp = clone[i];
            clone[i] = clone[j];
            clone[j] = tmp;
        }
        for (let i = 0; i < arr.length; i++) {
            let swapWith = this.randomInt(i, arr.length);
            swap(i, swapWith);
        }
        return clone;
    }
   

    randomSubset(itr: any, n: number): { chosen: any[], unchosen: any[] } {
        let result = Array(n);
        let unchosen = [];
        let seen = 0;
        for (let item of itr) {
            if (seen < n) {
                result[seen] = item;
            } else if (Math.random() < n / (seen + 1)) {
                let replaceIdx = this.randomInt(0, n);
                unchosen.push(result[replaceIdx]);
                result[replaceIdx] = item;
            } else {
                unchosen.push(item);
            }
            seen += 1;
        }
        if (seen < n) {
            throw new Error("not enough elements");
        }
        return { chosen: result, unchosen };
    }

    splitUsing(itr: any, callback: Function): [any[], any[]] {
        const chosen: any[] = [];
        let unchosen: any[] = [];
        itr.forEach((obj: any, index: number) => {
            if (callback(obj, index)) {
                chosen.push(obj);
            } else {
                unchosen.push(obj);
            }
        });
        return [chosen, unchosen];
    }

    splitByPredicate(itr: any, fn: Function | null): { chosen: any[], unchosen: any[] } {
        const chosen: any[] = [];
        let unchosen = [];
        if (fn === null) unchosen = itr;
        else {
            itr.forEach((x: any) => {
                if (fn(x)) chosen.push(x);
                else unchosen.push(x);
            });
        }
        return { chosen, unchosen };
    }
}