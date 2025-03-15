import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartType, Chart } from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService } from 'src/app/Utils/sampling.service';
import { SummaryService } from 'src/app/Utils/summaries.service';

@Component({
  selector: 'app-one-proportion-ci',
  templateUrl: './one-proportion-ci.component.html',
  styleUrls: ['./one-proportion-ci.component.scss']
})

export class OneProportionCIComponent implements OnInit, AfterViewInit {
  constructor( 
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService
    ) { }

  @ViewChild('successInput', { static: true }) successInput!: ElementRef<HTMLInputElement>;
  @ViewChild('failureInput', { static: true }) failureInput!: ElementRef<HTMLInputElement>;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  @ViewChild('chart3') chart3Ref: ElementRef<HTMLCanvasElement>

  failure: number
  success: number
  randomizedfailure:number 
  randomizedsuccess:number 
  confidenceLevel:number = 95
  increment:number = 0
  sampleSize:number
  numSimulations:number  
  numsuccess:number 
  numfailure:number
  proportion: number 
  sampleProportion: number 
  mean: number
  stddev: number
  lower: number
  upper: number
  total: number
  needData: any = []
  simulations: number[] = []
  noData: any = []
  //chart: any
  sampleMeans: any
  Summaries = new SummaryService();
  summaryElements = this.Summaries.loadSummaryElements(document);
  data: {numsuccess: number, numfailure: number};
  Data: {success: number, failure: number};

  CiRadio: string = 'CI'

  chart3: Chart

  CiDisabled: boolean = true
  MinMaxDisabled: boolean = true
  radioDisabled: boolean = true

  minTailValInput: number
  maxTailValInput: number

  includeValMin: any
  includeValMax: any

  simSampleSizeDisabled: boolean = true
  numSampleSizeDisabled: boolean = true
  runSimulationsDisabled: boolean = true

  sampleMeansChosen: string = ''
  sampleMeansUnchosen: string = ''

  public barChartType1: ChartType = 'bar';
  public barChartType2: ChartType = 'scatter';

  public barChartData1: ChartDataSets[] =[
    {
      label: this.translate.instant('opc_barchart_s'),
      backgroundColor: 'green',
      hoverBackgroundColor: 'green',
      data: [],
      borderColor: 'green'
    },
    {
      label: this.translate.instant('opc_barchart_f'),
      backgroundColor: 'red',
      hoverBackgroundColor: 'red',
      data: [],
      borderColor: 'red'
    },
  ];
 public barChartLabels1: any = [];

  public barChartData2: ChartDataSets[] =[
    {
      label: this.translate.instant('opc_barchart_s'),
      backgroundColor: 'green',
      hoverBackgroundColor: 'green',
      data: [],
      borderColor: 'green'
    },
    {
      label: this.translate.instant('opc_barchart_f'),
      backgroundColor: 'red',
      hoverBackgroundColor: 'red',
      data: [],
      borderColor: 'red'
    },
  ];
  public barChartLabels2: any = [];

  public barChartOptions1: any={
    responsive: true,
    tooltips: {
      callbacks: {
        title: () => {
          return this.translate.instant('opc_data_xaxis')
        },
        label: (tooltipItem: any, data: any) => {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${datasetLabel}: ${value}%`; // Add your custom text
        }
      }
    },
    scales:{
      xAxes:[
        {
          stacked: false,
          ticks:{
            beginsAtZero: true,
          },
          scaleLabel:{
            display: true,
            labelString: this.translate.instant('opc_data_xaxis')
          }
        }
      ],
      yAxes:[
        {
          id: 'groupAAxis',
          stacked: false,
          ticks:{
            min:0,
            max:100,
            stepSize:20,
            beginsAtZero: true,
          },
          scaleLabel:{
            display: true,
            labelString: this.translate.instant('opc_percentage')
          }
        },
      ],
    },
    maintainAspectRatio: false,
  };

  public barChartOptions2: any={
    responsive: true,
    tooltips: {
      callbacks: {
        title: () => {
          return this.translate.instant('opc_data_xaxis')
        },
        label: (tooltipItem: any, data: any) => {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${datasetLabel}: ${value}%`; // Add your custom text
        }
      }
    },
    scales:{
      xAxes:[
        {
          stacked: false,
          ticks:{
            beginAtZero: true,
          },
          scaleLabel:{
            display: true,
            labelString: this.translate.instant('opc_data_xaxis')
          }
        }
      ],
      yAxes:[
        {
          id: 'groupAAxis',
          stacked: false,
          ticks:{
            beginAtZero: true,
            min:0,
            max:100,
            stepSize:20
          },
          scaleLabel:{
            display: true,
            labelString: this.translate.instant('opc_percentage')
          }
        },
      ],
    },
    maintainAspectRatio: false,
  };

