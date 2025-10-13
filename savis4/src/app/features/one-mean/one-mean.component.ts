import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { SharedService } from '../../services/shared.service';
import type { Paragraph, Table } from 'docx'

@Component({
  selector: 'app-one-mean',
  templateUrl: './one-mean.component.html',
  styleUrls: ['./one-mean.component.scss']
})
export class OneMeanComponent implements AfterViewInit, OnInit, OnDestroy {
  minInterValInput: number = 0
  maxInterValInput: number = 0

  includeValMin: any
  includeValMax: any

  sampleSize: number = 10
  noOfSim: number = 1

  csvTextArea: string = ''

  inputDataArray: any[] = []

  sampleDataArray: any[] = []

  sampleMeans: any[] = []

  sampleMeansChartLabel:string = ''

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
  isDataLoaded: boolean = false

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>

  @ViewChild('sampleChart') sampleDataChartRef: ElementRef<HTMLCanvasElement>

  @ViewChild('sampleMeansChart') sampleMeansChartRef: ElementRef<HTMLCanvasElement>

  inputDataChart: Chart


  sampleDataChart: Chart

  sampleMeansChart: Chart

  sampleRadio: string = 'population'

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef

  private _showInputForm = true
  private _showSampleForm = true
  private _showMeansForm = true

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

  }

  createInputChart(): void {
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.inputDataChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('dotPlot_input_data'),
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
                  labelString: this.translate.instant('dotPlot_data'),
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
                  max: 10,
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('dotPlot_frequencies'),
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
              label: this.translate.instant('dotPlot_last_drawn'),
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
                  labelString: this.translate.instant('dotPlot_data'),
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
                  labelString: this.translate.instant('dotPlot_frequencies'),
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
              label: this.translate.instant('dotPlot_means_in_interval'),
              backgroundColor: 'green',
              data: []
            },
            {
              label: this.translate.instant('dotPlot_means_not_in_interval'),
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
                  labelString: this.translate.instant('dotPlot_sample_means'),
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
                  labelString: this.translate.instant('dotPlot_frequencies'),
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
      this.isDataLoaded = true
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
  }

  resetSampleChart() {
    this.sampleDataArray = []
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
    this.radioChange('population')
    this.disabledInput = true
    this.sampleMeanDisabled = true
    this.sampleMeansSize = NaN
    this.isDataLoaded = false;
    this.csvTextArea = ''
    this.fileInput.nativeElement.value = ''
    
    this.clearChart(this.inputDataChart)
    this.clearChart(this.sampleDataChart)
    this.clearChart(this.sampleMeansChart)
    this.resetSampleMeansChart()
    this.resetSampleChart()
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

      for(let it = 0; it < num; it++){
        const { chosen } = this.randomSubset(this.inputDataArray, sz)
        roundedMean = this.roundToPlaces(this.mean(chosen.map(x => x.value)), 4)
        newMeanSamples.push(roundedMean)

        if(it === num - 1) {
          this.sampleDataArray = chosen
        }
      }

      if(this.sampleSize !== sz) {
        this.sampleSize = sz
        this.sampleMeans = newMeanSamples
      } else {
        this.sampleMeans = this.sampleMeans.concat(newMeanSamples)
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
          (acc, x) => acc + `${x.id}`.padEnd(8, ' ' ) + `${x.value}\n`,
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
          (acc, x, idx) => acc + `${idx + 1}`.padEnd(8, ' ') + `${x}\n`,
          `ID`.padEnd(8, ' ') + `${this.translate.instant('dotPlot_mean')}\n`
        )

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
      ? this.roundToPlaces(this.stddev(dataArray.map(x => x.value)), 4)
      : 'No data'
    } else if (num === 2) {
      dataStd = dataArray.length
      ? this.roundToPlaces(this.sampleStddev(dataArray), 4)
      : 'No data';
    } else {
      dataStd = dataArray.length
      ? this.roundToPlaces(this.sampleStddev(dataArray.map(x => x.value)), 4)
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
    if (max > 10) {
      chart.options.scales.yAxes[0].ticks.max = max
    } else {
      chart.options.scales.yAxes[0].ticks.max = 10
    }


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

  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }

  onFileSelect(input: Event): void {
    const target = input.target as HTMLInputElement;
    const file = target.files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.csvTextArea = e.target?.result as string
      };
      reader.readAsText(file)
    }
  }

  /**
   * @description Helper function to create a DOCX table from headers and data rows.
   * @param headers An array of strings for the table header.
   * @param rows A 2D array of strings or numbers for the table body.
   * @returns A Promise that resolves to a DOCX Table object.
   */
  private async createDocxTable(headers: string[], rows: (string | number)[][]): Promise<Table> {
    const { Table, TableRow, TableCell, Paragraph, TextRun, WidthType } = await import('docx');
    const header = new TableRow({
        children: headers.map(headerText => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: headerText, bold: true })] })] })),
    });
    const dataRows = rows.map(row => new TableRow({
        children: row.map(cellText => new TableCell({ children: [new Paragraph(String(cellText))] })),
    }));
    return new Table({ rows: [header, ...dataRows], width: { size: 100, type: WidthType.PERCENTAGE } });
  }

  // --- 1. Original Data Exports ---

  /**
   * @description Exports the original data chart and its summary statistics as a PDF document.
   */
  async exportInputDataAsPDF(): Promise<void> {
    if (!this.isDataLoaded) return;
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(16).text('One Mean Hypothesis Testing - Data Export', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    const imgData = this.inputDataChart.toBase64Image();
    const imgHeight = (this.inputDataChart.canvas.height * 180) / this.inputDataChart.canvas.width;
    doc.addImage(imgData, 'PNG', 15, 25, 180, imgHeight);
    const tableBody = [
      [`Mean (${this.meanSymbol})`, this.inputDataMean],
      [`Standard Deviation (${this.stdSymbol})`, this.inputDataStd],
      [`Size (${this.sizeSymbol})`, this.inputDataSize],
    ];
    autoTable(doc, { startY: 25 + imgHeight + 10, head: [['Statistic', 'Value']], body: tableBody });
    doc.save('one-mean-data-export.pdf');
  }

  /**
   * @description Exports the original data chart and its summary statistics as a DOCX document.
   */
  async exportInputDataAsDOCX(): Promise<void> {
    if (!this.isDataLoaded) return;
    const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table } = await import('docx');
    const FileSaver = await import('file-saver');
    const table = await this.createDocxTable(['Statistic', 'Value'], [
      [`Mean (${this.meanSymbol})`, this.inputDataMean],
      [`Standard Deviation (${this.stdSymbol})`, this.inputDataStd],
      [`Size (${this.sizeSymbol})`, this.inputDataSize],
    ]);
    const children: (Paragraph | Table)[] = [
      new Paragraph({ children: [new TextRun({ text: 'One Mean Hypothesis Testing - Data Export', bold: true, size: 32 })], alignment: AlignmentType.CENTER }),
      new Paragraph({ children: [new ImageRun({ type: "png", data: this.inputDataChart.toBase64Image().split(',')[1], transformation: { width: 500, height: 250 } })] }),
      new Paragraph({ children: [new TextRun({ text: 'Summary Statistics', bold: true, size: 24, break: 1 })] }),
      table,
    ];
    const doc = new Document({ sections: [{ children }] });
    Packer.toBlob(doc).then(blob => FileSaver.saveAs(blob, 'one-mean-data-export.docx'));
  }

  // --- 2. Sample Data Exports ---

  /**
   * @description Exports the most recent sample's chart and summary statistics as a PDF document.
   */
  async exportSampleDataAsPDF(): Promise<void> {
    if (this.sampleDataArray.length === 0) return;
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(16).text('One Mean Hypothesis Testing - Sample Export', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    const imgData = this.sampleDataChart.toBase64Image();
    const imgHeight = (this.sampleDataChart.canvas.height * 180) / this.sampleDataChart.canvas.width;
    doc.addImage(imgData, 'PNG', 15, 25, 180, imgHeight);
    autoTable(doc, {
      startY: 25 + imgHeight + 10,
      head: [['Statistic', 'Value']],
      body: [['Mean (x̄)', this.sampleDataMean], ['Standard Deviation (s)', this.sampleDataStd]],
    });
    doc.save('one-mean-sample-export.pdf');
  }

  /**
   * @description Exports the most recent sample's chart and summary statistics as a DOCX document.
   */
  async exportSampleDataAsDOCX(): Promise<void> {
    if (this.sampleDataArray.length === 0) return;
    const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table } = await import('docx');
    const FileSaver = await import('file-saver');
    const table = await this.createDocxTable(['Statistic', 'Value'], [['Mean (x̄)', this.sampleDataMean], ['Standard Deviation (s)', this.sampleDataStd]]);
    const children: (Paragraph | Table)[] = [
      new Paragraph({ children: [new TextRun({ text: 'One Mean Hypothesis Testing - Sample Export', bold: true, size: 32 })], alignment: AlignmentType.CENTER }),
      new Paragraph({ children: [new ImageRun({ type: "png", data: this.sampleDataChart.toBase64Image().split(',')[1], transformation: { width: 500, height: 250 } })] }),
      new Paragraph({ children: [new TextRun({ text: 'Summary Statistics', bold: true, size: 24, break: 1 })] }),
      table,
    ];
    const doc = new Document({ sections: [{ children }] });
    Packer.toBlob(doc).then(blob => FileSaver.saveAs(blob, 'one-mean-sample-export.docx'));
  }

  // --- 3. Distribution Exports ---

  /**
   * @description Exports the sampling distribution chart and its summary statistics as a PDF document.
   */
  async exportDistributionAsPDF(): Promise<void> {
    if (this.sampleMeans.length === 0) return;
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(16).text('One Mean Hypothesis Testing - Sampling Distribution Export', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    const imgData = this.sampleMeansChart.toBase64Image();
    const imgHeight = (this.sampleMeansChart.canvas.height * 180) / this.sampleMeansChart.canvas.width;
    doc.addImage(imgData, 'PNG', 15, 25, 180, imgHeight);
    const tableBody = [
      ['Mean of Sample Means', this.sampleMeansMean],
      ['Std Dev of Sample Means', this.sampleMeansStd],
      ['Total Samples', this.sampleMeansSize],
      ['Samples in Interval', this.sampleMeansChosen],
      ['Samples not in Interval', this.sampleMeansUnchosen],
    ];
    autoTable(doc, { startY: 25 + imgHeight + 10, head: [['Statistic', 'Value']], body: tableBody });
    doc.save('one-mean-distribution-export.pdf');
  }

  /**
   * @description Exports the sampling distribution chart and its summary statistics as a DOCX document.
   */
  async exportDistributionAsDOCX(): Promise<void> {
    if (this.sampleMeans.length === 0) return;
    const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table } = await import('docx');
    const FileSaver = await import('file-saver');
    const table = await this.createDocxTable(['Statistic', 'Value'], [
      ['Mean of Sample Means', this.sampleMeansMean],
      ['Std Dev of Sample Means', this.sampleMeansStd],
      ['Total Samples', this.sampleMeansSize],
      ['Samples in Interval', this.sampleMeansChosen],
      ['Samples not in Interval', this.sampleMeansUnchosen],
    ]);
    const children: (Paragraph | Table)[] = [
      new Paragraph({ children: [new TextRun({ text: 'One Mean Hypothesis Testing - Sampling Distribution Export', bold: true, size: 32 })], alignment: AlignmentType.CENTER }),
      new Paragraph({ children: [new ImageRun({ type: "png", data: this.sampleMeansChart.toBase64Image().split(',')[1], transformation: { width: 500, height: 250 } })] }),
      new Paragraph({ children: [new TextRun({ text: 'Summary Statistics', bold: true, size: 24, break: 1 })] }),
      table,
    ];
    const doc = new Document({ sections: [{ children }] });
    Packer.toBlob(doc).then(blob => FileSaver.saveAs(blob, 'one-mean-distribution-export.docx'));
  }

  ngOnDestroy(): void {
    this.sharedService.changeData('')
  }

}