import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartPoint } from 'chart.js';

@Component({
  selector: 'app-two-proportions-ci',
  templateUrl: './two-proportions-ci.component.html',
  styleUrls: ['./two-proportions-ci.component.scss'],
})
export class TwoProportionsCIComponent implements AfterViewInit {
  @ViewChild('chart1') chart1Ref: ElementRef<HTMLCanvasElement>;
  @ViewChild('chart2') chart2Ref: ElementRef<HTMLCanvasElement>;
  @ViewChild('chart3') chart3Ref: ElementRef<HTMLCanvasElement>;

  chart1: Chart;
  chart2: Chart;
  chart3: Chart;

  factor: number = 10;

  numASuccesses: number = 0;
  numAFailures: number = 0;
  numBSuccesses: number = 0;
  numBFailures: number = 0;

  simASuccesses: number = NaN;
  simAFailures: number = NaN;
  simBSuccesses: number = NaN;
  simBFailures: number = NaN;

  confidenceLevel: number = 95;

  simulations: any[] = [];
  numSimulations: number = 1;

  inputProportionsGroupA = 'NaN';
  inputProportionsGroupB = 'NaN';
  inputDifferenceProportions = 'NaN';

  simulationProportionGroupA = 'NaN';
  simulationProportionGroupB = 'NaN';
  simulationDifferenceProportions = 'NaN';
  simMean = 'NaN';
  simStdDev = 'NaN';
  simTotal = 'NaN';

  lowerBound = 'NaN';
  upperBound = 'NaN';

  constructor(public translate: TranslateService) {}

  ngAfterViewInit(): void {
    this.createChart1();
    this.createChart2();
    this.createChart3();
  }

