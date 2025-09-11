import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataManipulationService {

    private datasets: { [key: string]: any } = {};

    constructor() {}

    copy(identifier: string): any[] {
        return [...this.datasets[identifier]];
    }

    register(identifier: string, dataset: any[]): void {
        this.datasets[identifier] = dataset;
    }

    get(identifier: string, copy = false): any[] {
        return copy ? this.copy(identifier) : this.datasets[identifier];
    }

    replicate(identifier: string, by: number, each: boolean, copy = false): any[] {
        const data = this.get(identifier, copy);
        let replicatedData: any[] = [];
        if (!each) {
            for (let i = 0; i < by; i++) {
                replicatedData = replicatedData.concat(data);
            }
        } else {
            const elements = new Set(data);
            for (let element of elements) {
                for (let i = 0; i < by; i++) {
                    replicatedData.push(element);
                }
            }
        }
        return replicatedData;
    }

    extract(identifiers: string | string[], transform?: (datasets: any) => any, copy = false): any {
        if (!Array.isArray(identifiers)) {
            identifiers = [identifiers];
        }
        const datasets: { [key: string]: any } = {};
        identifiers.forEach(identifier => {
            datasets[identifier] = this.get(identifier, copy);
        });
        return transform && typeof transform === "function" ? transform(datasets) : datasets;
    }

    isEmpty(identifier?: string): boolean {
        if (!identifier) return Object.keys(this.datasets).length === 0;
        return !this.datasets.hasOwnProperty(identifier) || !this.datasets[identifier];
    }

    combine(identifiers: string[], transform?: (dataset: any, index: number) => any, copy = false): any[] {
        const datasets = this.extract(identifiers, datasets => Object.values(datasets), copy);
        let combined: any[] = [];
        datasets.forEach((dataset: any, index: number) => {
            let temp = dataset;
            if (transform && typeof transform === "function") {
                temp = transform(dataset, index);
            }
            combined = combined.concat(temp);
        });
        return combined;
    }

    property(property: string, identifiers: string[] = []): { [key: string]: any } {
        const datasets = identifiers.length ? this.extract(identifiers) : this.datasets;
        const result: { [key: string]:any } = {};
        Object.keys(datasets).forEach(key => {
            if (this.datasets[key].hasOwnProperty(property)) {
                result[key] = this.datasets[key][property];
            }
        });
        return result;
    }

    thrash(): void {
        this.datasets = {};
    }
}