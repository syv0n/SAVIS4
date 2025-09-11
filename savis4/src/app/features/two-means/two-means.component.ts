import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartDataSets, ChartType, Chart } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { chatClass } from 'src/app/Utils/stacked-dot';
import { Sampling } from 'src/app/Utils/sampling';
import { TailchartService } from 'src/app/Utils/tailchart.service';
import * as XLS from 'xlsx';

import { TranslateService } from '@ngx-translate/core'; 
import { SharedService } from '../../services/shared.service';
import { MathService } from '../../Utils/math.service';

@Component({
  selector: 'app-two-means',
  templateUrl: './two-means.component.html',
  styleUrls: ['./two-means.component.scss']
})
export class TwoMeansComponent implements OnInit, AfterViewInit, OnDestroy {
  activateSim: boolean = false
  dataSize1: number = 0
  dataSize2: number = 0
  datamean2: number = 0
  datamean1: number = 0
  mean_diff: number = 0
  numofSem: number = 1
  samDisActive = false
  lastSummary: any
  chart1: any
  chart2: any
  chart3: any
  chart4: any
  minmax: any
  csvraw: any
  csv: any
  sections: any = {
    sectionOne: true,
    sectionTwo: true,
    sectionThree: true
  }
  simsummary: any = {
    sampleMean1: NaN,
    sampleMean2: NaN,
    sampleMeanDiff: NaN,
  }
  demodata: any = [
  ]
  datasets = [
    { label: "Group 1", legend: true, backgroundColor: 'orange', data: this.demodata },
    { label: "Group 2", legend: true, backgroundColor: 'rebeccapurple', data: this.demodata },
    { label: "Group 3", legend: false, backgroundColor: 'rebeccapurple', data: this.demodata },
    { label: "Group 3", legend: false, backgroundColor: 'rebeccapurple', data: this.demodata },
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

  minTailValInput: number = 0
  maxTailValInput: number = 0

  includeValMin: any
  includeValMax: any

  @ViewChild('diffChart') chart5Ref: ElementRef<HTMLCanvasElement>

  chart5: Chart

  simulations: any[] = []

  total: string = ''
  chosen: string = ''
  proportion: string = ''
  stdDev: string = ''

  CIdisabled: boolean = true


  constructor(
    private smp: Sampling, 
    private tail: TailchartService, 
    private translate: TranslateService,
    private sharedService: SharedService
  ) {

  }
  toggleSection(e: any, sec: string) {
    this.sections[sec] = e.target.checked
  }
  dataTextArea: string = '';
  data: any
  updateData(csvData: number[][] | null) {
    if (csvData){
      this.dataSize1 = this.csv[0].length
      this.dataSize2 = this.csv[1].length
      this.datamean1 = Number(this.calculateMean(this.csv[0]).toFixed(3))
      this.datamean2 = Number(this.calculateMean(this.csv[1]).toFixed(3))
      this.mean_diff = Number((this.datamean1 - this.datamean2).toFixed(3))
      let dataValues = this.csv[0].concat(this.csv[1]);
      let min = Math.min.apply(undefined, dataValues);
      let max = Math.max.apply(undefined, dataValues);
      this.minmax = {
        "min": min,
        "max": max,
      }
      let rData = {
        "minmax": this.minmax,
        "data": [this.csv[0]],
        "label": "Group 1",
        "backgroundColor": "orange"
      }
      let rData2 = {
        "minmax": this.minmax,
        "data": [this.csv[1]],
        "label": "Group 2",
        "backgroundColor": "rebeccapurple"
      }

      this.chart1.setScale(min, max)
      this.chart2.setScale(min, max)
      this.chart1.setDataFromRaw(rData)
      this.chart2.setDataFromRaw(rData2)
      this.chart1.chart.update(0)
      this.chart2.chart.update(0)
      this.activateSim = true
    }
    else{
      this.csv = []; // Or set to null if appropriate
      this.dataSize1 = 0;
      this.dataSize2 = 0;
      this.datamean2 = null;
      this.mean_diff = null;
    }
  }

  calculateMean(data: number[]) {
    if (data.length === 0) {
      return 0;
    }
    const sum = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const mean = sum / data.length;
    return mean;
  }
  onResetChart() {
    this.chart1.clear()
    this.chart2.clear()
    this.chart3.clear()
    this.chart4.clear()
    this.chart1.chart.update(0)
    this.chart2.chart.update(0)
    this.chart3.chart.update(0)
    this.chart4.chart.update(0)
    this.csvraw = ''
    this.simulations = []
    this.numofSem = 1
    this.includeValMax = false
    this.includeValMin = false
    this.activateSim = false
    this.samDisActive = false
    this.simsummary = {
      sampleMean1: NaN,
      sampleMean2: NaN,
      sampleMeanDiff: NaN,
    }
    this.minTailValInput = 0
    this.maxTailValInput = 0
    this.total = ''
    this.chosen = ''
    this.proportion = ''
    this.stdDev = ''
    this.dataSize1 = 0
    this.dataSize2 = 0
    this.datamean2 = 0
    this.datamean1 = 0
    this.mean_diff = 0
    this.CIdisabled = true
    console.log("chart reset")
  }

  async ngOnInit() {
    this.chart1 = new chatClass("data-chart-1", this.datasets[0]);
    this.chart2 = new chatClass("data-chart-2", this.datasets[1]);
    this.chart3 = new chatClass("data-chart-3", this.datasets[3]);
    this.chart4 = new chatClass("data-chart-4", this.datasets[3]);

    this.chart1.chart.data.datasets[0].label = this.translate.instant('tm_group1')
    this.chart2.chart.data.datasets[0].label = this.translate.instant('tm_group2')

    this.chart1.chart.update(0)
    this.chart2.chart.update(0)
   
    this.sharedService.currentData.subscribe(data => this.csvraw = data)
  }

  ngAfterViewInit() {
    this.createChart5()
  }

  createChart5() {
    const ctx = this.chart5Ref.nativeElement.getContext('2d')
    if (ctx) {
      this.chart5 = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: `0 < ${this.translate.instant('tm_differences')} < 1`,
              backgroundColor: 'green',
              data: [],
            },
            {
              label: `${this.translate.instant('tm_differences')} ≤ 0 ∪ 1 ≤ ${this.translate.instant('tm_differences')}`,
              backgroundColor: 'red',
              data: [],
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('tm_diff_mean'),
                }
              }
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
                  labelString: this.translate.instant('tm_freq'),
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          },
          animation: {
            duration: 0,
          }
        }
      })
    }
  }

  loadData(): void {
    this.csv = this.parseData(this.csvraw.trim());
    console.log(this.csv);
    this.updateData(this.csv)
    this.CIdisabled = false

  }
  

  updateChart(data: string): void {
    
    const rows = data.split('\n');
    const parsedData = rows.map(row => {
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
    const group1Data = rows.map(row => (parseFloat(row.split(',')[1])) as number).filter(value => !isNaN(value));
    const group2Data: number[] = []; // Empty array for Group 2 data
  
    const sizeGroup1 = group1Data.length;
    const meanGroup1 = sizeGroup1 > 0 ? group1Data.reduce((acc, val) => acc + val, 0) / sizeGroup1 : NaN;
  
    const sizeGroup2 = group2Data.length;
    const meanGroup2 = sizeGroup2 > 0 ? group2Data.reduce((acc, val) => acc + val, 0) / sizeGroup2 : NaN;
  
    const diffOfMeans = isNaN(meanGroup1) || isNaN(meanGroup2) ? NaN : meanGroup1 - meanGroup2;
  
    this.summaryData = [
      { data: [sizeGroup1, meanGroup1, sizeGroup2, meanGroup2, diffOfMeans], label: 'Summary Statistics' },
    ];
  }

  sampleSelect(e: any) {
    this.csv = null
    let link = ""
    if (e.target.value == "sample1") {
      link = "../../../assets/twomean_sample1.csv"
    } else {
      link = "../../../assets/twomean_sample2.csv"

    }
    fetch(link).then(data => data.text())
      .then((data) => {
        this.csvraw = data
        this.csv = this.parseData(data.trim());

      })
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
    let numSims = this.numofSem * 1;
    let results = [];
    for (let simIdx = 0; simIdx < numSims; simIdx++) {
      let allData = [];
      for (let item of this.csv[0]) {
        allData.push({ datasetId: 0, value: item });
      }
      for (let item of this.csv[1]) {
        allData.push({ datasetId: 1, value: item });
      }
      if (allData.length === 0) {
        return;
      }
      let { chosen, unchosen } = this.smp.randomSubset(allData, this.csv[0].length);
      this.chart3.setDataFromRaw(this.addSimulationSample(chosen));
      this.chart4.setDataFromRaw(this.addSimulationSample(unchosen));
      this.chart3.chart.update();
      this.chart4.chart.update();

      // TODO(matthewmerrill): This is very unclear.
      let sampleValues = [chosen.map(a => a.value), unchosen.map(a => a.value)];
      let mean0 = this.calculateMean(sampleValues[0]);
      let mean1 = this.calculateMean(sampleValues[1]);
      let sampleDiffOfMeans = mean1 - mean0;
      this.simulations.push(sampleDiffOfMeans)
      results.push(sampleDiffOfMeans);

      this.simsummary = {
        sampleMean1: Number(mean0.toFixed(3)),
        sampleMean2: Number(mean1.toFixed(3)),
        sampleMeanDiff: Number(sampleDiffOfMeans.toFixed(3))
      };
      this.tail.addAllResults(results)
    }
    this.samDisActive = true
    // this.charts.tailChart.addAllResults(results);
    // this.updateSimResults();

    this.buildci()
  }

  buildci() {
    const confidenceLevel = 95

    const [lower, upper] = MathService.getCutOffInterval(confidenceLevel, this.simulations.length)
    const temp = this.simulations.map(val => val)

    temp.sort((a, b) => a - b)

    this.minTailValInput = temp[lower]
    this.maxTailValInput = temp[upper >= temp.length ? upper - 1: upper]

    const dataCustomChart = this.splitByPredicate(
      this.simulations,
      this.predicateForTail(this.minTailValInput, this.maxTailValInput)
    )

    this.chart5.data.datasets[0].label = `${this.minTailValInput} < ${this.translate.instant('tm_differences')} < ${this.maxTailValInput}`
    this.chart5.data.datasets[1].label = `${this.translate.instant('tm_differences')} ≤ ${this.minTailValInput} ∪ ${this.maxTailValInput} ≤ ${this.translate.instant('tm_differences')}`

    this.setDataFromRaw(this.chart5, [dataCustomChart.chosen, dataCustomChart.unchosen])
    this.scaleToStackDots(this.chart5)
    this.chart5.update()

    this.updateInfoSampleMeans(dataCustomChart.chosen.length, dataCustomChart.unchosen.length)
  }

  updateInfoSampleMeans(totalChosen: number, totalUnchosen: number) {
    const proportionChosen = MathService.roundToPlaces(totalChosen / this.simulations.length, 4)
    const proportionUnchosen = MathService.roundToPlaces(totalUnchosen / this.simulations.length, 4)

    this.total = this.simulations.length.toString()
    this.stdDev = MathService.stddev(this.simulations).toFixed(4).toString()
    this.chosen = `${totalChosen} / ${this.simulations.length} = ${proportionChosen}`
    this.proportion = `${totalUnchosen} / ${this.simulations.length} = ${proportionUnchosen}`
  }

  splitByPredicate(itr:any, fn:any) {
    const chosen: any[] = []
    let unchosen = []

    if (fn === null) unchosen = itr
    else {
      itr.forEach((x: any) => {
        if (fn(x)) chosen.push(x)
        else unchosen.push(x)
      })
    }
    return { chosen, unchosen }
  }

  predicateForTail(left: any, right: any) {
    const limits = {min: this.includeValMin, max: this.includeValMax}
    if (limits.min && limits.max) {
      return function (x: any) {
        return x >= left && x <= right
      }
    } else if (limits.min && !limits.max) {
      return function (x: any) {
        return x >= left && x < right
      }
    } else if (!limits.min && limits.max) {
      return function (x: any) {
        return x > left && x <= right
      }
    } else if (!limits.min && !limits.max) {
      return function (x: any) {
        return x > left && x < right
      }
    } else return null
  }

  setDataFromRaw(chart: Chart, rawDataArrays: any) {
    let scatterArrays = this.rawToScatter(rawDataArrays)
    for(let idx = 0; idx < rawDataArrays.length; idx++) {
      chart.data.datasets[idx].data = scatterArrays[idx]
    }
    let max = 1
    for (let dataset of scatterArrays) {
      for (let item of dataset) {
        max = Math.max(max, item.y)
      }
    }
  }

  rawToScatter(arrs: any[]) {
    let faceted = [];
    let counts: { [key: string]: number } = {}; // Add type annotation
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
    let max = 1
    for (let dataset of chart.data.datasets) {
      for (let item of dataset.data) {
        max = Math.max(max, item.y)
      }
    }

    chart.options.scales.yAxes[0].ticks.stepSize = (max > 10) ? Math.ceil(max * 0.2) : 1


    if(max > 1000) {
      chart.options.scales.yAxes[0].ticks.min = 0
    }

    for (let datasets of chart.data.datasets) {
      datasets.pointRadius = 8
    }

    return chart
  }

  addSimulationSample(sample: any[]) {
    let a: any = []
    let b: any = []
    let facetedArrays = [a, b];
    for (let item of sample) {
      facetedArrays[item.datasetId].push(item.value);
    }
    let rData2 = {
      "minmax": this.minmax,
      "data": facetedArrays
    }
    return rData2
  }

  onFileSelected(e: any) {
    const files = e.target.files || e.dataTransfer?.files;
    if (files.length) {
      const file = files[0]
      const filereader = new FileReader();
      filereader.readAsBinaryString(file)
      filereader.onload = () => {
        const wb = XLS.read(filereader.result, { type: 'binary' })
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const row = XLS.utils.sheet_to_csv(wb.Sheets[sheets[0]])
          this.csvraw = row
          this.csv = this.parseData(this.csvraw.trim())
        }
      }
    }

  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.onFileSelected(event)
  }

  ngOnDestroy(): void {
    this.sharedService.changeData('')
  }
}
