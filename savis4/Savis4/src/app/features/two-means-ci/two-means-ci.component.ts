import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ChartDataSets, ChartType, Chart, ChartPoint } from 'chart.js';

import { TranslateService } from '@ngx-translate/core';

import { Color, Label } from 'ng2-charts';
import { chatClass } from 'src/app/Utils/stacked-dot';
import { Sampling } from 'src/app/Utils/sampling';
import { TailchartService } from 'src/app/Utils/tailchart.service';
import * as XLS from 'xlsx';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-two-mean-ci',
  templateUrl: './two-means-ci.component.html',
  styleUrls: ['./two-means-ci.component.scss'],
})
export class TwoMeansCIComponent
  implements OnInit, AfterContentInit, AfterViewInit, OnDestroy
{
  activateSim: boolean = false;
  dataSize1: number = 0;
  dataSize2: number = 0;
  datamean2: number = 0;
  datamean1: number = 0;
  multiplier: number = 10;
  mean_diff: number = 0;

  @ViewChild('chart5') chart5Ref: ElementRef<HTMLCanvasElement>;

  numofSem: number = 1;
  confidenceLevel: number = 95;
  increment: number = 10;
  samDisActive = false;
  lastSummary: any;
  chart1: any;
  simulations: any = [];
  chart2: any;
  chart3: any;
  chart4: any;
  chart5: any;
  minmax: any;
  stDev1: number = 0;
  stDev2: number = 0;
  incrementPerformed: boolean = false;
  meansOfMeans: any = []; // TODO: REMOVE
  csvraw: any;
  csv: any;
  lowerBound = 'NaN';
  stdevFinal: number = 0;
  upperBound = 'NaN';
  sections: any = {
    sectionOne: true,
    sectionTwo: true,
    sectionThree: true,
  };
  simsummary: any = {
    sampleMean1: NaN,
    sampleMean2: NaN,
    sampleMeanDiff: NaN,
    stdev1sim: NaN,
    stdev2sim: NaN,
  };
  demodata: any = [];
  datasets = [
    {
      label: 'Group 1',
      legend: true,
      backgroundColor: 'orange',
      data: this.demodata,
    },
    {
      label: 'Group 2',
      legend: true,
      backgroundColor: 'rebeccapurple',
      data: this.demodata,
    },
    {
      label: 'Group 3',
      legend: false,
      backgroundColor: 'rebeccapurple',
      data: this.demodata,
    },
    {
      label: 'Group 3',
      legend: false,
      backgroundColor: 'rebeccapurple',
      data: this.demodata,
    },
  ];

  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = [];
  chartColors: Color[] = [
    {
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ];
  chartType: ChartType = 'scatter';

  summaryData: ChartDataSets[] = [];

  numberOfSimulations: number;

  constructor(
    public smp: Sampling,
    public tail: TailchartService,
    public translate: TranslateService,
    private sharedService: SharedService
  ) {}
  toggleSection(e: any, sec: string) {
    this.sections[sec] = e.target.checked;
  }
  dataTextArea: string = '';
  data: any;
  updateData(data: any) {
    this.dataSize1 = this.csv[0].length;
    this.dataSize2 = this.csv[1].length;
    this.datamean1 = Number(this.calculateMean(this.csv[0]).toFixed(3));
    this.datamean2 = Number(this.calculateMean(this.csv[1]).toFixed(3));
    this.mean_diff = Number((this.datamean1 - this.datamean2).toFixed(3));
    let dataValues = this.csv[0].concat(this.csv[1]);
    let min = Math.min.apply(undefined, dataValues);
    let max = Math.max.apply(undefined, dataValues);
    // Calculate standard deviations
    const stdDev1 = Number(
      this.calculateStandardDeviation(this.csv[0]).toFixed(3)
    );
    const stdDev2 = Number(
      this.calculateStandardDeviation(this.csv[0]).toFixed(3)
    );
    this.stDev1 = stdDev1;
    this.stDev2 = stdDev2;
    this.minmax = {
      min: min,
      max: max,
    };
    let rData = {
      minmax: this.minmax,
      data: [this.csv[0]],
      label: 'Group 1',
      backgroundColor: 'orange',
    };
    let rData2 = {
      minmax: this.minmax,
      data: [this.csv[1]],
      label: 'Group 2',
      backgroundColor: 'rebeccapurple',
    };

    this.chart1.setScale(min, max);
    this.chart2.setScale(min, max);
    this.chart1.setDataFromRaw(rData);
    this.chart2.setDataFromRaw(rData2);
    this.chart1.chart.update(0);
    this.chart2.chart.update(0);
    this.activateSim = true;
  }
  calculateStandardDeviation(data: number[]): number {
    if (data.length === 0) return 0;

    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const variance =
      data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      data.length;
    return Math.sqrt(variance);
  }

  incrementYValues(chartIdentifier: string): void {
    this.incrementPerformed = true;
    let chartToIncrement: any;

    if (chartIdentifier === 'chart1') {
      chartToIncrement = this.chart1;
    } else if (chartIdentifier === 'chart2') {
      chartToIncrement = this.chart2;
    }

    // console.log(chartToIncrement)
    // console.log(chartToIncrement.chart.config)
    let maxY = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;

    // console.log('Before update', chartToIncrement.chartData);
    if (chartToIncrement && this.multiplier) {
      chartToIncrement.chart.config.data.datasets.forEach((dataset: any) => {
        dataset.data = dataset.data.map((point: any) => {
          let newY =
            typeof point.y !== 'undefined'
              ? point.y * this.multiplier
              : point * this.multiplier;
          if (newY > maxY) maxY = newY;
          if (newY < minY) minY = newY;
          if (typeof point === 'object' && point.y !== undefined) {
            return { x: point.x, y: point.y * this.multiplier };
          } else if (typeof point === 'number') {
            return point * this.multiplier;
          }
          return point;
        });
      });
      // console.log('After update', chartToIncrement.chartData);
      // Call the update method on the chart
      if (chartToIncrement.chart.options.scales.yAxes) {
        chartToIncrement.chart.options.scales.yAxes[0].ticks.min = minY;
        chartToIncrement.chart.options.scales.yAxes[0].ticks.max = maxY;
      } else if (chartToIncrement.chart.options.scales.y) {
        // For Chart.js 3.x
        chartToIncrement.chart.options.scales.y.min = minY;
        chartToIncrement.chart.options.scales.y.max = maxY;
      }
      chartToIncrement.chart.update(); // Assuming this is the correct method to update your chart
    }
  }
  createChart5() {
    const ctx = this.chart5Ref.nativeElement.getContext('2d');
    if (ctx) {
      this.chart5 = new Chart(ctx, {
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

  calculateMean(data: number[]) {
    if (data.length === 0) {
      return 0;
    }
    const sum = data.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const mean = sum / data.length;
    return mean;
  }
  onResetChart() {
    this.chart1.clear();
    this.chart2.clear();
    this.chart3.clear();
    this.chart4.clear();
    this.chart5.data.datasets[0].data = [];
    this.chart5.data.datasets[1].data = [];
    this.chart1.chart.update(0);
    this.chart2.chart.update(0);
    this.chart3.chart.update(0);
    this.chart4.chart.update(0);
    this.chart5.chart.update(0);
    this.chart1.options.scales.yAxes[0].ticks.min = 0;

    this.chart1.options.scales.yAxes[0].ticks.max = 10;
    this.csvraw = ''
    this.activateSim = false
  }
  resetAxis(chartInstance: any) {
    if (chartInstance.chart.options.scales.yAxes) {
      // Reset for Chart.js 2.x
      chartInstance.chart.options.scales.yAxes[0].ticks.min = 'auto';
      chartInstance.chart.options.scales.yAxes[0].ticks.max = 'auto';
    } else if (chartInstance.chart.options.scales.y) {
      // Reset for Chart.js 3.x
      chartInstance.chart.options.scales.y.min = 'auto';
      chartInstance.chart.options.scales.y.max = 'auto';
    }
  }
  async ngOnInit() {
    this.chart1 = new chatClass('data-chart-1', this.datasets[0]);
    this.chart2 = new chatClass('data-chart-2', this.datasets[1]);
    this.chart3 = new chatClass('data-chart-3', this.datasets[3]);
    // console.log(this.datasets[3])
    this.chart4 = new chatClass('data-chart-4', this.datasets[3]);
    // console.log(this.chart5Ref);
    // this.chart5 = this.createChart5();
    this.sharedService.currentData.subscribe(data => this.csvraw = data)
  }
  ngAfterContentInit() {
    let leg = [`Differences `, `NaN`];
    let color = [`orange `, `red`];
    let rData2: {
      minmax: [number, number];
      data: any[][];
      backgroundColor: string;
    } = {
      minmax: [0, 1],
      data: [[], []],
      backgroundColor: 'rebeccapurple',
    };

    // this.chart5.setDataFromRaw(rData2);
    // this.chart5.setLengend(leg,color)

    // this.chart5.chart.update(0)
  }
  loadData(): void {
    this.csv = this.parseData(this.csvraw.trim());
    // console.log(this.csv);
    this.updateData(this.csv);

    // this.updateChart(data);
    // this.updateSummaryChart(data);
  }

  updateChart(data: string): void {
    const rows = data.split('\n');
    const parsedData = rows.map((row) => {
      const [group, value] = row.split(',').map(Number);
      return { x: value, y: group };
    });

    this.chartData = [
      {
        data: parsedData,
        label: 'Original Data',
        pointRadius: 6,
      },
    ];

    this.chartLabels = parsedData.map((_, index) => `Data Point ${index + 1}`);
  }
  updateSummaryChart(data: string): void {
    const rows = data.split('\n');
    const group1Data = rows
      .map((row) => parseFloat(row.split(',')[1]))
      .filter((value) => !isNaN(value));
    const group2Data: any = []; // Assuming data for Group 2 is not available in the provided example

    const sizeGroup1 = group1Data.length;
    const meanGroup1 =
      sizeGroup1 > 0
        ? group1Data.reduce((acc, val) => acc + val, 0) / sizeGroup1
        : NaN;

    const sizeGroup2 = group2Data.length;
    const meanGroup2 =
      sizeGroup2 > 0
        ? group2Data.reduce((acc: any, val: any) => acc + val, 0) / sizeGroup2
        : NaN;

    const diffOfMeans =
      isNaN(meanGroup1) || isNaN(meanGroup2) ? NaN : meanGroup1 - meanGroup2;

    this.summaryData = [
      {
        data: [sizeGroup1, meanGroup1, sizeGroup2, meanGroup2, diffOfMeans],
        label: 'Summary Statistics',
      },
    ];
  }

  sampleSelect(e: any) {
    this.csv = null;
    let link = '';
    if (e.target.value == 'sample1') {
      link = '../../../assets/twomean_sample1.csv';
    } else {
      link = '../../../assets/twomean_sample2.csv';
    }
    fetch(link)
      .then((data) => data.text())
      .then((data) => {
        this.csvraw = data;
        this.csv = this.parseData(data.trim());
      });
  }

  parseData(dataText: any) {
    let items = dataText
      .split(/[\r\n]+/)
      .filter((line: any) => line.length)
      .map((line: any) => {
        let [group, value] = line.split(',');
        return [group, value * 1.0];
      });
    let faceted: any = {};
    for (let [group, value] of items) {
      if (!faceted[group]) {
        faceted[group] = [];
      }
      faceted[group].push(value);
    }
    return Object.values(faceted);
  }

  runSim() {
    if (!this.incrementPerformed) {
      alert('Please increment values before running the simulation.');
      return;
    }
    // Proceed with simulation...

    let numSims = this.numofSem * 1;
    let results = []; // TODO: REMOVE
    // console.log("x")
    for (let simIdx = 0; simIdx < numSims; simIdx++) {
      let allData = [];
      // Add items with datasetId to distinguish between groups
      for (let item of this.csv[0]) {
        allData.push({ datasetId: 0, value: item }); // Group 1
      }
      for (let item of this.csv[1]) {
        allData.push({ datasetId: 1, value: item }); // Group 2
      }
      if (allData.length === 0) {
        return;
      }
      // Perform the random subset selection
      let { chosen, unchosen } = this.smp.randomSubset(
        allData,
        this.csv[0].length
      );

      // Filter chosen for Group 1 and unchosen for Group 2
      let chosenGroup1 = chosen.filter((item) => item.datasetId === 0);
      let unchosenGroup2 = unchosen.filter((item) => item.datasetId === 1);

      // Set the data for chart3 and chart4
      this.chart3.setDataFromRaw(this.addSimulationSample(chosenGroup1));
      this.chart4.setDataFromRaw(this.addSimulationSample(unchosenGroup2));
      this.chart3.chart.update();
      this.chart4.chart.update();

      this.chart4.chart.update();

      // TODO(matthewmerrill): This is very unclear.
      let sampleValues = [
        chosen.map((a) => a.value),
        unchosen.map((a) => a.value),
      ];
      let mean0 = this.calculateMean(sampleValues[0]);
      let mean1 = this.calculateMean(sampleValues[1]);
      let stdevSim1 = this.calculateStandardDeviation(sampleValues[0]);
      let stdevSim2 = this.calculateStandardDeviation(sampleValues[1]);
      let sampleDiffOfMeans = mean1 - mean0;
      results.push(sampleDiffOfMeans); // TODO: REMOVE
      this.simulations.push(sampleDiffOfMeans);
      this.meansOfMeans.push(sampleDiffOfMeans); // TODO: REMOVE
      this.simsummary = {
        sampleMean1: Number(mean0.toFixed(3)),
        sampleMean2: Number(mean1.toFixed(3)),
        sampleMeanDiff: Number(sampleDiffOfMeans.toFixed(3)),
        stdev1sim: Number(stdevSim1.toFixed(3)),
        stdev2sim: Number(stdevSim2.toFixed(3)),
      };
      this.updateLastChart();
      this.tail.addAllResults(results); // TODO: REMOVE
      // this.updateLastChart()
    }
    this.samDisActive = true;
    this.stdevFinal = Number(
      this.calculateStandardDeviation(this.simulations).toFixed(3)
    );
    // this.charts.tailChart.addAllResults(results);
    // this.updateSimResults();
  }

  addSimulationSample(sample: any[]) {
    let a: any = [];
    let b: any = [];
    let facetedArrays = [a, b];
    for (let item of sample) {
      facetedArrays[item.datasetId].push(item.value);
    }
    let rData2 = {
      minmax: this.minmax,
      data: facetedArrays,
    };
    return rData2;
  }

  onFileSelected(e: any) {
    const files = e.target.files || e.dataTransfer?.files;
    if (files.length) {
      const file = files[0];
      const filereader = new FileReader();
      filereader.readAsBinaryString(file);
      filereader.onload = (event: any) => {
        const wb = XLS.read(filereader.result, { type: 'binary' });
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const row = XLS.utils.sheet_to_csv(wb.Sheets[sheets[0]]);
          this.csvraw = row;
          this.csv = this.parseData(this.csvraw.trim());
        }
      };
    }
  }
  ngAfterViewInit() {
    this.createChart5();
  }

  updateLastChart() {
    const confidenceLevel = this.confidenceLevel || 0;
    if (confidenceLevel == 0 || !this.simulations.length) {
      return;
    }

    const [lower, upper] = this.getCutOffInterval(
      confidenceLevel,
      this.simulations.length
    );
    // Adjust the sort function if your data structure is different
    const temp = this.simulations.map((val: number) => val);
    temp.sort((a: number, b: number) => a - b);

    // Adjust the lambda function to match the structure of your data
    const [chosen, unchosen] = this.splitUsing(
      temp,
      (val: number, index: any) => {
        return (
          val >= temp[lower] &&
          val <= temp[upper >= temp.length ? upper - 1 : upper]
        );
      }
    );

    // Ensure these lines are compatible with how you're storing and displaying bounds
    this.lowerBound = Number(temp[lower]).toFixed(3);
    this.upperBound = Number(
      temp[upper >= temp.length ? upper - 1 : upper]
    ).toFixed(3);
    const shift = temp.length < 500 ? 0 : 0;
    this.setScale(this.chart5, temp[0] - shift, temp[temp.length - 1] + shift);
    this.setDataFromRaw(this.chart5, [chosen, unchosen]);
    this.scaleToStackDots(this.chart5);
    // Assuming createChart5 initializes this.chart5 correctly

    this.chart5.update();
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
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.onFileSelected(event);
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

  scaleToStackDots(chart: Chart) {
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

  ngOnDestroy(): void {
      this.sharedService.changeData('')
  }
}
