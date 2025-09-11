import { Injectable } from '@angular/core';
import { StackedDotChartService } from './stacked-dot-chart.service';
import { MathService } from './math.service';
import { SummaryService } from './summaries.service';
import { SamplingService } from './sampling.service';

@Injectable({
  providedIn: 'root'
})
export class TailchartService {

  tailDirection: string | null = null;
  minTailVal = 0;
  maxTailVal = 1;
  whatAreWeRecording?: string;
  dom: any;
  chart: any;
  summaryElements: any = {};
  results: any[] = [];
  tailInput?: number;
  summary: any

  constructor(
    private MathUtil: MathService,
    private Summaries: SummaryService,
    private Sampling: SamplingService,
    private stackedDotChart: StackedDotChartService,
  ) { }

  initialize(config: any): void {
    let {
      chartElement,
      whatAreWeRecording,
      summaryElements = {},
    } = config;

    // FIXME: Not sure what translation is used for here
    // this.whatAreWeRecording = whatAreWeRecording || translation.twoMean.Samples;
    this.dom = { chartElement };
    this.chart = this.stackedDotChart.initChart(
      chartElement,
      [
        { label: this.whatAreWeRecording, backgroundColor: "green", data: [] },
        { label: "N/A", backgroundColor: "red", data: [] }
      ]
    );
    this.summaryElements = summaryElements;
    this.updateChartLabels();
  }

  reset() {
    this.tailDirection = null;
    this.tailInput = 0;
    this.dropResults();
  }

  addResult(result: any, skipCallback: any) {
    this.results.push(MathService.roundToPlaces(result, 4));
    this.updateSummary();
  }

  addAllResults(results: any) {
    for (let result of results) {
      this.results.push(MathService.roundToPlaces(result, 4));
    }
    this.updateSummary();
  }

  dropResults() {
    this.results = [];
  }

  updateSummary() {
    const { chosen, unchosen } = SamplingService.splitByPredicate(
      this.results,
      this.predicateForTail2(0)
    );
    this.summary = {
      total: this.results.length,
      mean: MathService.roundToPlaces(MathService.mean(this.results), 4),
      stddev: MathService.roundToPlaces(MathService.stddev(this.results), 4),
      chosen: chosen.length,
      unchosen: unchosen.length,
    }
    this.summary.proportion = MathService.roundToPlaces(this.summary.chosen / this.summary.total, 4),

      this.updateChart();
  }

  setTailDirection(tailDirection: string) {
    this.tailDirection = tailDirection;
    this.updateSummary();
  }
  setTailInput(/*tailInput*/min: any, max: any) {
    //this.tailInput = tailInput;
    if (!min && min !== 0) min = MathService.minInArray(this.results);
    if (!max && max !== 0) max = MathService.maxInArray(this.results);
    this.minTailVal = MathService.roundToPlaces(min, 4);
    this.maxTailVal = MathService.roundToPlaces(max, 4);
    this.updateSummary();
  }

  updateChartLabels(/*mean*/) {
    let word = this.whatAreWeRecording;
    //let roundedInput = MathUtil.roundToPlaces(this.tailInput, 4);
    if (this.tailDirection === "closed") {
      this.chart.updateLabelName(0,
        this.minTailVal + ' ≤ ' + word + ' ≤ ' + this.maxTailVal);
      this.chart.updateLabelName(1,
        word + ' < ' + this.minTailVal + '  ⋃  ' + this.maxTailVal + ' < ' + word);
    } else if (this.tailDirection === "left") {
      this.chart.updateLabelName(0,
        this.minTailVal + ' ≤ ' + word + ' < ' + this.maxTailVal);
      this.chart.updateLabelName(1,
        word + ' < ' + this.minTailVal + '  ⋃  ' + this.maxTailVal + ' ≤ ' + word);
    } else if (this.tailDirection === "right") {
      this.chart.updateLabelName(0,
        this.minTailVal + ' < ' + word + ' ≤ ' + this.maxTailVal);
      this.chart.updateLabelName(1,
        word + ' ≤ ' + this.minTailVal + '  ⋃  ' + this.maxTailVal + ' < ' + word);
    } else if (this.tailDirection === "open") {
      this.chart.updateLabelName(0,
        this.minTailVal + ' < ' + word + ' < ' + this.maxTailVal);
      this.chart.updateLabelName(1,
        word + ' ≤ ' + this.minTailVal + '  ⋃  ' + this.maxTailVal + ' ≤ ' + word);
    } else {
      this.chart.updateLabelName(0, word);
      this.chart.updateLabelName(1, "N/A");
    }
  }
  
  getSummary() {
    return this.summary;
  }
  predicateForTail(left: any, right: any) {
    if (this.tailDirection == 'closed') {
      return function (x: any) {
        return x >= Number(left) && x <= Number(right);
      }
    } else if (this.tailDirection == 'left') {
      return function (x: any) {
        return x >= Number(left) && x < Number(right);
      }
    } else if (this.tailDirection == 'right') {
      return function (x: any) {
        return x > Number(left) && x <= Number(right);
      }
    } else if (this.tailDirection == 'open') {
      return function (x: any) {
        return x > Number(left) && x < Number(right);
      }
    } else return null;
  }

  predicateForTail2(mean:any) {
    let tailInput:any = this.tailInput;
    if (this.tailDirection == null || this.tailDirection == 'null') {
      return null;
    } else if (this.tailDirection === "oneTailRight") {
      return (x:any) => x >= tailInput;
    } else if (this.tailDirection === "oneTailLeft") {
      return (x:any) => x <= tailInput;
    } else {
      const distance = MathService.roundToPlaces(Math.abs(mean - tailInput), 2);
      return (x:any) => x <= mean - distance || x >= mean + distance;
    }
  }

  updateChart(chart: any = null) {
    const { chosen, unchosen } = SamplingService.splitByPredicate(
      this.results,
      this.predicateForTail(Number(this.minTailVal), Number(this.maxTailVal))
    );
    // this.updateChartLabels(/*0*/);
    if (chart) {
      chart.setScale(MathService.minInArray(this.results), MathService.maxInArray(this.results));
      let rData2 = {
        "minmax": {
          min: MathService.minInArray(this.results),
          max: MathService.maxInArray(this.results)
        },
        "data": [chosen, unchosen],
        background: "green"
      }
      chart.setDataFromRaw([chosen, unchosen]);
      chart.update(0);
    } else {
      
    }
  }
  clear() {
    for (let dataset of this.chart.data.datasets) {
        dataset.data = [];
    }
    this.chart.options.scales.xAxes[0].ticks.min = 0;
    this.chart.options.scales.xAxes[0].ticks.max = 1;
}
  updateChart2(chart: any = null) {
    const { chosen, unchosen } = SamplingService.splitByPredicate(
      this.results,
      this.predicateForTail2(0)
    );
    if (chart) {
      chart.setScale(MathService.minInArray(this.results), MathService.maxInArray(this.results));
      let rData2 = {
        "minmax": {
          min: MathService.minInArray(this.results),
          max: MathService.maxInArray(this.results)
        },
        "data": [chosen, unchosen],
        background: "green"
      }
      return rData2
    } else {
      return null
    }
  }
}