  ngOnInit(): void {
    this.minTailValInput = 0
    this.maxTailValInput = 1
  }

  ngAfterViewInit() {
    this.createChart3()
  }

  createChart3() {
    const ctx = this.chart3Ref.nativeElement.getContext('2d')
    if (ctx) {
      this.chart3 = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('opc_values_in'),
              backgroundColor: 'green',
              data: [],
            },
            {
              label: this.translate.instant('opc_values_out'),
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
                  min: 0,
                  max: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('opc_data_xaxis'),
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
                  labelString: this.translate.instant('opc_frequency'),
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontStyle: '16px',
          },
          animation: {
            duration: 0
          }
        }
      })
    }
  }
  
  loadData() {
    let numsuccess = this.getInputValue(this.successInput);
    let numfailure = this.getInputValue(this.failureInput);
    this.barChartData1 = this.barChartData1 = [
      { 
        data: [], 
        label: this.translate.instant('opc_barchart_s'),
        backgroundColor: 'green', 
        hoverBackgroundColor: 'green', 
      }, 
      { 
        data: [], 
        label: this.translate.instant('opc_barchart_f'), 
        backgroundColor: 'red',
        hoverBackgroundColor: 'red',
      }];
    if (numsuccess <= 0 || numfailure <= 0) {
      alert('The value of successes and failures must be greater than 0');
    }
    else {
      let proportion = this.calculateProportion(numsuccess, numfailure);
      this.proportion = proportion;
      let summary = {
         numsuccess, numfailure,
         proportion: this.proportion, // todo(matthewmerrill): fixed decimals
         ...this.resetAllBut(["numsuccess", "numfailure","proportion"])
        
      }
      this.Summaries.updateSummaryElements(this.summaryElements, summary);
      this.data = { numsuccess, numfailure};
      this.numfailure = numfailure;
      this.numsuccess = numsuccess;
      const successPercentage = this.calculateSuccessPercentage(numsuccess, numfailure);
      const failurePercentage = this.calculateFailurePercentage(numsuccess, numfailure);
  
      this.barChartData1[0].data = this.barChartData1[0].data || [];
      this.barChartData1[1].data = this.barChartData1[1].data || [];

    // Update the data in barChartData1
      this.barChartData1[0].data[0] = MathService.roundToPlaces(successPercentage, 2);
      this.barChartData1[1].data[0] = MathService.roundToPlaces(failurePercentage, 2);
    }

    this.simSampleSizeDisabled = false
    this.numSampleSizeDisabled = false
    this.runSimulationsDisabled = false
    this.CiDisabled = false
    this.radioDisabled = false
  }

  resetData(){
    this.success = 0;
    this.failure = 0;
    this.numfailure = 0;
    this.numsuccess = 0;
    this.increment = 0;
    this.proportion = NaN;
    this.sampleSize = 0;
    this.numSimulations = 0;
    this.sampleProportion = NaN;
    this.randomizedsuccess = 0;
    this.randomizedfailure = 0;
    this.mean = NaN;
    this.stddev = NaN;
    this.lower = NaN;
    this.upper = NaN;
    this.total = NaN;
    this.simulations = [];
    this.simSampleSizeDisabled = true;
    this.numSampleSizeDisabled = true;
    this.runSimulationsDisabled = true;
    this.minTailValInput = 0;
    this.maxTailValInput = 1;
    this.confidenceLevel = 95;
    this.CiRadio = 'CI';
    this.CiDisabled = true;
    this.MinMaxDisabled = true;
    this.radioDisabled = true;
    this.includeValMin = false;
    this.includeValMax = false;
    this.sampleMeansChosen = '';
    this.sampleMeansUnchosen = '';

    this.barChartData1 = this.defaultChartData();
    this.barChartLabels1 = [];
    this.barChartOptions1 = this.defaultChartOptions;

    this.barChartData2 = this.defaultChartData2();
    this.barChartLabels2 = [];
    this.barChartOptions2 = this.defaultChartOptions2;

    this.chart3.data.datasets[0].data = [];
    this.chart3.data.datasets[1].data = [];
    this.chart3.update();
  }

  private defaultChartOptions: any={
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${datasetLabel}: ${value}%`; // Add your custom text
        }
      }
    },
    scales:{
      xAxes:[
        {
          stacked: false,
          scaleLabel:{
            display: true,
            labelString: 'Data'
          }
        }
      ],
      yAxes:[
        {
          id: 'groupAAxis',
          stacked: false,
          ticks:{
            min:0,
            max:100,
            stepSize:20
          },
          scaleLabel:{
            display: true,
            labelString: this.translate.instant('opc_percentage')
          }
        },
      ],
    },
    maintainAspectRatio: false,
  };

  private defaultChartOptions2: any={
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${datasetLabel}: ${value}%`; // Add your custom text
        }
      }
    },
    scales:{
      xAxes:[
        {
          stacked: false,
          scaleLabel:{
            display: true,
            labelString: 'Data'
          }
        }
      ],
      yAxes:[
        {
          id: 'groupAAxis',
          stacked: false,
          ticks:{
            min:0,
            max:100,
            stepSize:20
          },
          scaleLabel:{
            display: true,
          }
        },
      ],
    },
    maintainAspectRatio: false,
  }

  
  private defaultChartData(): Chart.ChartDataSets[]{
    return [
      {
        label: this.translate.instant('opc_barchart_s'),
        backgroundColor: 'green',
        hoverBackgroundColor: 'green',
        data: [],
        borderColor: 'green'
      },
      {
        label: this.translate.instant('opc_barchart_f'),
        backgroundColor: 'red',
        hoverBackgroundColor: 'red',
        data: [],
        borderColor: 'red'
      },
    ]
  }

  private defaultChartData2(): Chart.ChartDataSets[]{
    return[
      {
        label: this.translate.instant('opc_barchart_s'),
        backgroundColor: 'green',
        hoverBackgroundColor: 'green',
        data: [],
        borderColor: 'green'
      },
      {
        label: this.translate.instant('opc_barchart_f'),
        backgroundColor: 'red',
        hoverBackgroundColor: 'red',
        data: [],
        borderColor: 'red'
      },
    ]
  }

  calculateProportion(numsuccess: number, numfailure: number): number {
    let totalInA = numsuccess + numfailure;
    return numsuccess / totalInA;
  }

  private getInputValue(inputRef: ElementRef<HTMLInputElement>): number {
    return inputRef && inputRef.nativeElement ? +inputRef.nativeElement.value : 0;
  }

  incrementt(increment: number): void{
   if(increment > 0)
    {
      this.numsuccess = this.success * increment;;
      this.numfailure = this.failure * increment;
   }else{
    alert('Increase by factor must be greater than zero')
   }
  }

  calcNumsuccfail(): void{
    this.numsuccess = Math.round(this.success);
    this.numfailure = Math.round(this.failure);
  }

  calculateSuccessPercentage(numsuccess: number, numfailure: number): number {
    let totalInA = numsuccess + numfailure;
    return (numsuccess / totalInA) * 100;
  }
  calculateFailurePercentage(numsuccess: number, numfailure: number): number {
    let totalInA = numsuccess + numfailure;
    return (numfailure / totalInA) * 100;
  }
  runSimulations() {
   let numSimulationsValue = this.numSimulations;
   let numsuccess = this.data.numsuccess ?? 0;
   let numfailure = this.data.numfailure ?? 0;
   let totalSuccess = numsuccess;
   let totalGroup = numsuccess + numfailure;
   const totalElements = this.sampleSize;
   this.barChartData2 = this.barChartData2 = [
    { 
      data: [], 
      label: this.translate.instant('opc_barchart_s'),
      backgroundColor: 'green',
      hoverBackgroundColor: 'green', 
    }, 
    { 
      data: [], 
      label: this.translate.instant('opc_barchart_f'), 
      backgroundColor: 'red',
      hoverBackgroundColor: 'red',
    }];

    for (let simIdx = 0; simIdx < numSimulationsValue; simIdx++) {
      let allItems = new Array(totalGroup);
      allItems.fill(0);
      allItems.fill(1, 0, totalSuccess);
      const shuffled = SamplingService.shuffle(allItems);
      const { chosen } = SamplingService.randomSubset(shuffled, totalElements);
      const samplesuccess = MathService.countWhere(chosen, (data: number) => data == 1);
      const samplefailure = totalElements - samplesuccess;
      let sampleProportion: number = MathService.roundToPlaces(samplesuccess / totalElements, 4);
      this.sampleProportion = sampleProportion;

      const successPercentagee = (samplesuccess / totalElements) * 100;
      const failurePercentagee = (samplefailure / totalElements) * 100;
  
      this.barChartData2[0].data = this.barChartData2[0].data || [];
      this.barChartData2[1].data = this.barChartData2[1].data || [];
    
      if (this.sampleSize !== totalElements) {
        this.sampleSize = totalElements;
        this.sampleMeans = [];
      }
  
      this.simulations.push(sampleProportion);
  
      let summary = {
        samplesuccess,
        samplefailure,
        sampleProportion,
      };
    
      this.randomizedsuccess = samplesuccess;
      this.randomizedfailure = samplefailure;

      this.Summaries.updateSummaryElements(this.summaryElements, summary);
  
      this.barChartData2[0].data[simIdx] = MathService.roundToPlaces(successPercentagee, 2);
      this.barChartData2[1].data[simIdx] = MathService.roundToPlaces(failurePercentagee, 2);
    }
    this.mean = MathService.mean(this.simulations);
    this.stddev = MathService.stddev(this.simulations);
    this.total = this.simulations.length;
    this.buildci();
    
  }

  buildci(){
    if(this.CiRadio === 'CI'){
      const confidenceLevel = this.confidenceLevel || 100

      if(confidenceLevel == 0) {
        return
      }

      const [lower, upper] = MathService.getCutOffInterval(confidenceLevel, this.simulations.length)
      const temp = this.simulations.map(val => val)

      temp.sort((a, b) => a - b)

      const [chosen, unchosen] = SamplingService.splitUsing(temp, (val: any) => {
        return val >= temp[lower] &&  val <= temp[upper >= temp.length ? upper - 1: upper]
      })

      this.lower = temp[lower]
      this.upper = temp[upper >= temp.length ? upper - 1: upper]

      this.setDataFromRaw(this.chart3, [chosen, unchosen])
      this.scaleToStackDots(this.chart3)

      this.chart3.update()

      this.updateInfoSampleMeans(chosen.length, unchosen.length)
    }

    if (this.CiRadio === 'MinMax') {

      const dataCustomChart = this.splitByPredicate(
        this.simulations,
        this.predicateForTail(this.minTailValInput, this.maxTailValInput)
      )

      this.upper = this.maxTailValInput
      this.lower = this.minTailValInput

      this.setDataFromRaw(this.chart3, [dataCustomChart.chosen, dataCustomChart.unchosen])
      this.scaleToStackDots(this.chart3)
      this.chart3.update()

      this.updateInfoSampleMeans(dataCustomChart.chosen.length, dataCustomChart.unchosen.length)
    }

  }

  resetAllBut(remove: string[]): Record<string, any>{
    const keys = Object.keys(this.summaryElements)
    const result: Record<string, any> ={};
    keys.forEach(key => {
      if (!remove.includes(key)){
        result[key] = this.noData
      }
    })
    return result
  }

  update() {
    this.chart.update();
  }

  setProportions(chart: Chart, { numsuccess, numfailure}: { numsuccess: any, numfailure: any}) {
    let totalInA = numsuccess + numfailure
    chart.data.datasets[0].data[0] = MathService.roundToPlaces(100 * numsuccess / totalInA, 2)
    chart.data.datasets[1].data[0] = MathService.roundToPlaces(100 * numfailure / totalInA, 2)
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

    return chart
  }

  radioChange(str: string) {
    this.CiRadio = str

    if (str === 'CI'){
      this.CiDisabled = false
      this.MinMaxDisabled = true
    }

    if (str === 'MinMax') {
      this.CiDisabled = true
      this.MinMaxDisabled = false
    }
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

  updateInfoSampleMeans(totalChosen: number, totalUnchosen: number) {
    const proportionChosen = MathService.roundToPlaces(totalChosen / this.total, 4)
    const proportionUnchosen = MathService.roundToPlaces(totalUnchosen / this.total, 4)

    this.sampleMeansChosen = `${totalChosen} / ${this.total} = ${proportionChosen}`
    this.sampleMeansUnchosen = `${totalUnchosen} / ${this.total} = ${proportionUnchosen}`
  }
}
