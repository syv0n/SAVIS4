import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Chart } from 'chart.js'
import { SharedService } from '../../services/shared.service'

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Input Chart Element Reference
   */
  @ViewChild('inputChart') chartCanvas: ElementRef<HTMLCanvasElement>
  /**
   * Sample Chart Element Reference
   */
  @ViewChild('sampleChart') sampleCanvas: ElementRef<HTMLCanvasElement>
  /**
   * Input Data Display Element Reference
   */
  @ViewChild('input_data_display') inputDataDisplay: ElementRef<HTMLDivElement>
  /**
   * Sample Data Display Element Reference
   */
  @ViewChild('input_data_table') inputDataTable: ElementRef<HTMLTableElement>
  /**
   * Sample Data Display Element Reference
   */
  @ViewChild('sample_data_display') sampleDataDisplay: ElementRef<HTMLDivElement>
  /**
   * Sample Data Display Element Reference
   */
  @ViewChild('sample_data_table') sampleDataTable: ElementRef<HTMLTableElement>
  /**
   * File Input Element Reference
   */
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef

  /**
   * Input Data Size Number String
   */
  inputDataSizeNum: string = 'NaN'
  /**
   * Sample Data Size Number String
   */
  sampleDataSizeNum: string = 'NaN'

  /**
   * Input Chart Error Message
   */
  inputErrorMsg = ''
  /**
   * Sample Chart Error Message
   */
  sampleErrorMsg = ''
  /**
   * CSV Text Area string
   */
  csvTextArea: string = ''
  /**
   * Sample Size Input Number
   */
  sampleSizeInput: number = 1
  /**
   * Input Data Array
   */
  inputDataArray: any[] = []
  /**
   * Data Category Array
   */
  dataCategoryArray: any[] = []
  /**
   * Sample Data Array
   */
  sampleDataArray: any[] = []
  /**
   * Datasets Array used in the Charts
   */
  datasets: any[] = [
    {
      label: this.translate.instant('barChart_inputdata'),
      borderColor: "orange",
      backgroundColor: "orange",
      data: []
    },
    {
      label: this.translate.instant('barChart_sample_drawn'),
      borderColor: 'blue',
      backgroundColor: 'blue',
      data: []
    }
  ]
  /**
   * Input Chart
   */
  inputChart: Chart
  /**
   * Sample Chart
   */
  sampleChart: Chart

  constructor(
    private translate: TranslateService,
    private sharedService: SharedService
  ) { }

  /**
   * On init subscribe to the shared service data
   */
  ngOnInit(): void {
    this.sharedService.currentData.subscribe(data => this.csvTextArea = data)
  }

  /**
   * After View Init Lifecycle Hook
   */
  ngAfterViewInit():void {
    this.createInputChart()
    this.createSampleChart()
  }

  /**
   * Create Input Chart
   */
  createInputChart(): void {
    const context = this.chartCanvas.nativeElement.getContext('2d')
    if (context) {
      this.inputChart = new Chart(context, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            this.datasets[0]
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: 1,
                  stepSize: 0.1,
                  beginAtZero: true,
                  fontColor: 'black',
                  fontSize: 14,
                  fontStyle: 'bold'
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('barChart_proportions'),
                  fontColor: 'black',
                  fontSize: 14,
                  fontStyle: 'bold'
                }
              }
            ],
            xAxes: [
              {
                // barPercentage: 1.0,
                ticks: {
                  minRotation: 45,
                  maxRotation: 45,
                  fontColor: 'black',
                  fontSize: 14,
                  fontStyle: 'bold'
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('barChart_categories'),
                  fontColor: 'black',
                  fontSize: 14,
                  fontStyle: 'bold'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: true
        }
      })
    }
  }

  /**
   * Create Sample Chart
   */
  createSampleChart(): void {
    const context = this.sampleCanvas.nativeElement.getContext('2d')
    if (context) {
      this.sampleChart = new Chart(context, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            this.datasets[1]
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: 1,
                  stepSize: 0.1,
                  beginAtZero: true,
                  fontColor: 'black',
                  fontSize: 14,
                  fontStyle: 'bold'
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('barChart_proportions'),
                  fontColor: 'black',
                  fontSize: 14,
                  fontStyle: 'bold'
                }
              }
            ],
            xAxes: [
              {
                // barPercentage: 1.0,
                ticks: {
                  minRotation: 45,
                  maxRotation: 45,
                  fontColor: 'black',
                  fontSize: 14,
                  fontStyle: 'bold'
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('barChart_categories'),
                  fontColor: 'black',
                  fontSize: 14,
                  fontStyle: 'bold'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: true
        }
      })
    }
  }

  /**
   * Selector for the samples, fetches the sample data and updates the text area
   * @param e event
   */
  sampleSelect(e: any) {
    let link = ''
    if(e.target.value == "sample1") {
      link = '../../../assets/barSample1.csv'
    } else {
      link = '../../../assets/barSample2.csv'
    }
    fetch(link).then(data => data.text())
      .then((data) => {
        this.csvTextArea = data
      })
  }

  /**
   * Load Data Button Handler
   */
  loadDataButton() {
    this.inputDataArray = this.csvTextArea.split(/\r?\n+|\r+/).filter(
      (x: any) => /\w+/.test(x)
    ).map((x, index) => ({
      id: index + 1,
      value: x.match(/-?\w*\.?\w+/)[0]
    }))

    if (this.inputDataArray.length) {
      this.loadInputData()
    } else {
      this.totalReset()
    }
  }

  /**
   * Resets chart data and input data
   */
  totalReset() {
    this.inputDataArray = []
    this.dataCategoryArray = []
    this.sampleDataArray = []
    this.datasets[0].data = []
    this.datasets[1].data = []
    this.inputDataSizeNum = 'NaN'
    this.sampleDataSizeNum = 'NaN'
    this.csvTextArea = ''
    this.fileInput.nativeElement.value = ''
    this.inputDataDisplay.nativeElement.innerHTML = ''
    this.sampleDataDisplay.nativeElement.innerHTML = ''
    this.inputDataTable.nativeElement.innerText = ''
    this.sampleDataTable.nativeElement.innerText = ''
    this.clearChart(this.inputChart)
    this.clearChart(this.sampleChart)
    console.log("reset")
  }

  /**
   * Resets sample chart data
   */
  resetSampleChart() {
    this.sampleDataArray = []
    this.datasets[1].data = []
    this.clearChart(this.sampleChart)
   
  }

  /**
   * Updates the sample data
   */
  updateSampleData() {
    this.sampleErrorMsg = ''
    try {
      if(!this.inputDataArray.length) throw new Error('No input data')
      const { chosen } = this.randomSubset(this.inputDataArray, this.sampleSizeInput)
      this.sampleDataArray = chosen
    } catch (error) {
      this.sampleErrorMsg = 'ERROR\n'
    }
    this.updateData(1)
  }

  /**
   * Load Input Data
   */
  loadInputData() {
    this.resetSampleChart()
    this.inputErrorMsg = ''
    let valuesArr = [...this.inputDataArray.map(x => x.value)]
    this.dataCategoryArray = this.sortAlphaNumString([... new Set(valuesArr)])
    console.log(this.dataCategoryArray)
    try {
      if(this.dataCategoryArray.length > 16) throw new Error('Too many categories')
      this.updateData(0)
    } catch (error) {
      console.log(this.dataCategoryArray.length)
      alert('ERROR: Only 16 categories are supported')
    }
   
  }

  /**
   * Sets the Maximum Scale for the Chart
   * @param num number
   * @returns number
   */
  setMaxScale(num: any) {
    if (num < 1) return Math.floor((num - Math.floor(num)) * 10)/10 + 0.1
    else return 1
  }

  /**
   * Updates the data in the chart
   * @param num number
   */
  updateData(num: any){
    let chart, dataArray, dataDisplay

    if(num === 0) {
      chart = this.inputChart
      dataArray = this.inputDataArray
      dataDisplay = this.inputDataDisplay
      this.inputDataSizeNum = this.inputDataArray.length.toString()
      this.inputDataTable.nativeElement.style.fontWeight = 'bold'
      this.inputDataTable.nativeElement.innerText = this.translate.instant('barChart_frequency_table')
    } else {
      chart = this.sampleChart
      dataArray = this.sampleDataArray
      dataDisplay = this.sampleDataDisplay
      this.sampleDataSizeNum = this.sampleDataArray.length.toString()
      this.sampleDataTable.nativeElement.style.fontWeight = 'bold'
      this.sampleDataTable.nativeElement.innerText = this.translate.instant('barChart_frequency_table')
    }

    let valuesArr   = [...dataArray.map(x => x.value)]
    let contValues  = this.dataCategoryArray.map(x => (
      valuesArr.filter(val => (x===val)).length
    ))
    let relativesVal = [
      ...contValues.map(x => this.roundToPlaces(x/valuesArr.length, 4))
    ]

    this.updateChartData(chart, this.dataCategoryArray, relativesVal)
    this.setScale(chart, 0, this.setMaxScale(this.maxInArray(relativesVal)))

    const tableElement = dataDisplay.nativeElement
    tableElement.innerHTML = ''

    const tableHead = document.createElement('thead')
    tableHead.style.textAlign = 'left'
    const headerRow = document.createElement('tr')
    const headersTable = [
      'Idx',
      this.translate.instant('barChart_category'),
      this.translate.instant('barChart_absol_freq'),
      this.translate.instant('barChart_rel_freq')
    ]


    headersTable.forEach(x => {
      const tHead = document.createElement("th")
      tHead.innerText = x
      tHead.style.padding = '8px'
      tHead.style.border = '1px solid #000'
      tHead.style.textAlign = 'left'
      headerRow.appendChild(tHead)
  })

    tableHead.appendChild(headerRow)
    const bodyTable = document.createElement('tbody')

    this.dataCategoryArray.forEach((val, idx) => {
      const rowData = document.createElement("tr")
      const tableRow = [idx+1, val, contValues[idx], relativesVal[idx].toFixed(4)]

      tableRow.forEach(x => {
          const element = document.createElement("td")
          element.innerText = x
          element.style.padding = '8px'
          element.style.border = '1px solid #000'
          element.style.textAlign = 'left'
          rowData.appendChild(element)
      })

      bodyTable.appendChild(rowData)
    })

    const table = document.createElement('table')
    table.appendChild(tableHead)
    table.appendChild(bodyTable)
    table.style.widows = '100%'
    table.style.borderCollapse = 'collapse'

    tableElement.appendChild(table)

   
  }

  /**
   * Gets a random number between two numbers
   * @param from starting number
   * @param to ending number
   * @returns number
   */
  randomInt(from: any, to: any) {
    return Math.floor((to - from) * Math.random() + from)
  }

  /**
   * Random Subset
   * @param itr iterable
   * @param n number
   * @returns object
   */
  randomSubset(itr: any, n: any) {
    let result = Array(n)
    let unchosen = []
    let seen = 0

    for(let item of itr) {
      if (seen < n) {
        result[seen] = item
      }
      else if (Math.random() < n / (seen + 1)) {
        let replaceIdx = this.randomInt(0, n)
        unchosen.push(result[replaceIdx])
        result[replaceIdx] = item
      } else {
        unchosen.push(item)
      }

      seen += 1
    }
    if (seen < n) {
      throw new Error('not enough elements')
    }
    return { chosen: result, unchosen }
  }

  /**
   * Sorts an array of strings in alphanumeric order
   * @param rawData array
   * @returns array
   */
  sortAlphaNumString(rawData: any) {
    let numbers = rawData.filter((x: any) => !isNaN(Number(x))).sort((a: any, b: any)=>a-b).map((x: any) => `${Number(x)}`)
    let strings = rawData.filter((x: any) => isNaN(Number(x))).sort( (a: any, b: any) => a.localeCompare(b))

    // const limit = numbers.length
    // for (let it = 0; it < limit; it++) {
    //   const rest = Number(numbers[it+1]) - Number(numbers[it])

    //   if (rest > 1) {
    //     for (let jt = 0; jt < rest-1; jt++) {
    //       numbers.push(String(Number(numbers[it] + jt + 1)))
    //     }
    //   }
    // }
    // numbers.sort((a: any, b: any) => a -b).map((x: any) => `${Number(x)}`)
    return numbers.concat(strings)
  }

  /**
   * Clears the chart
   * @param chart chart
   */
  clearChart(chart: Chart): void {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.options.scales.yAxes[0].ticks.max = 1;
    chart.update()
  }

  /**
   * Rounds a number to a certain number of decimal places
   * @param value number
   * @param places number
   * @returns number
   */
  roundToPlaces(value: any, places: any) {
    let pow10 = Math.pow(10, places)
    return Math.round(value * pow10) / pow10
  }

  /**
   * Gets the maximum value in an array
   * @param arr array
   * @returns number
   */
  maxInArray(arr: any) {
    if(!arr) return undefined
    return arr.reduce((acc: any, x: any) => {
      return acc > x ? acc : x
    }, arr[0])
  }

  /**
   * updates the chart data
   * @param chart chart
   * @param labels chart labels
   * @param contElements chart data
   */
  updateChartData(chart: any, labels: any, contElements: any) {
    chart.data.labels = labels
    chart.data.datasets[0].data = contElements
    chart.update()
  }

  /**
   * Sets the scale of the chart
   * @param chart chart
   * @param floor number
   * @param ceil number
   */
  setScale(chart: any, floor: any, ceil: any) {
    chart.options.scales.yAxes[0].ticks.min = floor
    chart.options.scales.yAxes[0].ticks.max = ceil
    chart.update()
  }
  
  /**
   * Checks if the input data size is NaN
   * @returns boolean
   */
  isInputDataSizeNumNaN(): boolean {
    return isNaN(Number(this.inputDataSizeNum))
  }

  /**
   * Checks if the sample data size is NaN
   * @returns boolean
   */
  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }

  /**
   * When user inputs a file, upload the file data into the input area
   * @param input csvFile
   */
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
   * When feature is closed, clear the data in shared service
   */
  ngOnDestroy(): void {
    this.sharedService.changeData('')
  }
}