  createChart1() {
    const ctx = this.chart1Ref.nativeElement.getContext('2d');
    if (ctx) {
      this.chart1 = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            this.translate.instant('tpci_group_A'),
            this.translate.instant('tpci_group_B'),
          ],
          datasets: [
            {
              label: '% ' + this.translate.instant('tpci_successes'),
              backgroundColor: 'green',
              data: [0, 0],
            },
            {
              label: '% ' + this.translate.instant('tpci_failures'),
              backgroundColor: 'red',
              data: [0, 0],
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  max: 100,
                },
              },
            ],
            yAxes: [
              {
                id: 'groupAAxis',
                stacked: true,
                ticks: {
                  max: 100,
                },
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }

  createChart2() {
    const ctx = this.chart2Ref.nativeElement.getContext('2d');
    if (ctx) {
      this.chart2 = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            this.translate.instant('tpci_group_A'),
            this.translate.instant('tpci_group_B'),
          ],
          datasets: [
            {
              label: '% ' + this.translate.instant('tpci_successes'),
              backgroundColor: 'green',
              data: [0, 0],
            },
            {
              label: '% ' + this.translate.instant('tpci_failures'),
              backgroundColor: 'red',
              data: [0, 0],
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  max: 100,
                },
              },
            ],
            yAxes: [
              {
                id: 'groupAAxis',
                stacked: true,
                ticks: {
                  max: 100,
                },
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }

  createChart3() {
    const ctx = this.chart3Ref.nativeElement.getContext('2d');
    if (ctx) {
      this.chart3 = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('tpci_values_in_interval'),
              backgroundColor: 'green',
              data: [],
            },
            {
              label: this.translate.instant('tpci_values_not_in_interval'),
              backgroundColor: 'red',
              data: [],
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  max: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: '',
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  stepSize: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: '',
                },
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontStyle: '16',
          },
          animation: {
            duration: 0,
          },
          elements: {
            point: {
              radius: 10,
            },
          },
        },
      });
    }
  }

  loadData() {
    let numASuccess = this.numASuccesses * 1;
    let numAFailures = this.numAFailures * 1;
    let numBSuccesses = this.numBSuccesses * 1;
    let numBFailures = this.numBFailures * 1;

    if (
      numASuccess <= 0 ||
      numAFailures <= 0 ||
      numBSuccesses <= 0 ||
      numBFailures <= 0
    ) {
      alert(this.translate.instant('tpci_alert'));
    } else {
      this.resetLastChart();

      this.inputProportionsGroupA = (
        numASuccess /
        (numASuccess + numAFailures)
      ).toString();
      this.inputProportionsGroupB = (
        numBSuccesses /
        (numBSuccesses + numBFailures)
      ).toString();
      this.inputDifferenceProportions = (
        Number(this.inputProportionsGroupA) -
        Number(this.inputProportionsGroupB)
      ).toString();

      this.setProportions(this.chart1, {
        numASuccess,
        numAFailures,
        numBSuccesses,
        numBFailures,
      });
      this.chart1.update();

      this.setProportions(this.chart2, {
        numASuccess: 0,
        numAFailures: 0,
        numBSuccesses: 0,
        numBFailures: 0,
      });
      this.chart2.update();
    }
  }

  samplePot(total: any, success: any, sampleSize: any) {
    const items = new Array(total);
    items.fill(0);
    items.fill(1, 0, success);
    const shuffled = this.shuffle(items);
    const { chosen } = this.randomSubset(shuffled, sampleSize);
    const successes = this.countWhere(chosen, (data: any) => data == 1);
    const failures = sampleSize - successes;

    return {
      successes,
      failures,
      sampleSize,
      prop: successes / (sampleSize + 0.0),
    };
  }

  runSimulation() {
    let numSimulations = this.numSimulations * 1;

    for (let simIdx = 0; simIdx < numSimulations; simIdx++) {
      let numASuccess = this.numASuccesses * this.factor;
      let numAFailures = this.numAFailures * this.factor;
      let numBSuccess = this.numBSuccesses * this.factor;
      let numBFailures = this.numBFailures * this.factor;
      let totalGroupA = numASuccess + numAFailures;
      let totalGroupB = numBSuccess + numBFailures;
      const {
        successes: sampleASuccess,
        failures: sampleAFailure,
        sampleSize: totalA,
        prop: sampleAProportion,
      } = this.samplePot(
        totalGroupA,
        numASuccess,
        this.numAFailures + this.numASuccesses
      );
      const {
        successes: sampleBSuccess,
        failures: sampleBFailure,
        sampleSize: totalB,
        prop: sampleBProportion,
      } = this.samplePot(
        totalGroupB,
        numBSuccess,
        this.numBFailures + this.numBSuccesses
      );

      this.simulations.push(sampleAProportion - sampleBProportion);

      if (simIdx + 1 === numSimulations) {
        this.setProportions(this.chart2, {
          numASuccess: sampleASuccess,
          numAFailures: sampleAFailure,
          numBSuccesses: sampleBSuccess,
          numBFailures: sampleBFailure,
        });

        this.simAFailures = sampleAFailure;
        this.simASuccesses = sampleASuccess;
        this.simBFailures = sampleBFailure;
        this.simBSuccesses = sampleBSuccess;

        this.simulationProportionGroupA = sampleAProportion.toString();
        this.simulationProportionGroupB = sampleBProportion.toString();
        this.simulationDifferenceProportions = (
          sampleAProportion - sampleBProportion
        ).toString();
        this.simMean = this.mean(this.simulations).toString();
        this.simStdDev = this.stddev(this.simulations).toString();
        this.simTotal = this.simulations.length.toString();

        this.updateLastChart();
      }
    }
    this.chart2.update();
  }

  updateLastChart() {
    const confidenceLevel = this.confidenceLevel || 0;
    if (confidenceLevel == 0) {
      return;
    }

    const [lower, upper] = this.getCutOffInterval(
      confidenceLevel,
      this.simulations.length
    );
    const temp = this.simulations.map((val) => val);
    temp.sort((a, b) => a - b);

    const [chosen, unchosen] = this.splitUsing(
      temp,
      (val: number, index: any) => {
        return (
          val >= temp[lower] &&
          val <= temp[upper >= temp.length ? upper - 1 : upper]
        );
      }
    );

    this.lowerBound = temp[lower].toString();
    this.upperBound = temp[upper >= temp.length ? upper - 1 : upper].toString();

    const shift = temp.length < 500 ? 0 : 0;
    this.setScale(this.chart3, temp[0] - shift, temp[temp.length - 1] + shift);
    this.setDataFromRaw(this.chart3, [chosen, unchosen]);
    this.scaleToStackDots(this.chart3);
    this.chart3.update();
  }

  resetLastChart() {
    this.chart3.data.datasets[0].data = [];
    this.chart3.data.datasets[1].data = [];
    this.confidenceLevel = 95;
    this.simulations = [];
    this.chart3.update();
  }

  setProportions(
    chart: any,
    {
      numASuccess,
      numAFailures,
      numBSuccesses,
      numBFailures,
    }: {
      numASuccess: any;
      numAFailures: any;
      numBSuccesses: any;
      numBFailures: any;
    }
  ) {
    let totalInA = numASuccess + numAFailures;
    let totalInB = numBSuccesses + numBFailures;
    let totalSuccess = numASuccess + numBSuccesses;
    let totalFailures = numAFailures + numBFailures;

    chart.data.datasets[0].data[0] = (100 * numASuccess) / totalInA;
    chart.data.datasets[0].data[1] = (100 * numBSuccesses) / totalInB;
    chart.data.datasets[1].data[0] = (100 * numAFailures) / totalInA;
    chart.data.datasets[1].data[1] = (100 * numBFailures) / totalInB;
  }

  shuffle(arr: any[]) {
    let clone = arr.concat([]);
    function swap(i: any, j: any) {
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

  randomInt(from: any, to: any) {
    return Math.floor((to - from) * Math.random()) + from;
  }

  randomSubset(itr: any, n: any) {
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
      throw new Error('not enough elements');
    }
    return { chosen: result, unchosen };
  }

  countWhere(itr: any, p: any) {
    if (itr === undefined || p === undefined) {
      throw new Error('Missing parameter');
    }
    let res = 0;
    for (let item of itr) {
      if (p(item)) {
        res += 1;
      }
    }
    return res;
  }

  mean(itr: any) {
    let sum = 0;
    let count = 0;
    for (let item of itr) {
      sum += item;
      count += 1;
    }
    return sum / count;
  }

  stddev(itr: any) {
    return Math.sqrt(this.variance(itr));
  }

  variance(itr: any) {
    let sum = 0;
    let count = 0;
    let sumOfSquares = 0;
    for (let item of itr) {
      sum += item;
      sumOfSquares += item * item;
      count += 1;
    }
    let mean = sum / count;
    // variance = sum(X^2) / N - mean(X)^2
    return sumOfSquares / count - mean * mean;
  }

  getCutOffInterval(confidenceLevel: any, totalSize: any) {
    confidenceLevel = confidenceLevel / 100.0;
    const alpha2 = (1 - confidenceLevel) / 2.0;
    let lowerBound = alpha2 * totalSize;
    let upperBound = totalSize - alpha2 * totalSize;
    lowerBound = Math.floor(lowerBound);
    upperBound = Math.floor(upperBound);
    return [lowerBound, upperBound];
  }

  splitUsing(itr: any, callback: any) {
    const chosen: any[] = [];
    let unchosen: any[] = [];
    itr.forEach((obj: any, index: any) => {
      if (callback(obj, index)) {
        chosen.push(obj);
      } else {
        unchosen.push(obj);
      }
    });
    return [chosen, unchosen];
  }

  setScale(chart: Chart, start: any, end: any) {
    chart.options.scales.xAxes[0].ticks.min = Math.floor(start)
      ? Math.floor(start)
      : 0;
    chart.options.scales.xAxes[0].ticks.max = Math.ceil(end) + 1;
  }

  setDataFromRaw(chart: Chart, rawDataArrays: any) {
    let scatterArrays = this.rawToScatter(rawDataArrays);
    for (let idx = 0; idx < rawDataArrays.length; idx++) {
      chart.data.datasets[idx].data = scatterArrays[idx];
    }
    let max = 1;
    for (let dataset of scatterArrays) {
      for (let item of dataset) {
        max = Math.max(max, item.y);
      }
    }
  }

  rawToScatter(arrs: any) {
    let faceted = [];
    let counts: { [key: string]: number } = {};
    for (let arr of arrs) {
      let scatter = [];
      for (let item of arr) {
        let y = (counts[item] = (counts[item] || 0) + 1);
        scatter.push({ x: item, y: y });
      }
      faceted.push(scatter);
    }
    return faceted;
  }

  scaleToStackDots(chart: any) {
    let max = 1;
    for (let dataset of chart.data.datasets) {
      for (let item of dataset.data) {
        max = Math.max(max, Number((item as ChartPoint).y));
      }
    }

    chart.options.scales.yAxes[0].ticks.stepSize =
      max > 10 ? Math.ceil(max * 0.2) : 1;
    if (max > 1000) {
      chart.options.scales.yAxes[0].ticks.min = 0;
    }
  }
}
