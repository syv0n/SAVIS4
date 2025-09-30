import { Component, ElementRef, AfterViewInit, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MathService } from 'src/app/Utils/math.service';
import { NgForm } from '@angular/forms';
import {ChartDataSets} from 'chart.js';
import * as XLS from 'xlsx';
import {Chart} from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { CoverageChartService } from './services/coverage-chart.service';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-one-mean-ci',
  templateUrl: './one-mean-ci.component.html',
  styleUrls: ['./one-mean-ci.component.scss']
})
export class OneMeanCIComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef

  minInterValInput: number = 0
  maxInterValInput: number = 0
  csvRaw:any
  includeValMin: any
  includeValMax: any
  coverageDataDisplay: any = ''
  sampleSize: number = 10
  noOfSim: number = 1
  sampleStds: number[] = []
  csvTextArea: string = ''

  inputDataArray: any[] = []
  lowerBound: any[] = []
  upperBound: any[] = []
  sampleDataArray: any[] = []
  min:number = 0
  max:number = 1
  confidenceIntervalCount = 0
  confidenceIntervalCountNot = 0
  sampleMeans: any[] = []

  sampleMeansChartLabel:string = ''
  meanVisible: boolean = false
  scaleChart: any[] = []

  inputDataSize: any = NaN
  sampleMeansSize: any = NaN

  inputDataDisplay: any = ''
  sampleDataDisplay: any = ''
  sampleMeansDisplay: any = ''

  inputDataMean: any = NaN
  sampleDataMean: any = NaN
  sampleMeansMean: any = NaN

  inputDataStd: any = NaN
  sampleDataStd: any = NaN
  sampleMeansStd: any = NaN

  sampleMeansChosen: any = NaN
  sampleMeansUnchosen: any = NaN

  meanSymbol: string = 'μ'
  stdSymbol: string = 'σ'
  sizeSymbol: string = 'n'

  disabledInput: boolean = true
  sampleMeanDisabled: boolean = true

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>

  @ViewChild('sampleChart') sampleDataChartRef: ElementRef<HTMLCanvasElement>

  @ViewChild('sampleMeansChart') sampleMeansChartRef: ElementRef<HTMLCanvasElement>

  @ViewChild('inputForm') inputForm: NgForm
  @ViewChild('confidenceIntervalChart') confidenceIntervalChartRef: ElementRef<HTMLCanvasElement>
  inputDataChart: Chart


  sampleDataChart: Chart

  sampleMeansChart: Chart
  confidenceIntervalChart: CoverageChartService

  sampleRadio: string = 'population'

  private _showInputForm = true
  private _showSampleForm = true
  private _showMeansForm = true
  private _showConfidenceIntervalForm = true
  noOfIntervals: number = 1
  lowerBounds: number[] = []
  upperBounds: number[] = []
  samplemean2: number[] = []
  constructor(
    private translate: TranslateService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.includeValMin = false
    this.includeValMax = false
    this.sharedService.currentData.subscribe(data => this.csvTextArea = data)
  }

  ngAfterViewInit() {
    this.createInputChart()
    this.createSampleChart()
    this.createSampleMeansChart()
    this.createConfidenceIntervalChart()
  }
  createConfidenceIntervalChart(): void {
    const ctx = this.confidenceIntervalChartRef.nativeElement.getContext('2d')
    let dataset: ChartDataSets[] = [
      {
        label: this.translate.instant('omci_InInterval'),
        backgroundColor: 'rgba(31, 255, 31, 1)',
        borderColor: 'rgba(31, 255, 31, 1)',
        data: [],
        showLine: true
      },
      {
        label: this.translate.instant('omci_NotInInterval'),
        backgroundColor: 'red',
        borderColor: 'red',
        data: [],
        showLine: true
      },
      {
        label: this.meanSymbol,
        backgroundColor: 'black',
        borderColor: 'black',
        data: [],
        showLine: true
      }
    ]

    this.confidenceIntervalChart = new CoverageChartService(ctx, dataset, 'horizontal')
  }
  createInputChart(): void {
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.inputDataChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('omci_input_data'),
              backgroundColor: 'orange',
              data: []
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
                  min: 0,
                  max: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('omci_data'),
                  fontStyle: 'bold',
                  fontColor: 'black'
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
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('omci_frequencies'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          }
        }
      })
    }

  }

  createSampleChart(): void {
    const ctx = this.sampleDataChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.sampleDataChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('omci_last_drawn'),
              backgroundColor: 'blue',
              data: []
            },
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
                  min: 0,
                  max: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('omci_data'),
                  fontStyle: 'bold',
                  fontColor: 'black'
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
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('omci_frequencies'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          }
        }
      })
    }

  }

  createSampleMeansChart(): void {
    const ctx = this.sampleMeansChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.sampleMeansChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('omci_means_in_interval'),
              backgroundColor: 'green',
              data: []
            },
            {
              label: this.translate.instant('omci_means_not_in_interval'),
              backgroundColor: 'red',
              data: []
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
                  min: 0,
                  max: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('omci_sample_means'),
                  fontStyle: 'bold',
                  fontColor: 'black'
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
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('omci_frequencies'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          }
        }
      })
    }

  }

  loadDataButton() {
    this.inputDataArray = this.parseCSVtoSingleArray(this.csvTextArea)
    
    if(this.inputDataArray.length) {
      this.updateData(0)
      this.inputDataSize = this.inputDataArray.length
    }

    this.disabledInput = false
  }

  runSimulationButton() {
    this.updateSampleData(this.sampleSize, this.noOfSim)
    this.sampleMeanDisabled = false
  }

  sampleMeanChange() {
    if(this.sampleMeans.length) {
      this.updateData(2)
    }
  }

  radioChange(str: string) {
    this.sampleRadio = str
    if (this.inputDataArray.length) {
      this.updateData(0)
    }

    if (str === 'population') {
      this.meanSymbol = 'μ'
      this.stdSymbol = 'σ'
      this.sizeSymbol = 'N'
      if (this.inputDataArray.length) {
        this.disabledInput = false
      }
    }

    if (str === 'sample') {
      this.meanSymbol = 'x̄'
      this.stdSymbol = 's'
      this.sizeSymbol = 'n'
      this.sampleMeanDisabled = true
      this.disabledInput = true
    }
  }

  populationRadioChange() {
    if(this.inputDataArray.length) {
      this.updateData(0)
    }

  }

  resetSampleMeansChart() {
    this.sampleMeans = []
    this.sampleMeansChartLabel = ''
    this.updateData(2)
  }

  resetSampleChart() {
    this.sampleDataArray = []
    this.updateData(1)
  }
  resetConfidenceIntervalChart() {
    this.lowerBounds = []
    this.upperBounds = []
    this.confidenceIntervalCount = 0
    this.confidenceIntervalCountNot = 0

  }
  totalReset() {
    this.inputDataArray = []
    this.sampleDataArray = []
    this.sampleMeans = []
    this.sampleMeansChartLabel = ''
    this.minInterValInput = 0
    this.maxInterValInput = 0
    this.noOfSim = 1
    this.sampleSize = 10
    this.inputDataSize = NaN
    this.meanVisible = false
    this.inputDataDisplay = ''
    this.sampleDataDisplay = ''
    this.sampleMeansDisplay = ''
    this.inputDataMean = NaN
    this.sampleDataMean = NaN
    this.sampleMeansMean = NaN
    this.inputDataStd = NaN
    this.sampleDataStd = NaN
    this.sampleMeansStd = NaN
    this.sampleMeansChosen = NaN
    this.sampleMeansUnchosen = NaN
    this.radioChange('sample')
    this.disabledInput = true
    this.sampleMeanDisabled = true
    this.sampleMeansSize = NaN
    this.csvTextArea = ''
    this.fileInput.nativeElement.value = ''
    
    this.confidenceIntervalCount = 0
    this.confidenceIntervalCountNot = 0
    this.clearChart(this.inputDataChart)
    this.clearChart(this.sampleDataChart)
    this.clearChart(this.sampleMeansChart)
    this.clearChart(this.confidenceIntervalChart)
    this.resetSampleMeansChart()
    this.resetSampleChart()
    this.resetConfidenceIntervalChart()
  }

  updateInfoSampleMeans(totalChosen: number, totalUnchosen: number) {
    const proportionChosen = this.roundToPlaces(totalChosen / this.sampleMeans.length, 4)
    const proportionUnchosen = this.roundToPlaces(totalUnchosen / this.sampleMeans.length, 4)

    this.sampleMeansChosen = `${totalChosen} / ${this.sampleMeans.length} = ${proportionChosen}`
    this.sampleMeansUnchosen = `${totalUnchosen} / ${this.sampleMeans.length} = ${proportionUnchosen}`

  }

  updateSampleData(sz:any, num: any) {
    try {
      if (!this.sampleSize) throw new Error('Sample size is required')

      let roundedMean
      let newMeanSamples = []
      let newStdDeviations = [];

      for(let it = 0; it < num; it++){
        const { chosen } = this.randomSubset(this.inputDataArray, sz)
        roundedMean = this.roundToPlaces(this.mean(chosen.map(x => x.value)), 4)
        newMeanSamples.push(roundedMean)
        const stdDeviation = this.roundToPlaces(MathService.sampleStddev(chosen.map(x => x.value)), 3);
        newStdDeviations.push(stdDeviation);

        if(it === num - 1) {
          this.sampleDataArray = chosen
        }
      }

      if(this.sampleSize !== sz) {
        this.sampleSize = sz
        this.sampleMeans = newMeanSamples
        this.sampleStds = newStdDeviations; 
      } else {
        this.sampleMeans = this.sampleMeans.concat(newMeanSamples)
        this.sampleStds = this.sampleStds.concat(newStdDeviations); 
      }

      this.updateData(1)

      const minNumber = this.minInArray(this.sampleMeans)
      const maxNumber = this.maxInArray(this.sampleMeans)
      this.minInterValInput = (minNumber%1===0)?minNumber-1:Math.floor(minNumber)
      this.maxInterValInput = (maxNumber%1===0)?maxNumber+1:Math.ceil(maxNumber)


      this.updateData(2)
    } catch (error) {
      // let errMsg = 'ERRROR\n'
      alert(error)
    }
  }
  

  predicateForSets(left: any, right: any) {
    if(this.includeValMin.checked && this.includeValMax.checked) {
      return function(x: any) {
        return x >= left && x <= right
      }
    } else if (this.includeValMin.checked && !this.includeValMax.checked) {
      return function(x: any) {
        return x >= left && x < right
      }
    } else if (!this.includeValMin.checked && this.includeValMax.checked) {
      return function(x: any) {
        return x > left && x <= right
      }
    } else {
      return function(x: any) {
        return x > left && x < right
      }
    }
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
          this.csvRaw = row
          this.csvTextArea = this.csvRaw;
        }
      }
    }

  }
  
  

  parseData(dataText: any): string {
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
    return JSON.stringify(Object.values(faceted)); // Convert the parsed data to JSON string
  }

  updateData(num: number) {
    let dataChart, dataArray, dataDisplay, dataMean, dataStd, valuesArr
    if(num === 0) {
      dataChart = this.inputDataChart
      dataArray = this.inputDataArray
      dataDisplay = this.inputDataDisplay

    } else if (num === 1) {
      dataChart = this.sampleDataChart
      dataArray = this.sampleDataArray
      dataDisplay = this.sampleDataDisplay

    } else {
      dataChart = this.sampleMeansChart
      dataArray = this.sampleMeans
      dataDisplay = this.sampleMeansDisplay

    }

    if (dataArray.length) {
      if (num !== 2) {
        valuesArr = dataArray.map(x => x.value)
        dataChart = this.setDataFromRaw(dataChart, [valuesArr])
        
        dataDisplay = dataArray.reduce(
          (acc, x) => acc + `${x.id}`.padEnd(8, ' ') + `${x.value}\n`,
          `ID`.padEnd(8, ' ') + `${this.translate.instant('dotPlot_values')}\n`
        )

        if (num === 0) {
          this.scaleChart = [
            this.minInArray(valuesArr), Math.ceil(this.maxInArray(valuesArr) / 10) * 10
          ]
        }
      } else {
        valuesArr = dataArray
        const { chosen, unchosen } = this.splitByPredicate(
          valuesArr,
          this.predicateForSets(
            this.minInterValInput,
            this.maxInterValInput
          )
        )

        dataChart.options.animation.duration = 0
        this.updateInfoSampleMeans(chosen.length, unchosen.length)
        dataChart = this.setDataFromRaw(dataChart, ([chosen, unchosen]))
        
        dataDisplay = dataArray.reduce(
          (acc, x, idx) => acc + 
            `${(idx + 1).toString().padEnd(8, ' ')}` + 
            `${x.toString().padEnd(8, ' ')}` + 
            `${this.sampleStds[idx].toString().padEnd(25, ' ')}\n`,
          `ID`.padEnd(8, ' ') + `mean`.padEnd(8, ' ') + `s\n`
        );
      }

      if (num < 2) {
        dataChart = this.setScale(dataChart, this.scaleChart[0], (this.scaleChart[1]-1))
      } else {
        dataChart = this.setScale(dataChart, this.minInArray(valuesArr), this.maxInArray(valuesArr))
      }

      if (valuesArr.length < 1000) {
        dataChart = this.changeDotAppearance(dataChart, 5)
      } else {
        dataChart = this.changeDotAppearance(dataChart, 3)
      }

      dataChart = this.scaleToStackDots(dataChart)

    } else {
      this.clearChart(dataChart)
    }

    dataChart.update()
    dataMean = dataArray.length
    ? this.roundToPlaces(this.mean(valuesArr), 2)
    : 'No data'

    if(this.sampleRadio === 'population' && num === 0) {
      dataStd = dataArray.length
      ? this.roundToPlaces(this.stddev(dataArray.map(x => x.value)), 2)
      : 'No data'
    } else if (num === 2) {
      dataStd = dataArray.length
      ? this.roundToPlaces(this.sampleStddev(dataArray), 2)
      : 'No data';
    } else {
      dataStd = dataArray.length
      ? this.roundToPlaces(this.sampleStddev(dataArray.map(x => x.value)), 2)
      : 'No data';
    }

    if(num === 0) {
      this.inputDataDisplay = dataDisplay
      this.inputDataMean = dataMean
      this.inputDataStd = dataStd
    } else if (num === 1) {
      this.sampleDataDisplay = dataDisplay
      this.sampleDataMean = dataMean
      this.sampleDataStd = dataStd
    } else {
      this.sampleMeansDisplay = dataDisplay
      this.sampleMeansMean = dataMean
      this.sampleMeansSize = valuesArr.length
      this.sampleMeansStd = dataStd
    }

  }

  

  sampleSelect(e: any) {
    let link = ''
    if(e.target.value == "sample1") {
      link = '../../../assets/samp1.csv'
    } else {
      link = '../../../assets/samp2.csv'
    }
    fetch(link).then(data => data.text())
      .then((data) => {
        this.csvTextArea = data
      })
  }

  setDataFromRaw(chart:any, rawDataArrays: any) {
    let scatterArrays = this.rawToScatter(rawDataArrays)
    for(let idx = 0; idx < rawDataArrays.length; idx++) {
      chart.data.datasets[idx].data = scatterArrays[idx]
    }

    let max = 1

    for(let dataset of scatterArrays) {
      for(let item of dataset) {
        max = Math.max(max, item.y)
      }
    }

    return chart
  }

  rawToScatter(arrs: any) {
    let faceted = []
    let counts: { [key: string]: number } = {} 
    for (let arr of arrs) {
      let scatter = []
      for (let item of arr) {
        let y = (counts[item] = (counts[item] || 0) + 1)
        scatter.push({ x: item, y: y/*, n:*/ })
      }
      faceted.push(scatter)
    }
    return faceted
  }

  setScale(chart: Chart, start: any, end: any) {
    chart.options.scales.xAxes[0].ticks.min = (Math.floor(start))? Math.floor(start) : 0
    chart.options.scales.xAxes[0].ticks.max = Math.ceil(end) + 1

    return chart
  }

  changeDotAppearance(chart: Chart, pointRadius: any) {
    if (!Array.isArray(chart.data.datasets)) {
      chart.data.datasets = [];
    }
    chart.data.datasets.forEach(x => {
      x.pointRadius = pointRadius
    })

    return chart
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

    return chart
  }

  clearChart(chart: any) {
    for(let dataset of chart.data.datasets) {
      dataset.data = []
    }

    chart.options.scales.xAxes[0].ticks.min = 0
    chart.options.scales.xAxes[0].ticks.max = 1

    chart.update()
  }

  minInArray(arr: any) {
    if (!arr) return undefined
    return arr.reduce((acc: any, x: any) => {
      return acc < x ? acc : x
    }, arr[0])
  }

  maxInArray(arr: any) {
    if (!arr) return undefined
    return arr.reduce((acc: any, x: any) => {
      return acc > x ? acc : x
    }, arr[0])
  }

  splitByPredicate(itr: any, fn: any) {
    const chosen: any[] = []
    let unchosen: any[] = []

    if(fn === null) unchosen = itr
    else {
      itr.forEach((x: any) => {
        if(fn(x)) chosen.push(x)
        else unchosen.push(x)
      })
    }
    return { chosen, unchosen }
  }

  roundToPlaces(value: any, places: any) {
    let pow10 = Math.pow(10, places)
    return Math.round(value * pow10) / pow10
  }

  randomInt(from: any, to:any) {
    return Math.floor((to - from) * Math.random()) + from
  }

  randomSubset(itr: any, n: any) {
    let result = Array(n)
    let unchosen = []
    let seen = 0

    for(let item of itr) {
      if (seen < n) {
        result[seen] = item
      } else if (Math.random() < n / (seen + 1)) {
        let replaceIdx = this.randomInt(0, n)
        unchosen.push(result[replaceIdx])
        result[replaceIdx] = item
      } else {
        unchosen.push(item)
      }
      seen += 1
    }

    if(seen < n) {
      throw new Error('not enough elements')
    }
    return { chosen: result, unchosen }
  }

  mean(itr: any) {
    let sum = 0
    let count = 0
    
    for (let item of itr) {
      sum += item
      count += 1
    }
    return sum / count
  }

  stddev(itr: any) {
    return Math.sqrt(this.variance(itr))
  }

  sampleStddev(itr: any) {
    const n = itr.length
    if (n <= 1) return NaN

    const sampleMean = this.mean(itr)
    const devSquare = itr.reduce((acc: number, x: number) => {
      console.log('acc', acc)
      console.log('x', x)
      console.log('mean', sampleMean)
      return (x - sampleMean) * (x - sampleMean) + acc
    }, 0)

    return Math.sqrt(devSquare / (n - 1))
  }

  variance(itr: any) {
    let sum = 0
    let count = 0
    let sumOfSquares = 0

    for (let item of itr) {
      sum += item
      sumOfSquares += item * item
      count += 1
    }

    let mean = sum / count
    
    return sumOfSquares / count - mean * mean
  }

  parseCSVtoSingleArray(rawData: any) {
    const numRegex = /(-?\d+(\.\d+)?)/

    return rawData
    .split(/[\r\n]+/)
    .filter((x: any) => numRegex.test(x))
    .map((x: any, index: any) => ({
      id: index + 1,
      value: Number(x.match(numRegex)[0])
    }))
  }

  get showInputForm(): boolean {
    return this._showInputForm;
  }
  
  set showInputForm(value: boolean) {
    this._showInputForm = value;
    if (value) {
      setTimeout(() => this.initializeInputChart(), 0)
    }
  }

  get showConfidenceIntervalForm(): boolean {
    return this._showConfidenceIntervalForm;
  }
  set showConfidenceIntervalForm(value: boolean) {
    this._showConfidenceIntervalForm = value;
    if (value) {
      setTimeout(() => this.initializeConfidenceIntervalChart(), 0)
    }
  }
  
  get showSampleForm(): boolean {
    return this._showSampleForm;
  }
  
  set showSampleForm(value: boolean) {
    this._showSampleForm = value;
    if (value) {
      setTimeout(() => this.initializeSampleChart(), 0)
    }
  }
  
  get showMeansForm(): boolean {
    return this._showMeansForm;
  }
  
  set showMeansForm(value: boolean) {
    this._showMeansForm = value;
    if (value) {
      setTimeout(() => this.initializeMeansChart(), 0)
    }
  }
  
  initializeInputChart() {
    if (this.inputDataChart) {
      this.inputDataChart.destroy();
    }
    this.createInputChart();
  }
  initializeConfidenceIntervalChart() {
    if (this.confidenceIntervalChart) {
      this.confidenceIntervalChart.chart.destroy()
    }
    this.createConfidenceIntervalChart();
  }
  
  initializeSampleChart() {
    if (this.sampleDataChart) {
      this.sampleDataChart.destroy();
    }
    this.createSampleChart();
  }
  
  initializeMeansChart() {
    if (this.sampleMeansChart) {
      this.sampleMeansChart.destroy();
    }
    this.createSampleMeansChart();
  }

  confidenceInterval() {
    if(this.noOfIntervals < 1 || this.noOfIntervals > this.sampleMeans.length) {
      alert('Number of coverage intervals must be between 1 and the number of sample means')
      return
    }
    let chosenMeans = [], processedStd = []
    const noOfCoverage = this.noOfIntervals

    for (let it = 0; it < noOfCoverage; it++) {
      chosenMeans.push(this.sampleMeans[it])
      processedStd.push(2 * this.sampleStds[it] / Math.sqrt(this.sampleSize))
    }

    let it, sampleMean, procStd, lower, upper, minNum, maxNum, assignedDataset, tmp
    let inInterval: any[] = [], notInInterval: any[] = [], lowers = [], uppers = []
    let wMean = 0

    const centMean = Number(this.inputDataMean)

    for (it = 0; it < chosenMeans.length; it++) {
      sampleMean = chosenMeans[it]
      procStd = processedStd[it]

      lower = sampleMean - procStd
      upper = sampleMean + procStd

      if (lower < minNum || !minNum) minNum = lower
      if (upper > maxNum || !maxNum) maxNum = upper

      if (lower <= centMean && centMean <= upper) wMean += 1

      if ((it < noOfCoverage) && (it < 100)) {
        assignedDataset = (lower <= centMean && centMean <= upper) ? inInterval : notInInterval

        assignedDataset.push(
          { x: it+ 1, y: MathService.roundToPlaces(lower, 2) },
          { x: it + 1, y: sampleMean },
          { x: it + 1, y: MathService.roundToPlaces(upper, 2) },
          { x: undefined, y: undefined }
        )
      }

      lowers.push(MathService.roundToPlaces(lower, 2))
      uppers.push(MathService.roundToPlaces(upper, 2))
    }
    this.lowerBounds = lowers
    this.upperBounds = uppers
    this.meanVisible = true
    it++
    tmp = inInterval.pop()
    tmp = notInInterval.pop()

    this.confidenceIntervalChart.setScales({
      x_term: (it < 100) ? it : 100,
      y_init: minNum,
      y_term: maxNum
    })

    this.confidenceIntervalChart.updateChartData([
      inInterval,
      notInInterval,
      [{x: 0, y: centMean}, {x: (it < 100) ? it : 100, y: centMean}]
    ])

    this.confidenceIntervalChart.chart.data.datasets[2].label = `${this.meanSymbol} = ${centMean}`
    this.confidenceIntervalChart.chart.update()
    this.confidenceIntervalCount = wMean
    this.confidenceIntervalCountNot = noOfCoverage - wMean
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }

  ngOnDestroy():void {
    this.sharedService.changeData('')
  }
}


