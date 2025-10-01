import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart }  from 'chart.js';
import {MathService} from 'src/app/Utils/math.service'
import { ChartDataSets } from 'chart.js';
import { Sampling } from 'src/app/Utils/sampling';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-two-proportions',
  templateUrl: './two-proportions.component.html',
  styleUrls: ['./two-proportions.component.scss']
})
export class TwoProportionsComponent implements OnInit, AfterViewInit {
    static splitByPredicate(iterable: number[], isEven: (num: number) => boolean) {
        throw new Error('Method not implemented.');
    }
    static updateInfoSampleProp(component: { simulations: any[]; totalsamples_chart3: number; extremediff_chart3: string; propextremediff_chart3: string; }, totalChosen: number, totalUnchosen: number) {
        throw new Error('Method not implemented.');
    }

  // Your existing variables
  numASuccess: number = 0;
  numAFailure: number = 0;
  numBSuccess: number = 0;
  numBFailure: number = 0;
  sampleProportionA: number = 0;
  sampleProportionB: number = 0;
  sampleProportionDiff: number = 0;
  sampleAFailure: number;
  sampleASuccess: number;
  sampleBFailure: number;
  sampleBSuccess: number;
  numSimulations: number;
  isDataLoaded: boolean = false;
  selectedTestOption: string;
  prop_diff: number;
  samDisActive: boolean = false;
  proportionDiff: number;
  meanSampleDiffs: number;
  stddevSampleDiffs: number;
  totalSamples: number;
  extremediff: number;
  propextremediff: number;
  minTailValInput:number;
  simulations: number[] = []
  samplePropDiff:number

  numofSem: number = 1;
  activateSim: boolean = true;
  mean_diff: number;
  sections: any = {
    sectionOne: true,
    sectionTwo: true,
    sectionThree: true,
  };
  lastSummary: any

  @ViewChild('chart1') chart1Ref: ElementRef<HTMLCanvasElement>
  @ViewChild('chart2') chart2Ref: ElementRef<HTMLCanvasElement>
  @ViewChild('chart3') chart3Ref: ElementRef<HTMLCanvasElement>
  
  chart1: Chart
  chart2: Chart
  chart3: Chart

  sampleProportionA_chart2: string = 'NaN';
  sampleProportionB_chart2: string = 'NaN';
  sampleProportionDiff_chart2: string = 'NaN';
  stddev_chart3: string = 'NaN';
  sampleMeanDiff_chart3: String = 'NaN';
  totalsamples_chart3: String = 'NaN';
  extremediff_chart3: String = 'NaN';
  propextremediff_chart3: String = 'NaN';
  tp_minTailValInput: Number = 0
  tp_maxTailValInput: Number = 0

  includeValMin:boolean = true;
  includeValMax:boolean = true;

  numberOfSimulations: number;

  
  toggleSection(e: any, sec: string) {
    this.sections[sec] = e.target.checked;
  }
  dataTextArea: string = '';
  data: any

  public barChartData1: ChartDataSets[] = [
    {
      label: `% ${this.translate.instant('tp_successes')}`,
      backgroundColor: 'green',
      data: [0, 0], // Data points for success and failure for Group A
    },
    {
      label: `% ${this.translate.instant('tp_failure')}`,
      backgroundColor: 'red', // Colors for success and failure bars for Group B
      data: [0, 0], // Data points for success and failure for Group B
    },
  ];
  public barChartData2: ChartDataSets[] = [
    {
      label: `% ${this.translate.instant('tp_successes')}`,
      backgroundColor: 'green',
      data: [0, 0], // Data points for success and failure for Group A
    },
    {
      label: `% ${this.translate.instant('tp_failure')}`,
      backgroundColor: 'red', // Colors for success and failure bars for Group B
      data: [0, 0], // Data points for success and failure for Group B
    },
  ];
  
  public barChartData3: ChartDataSets[] = [

        { label: 'Differences', backgroundColor: "green", data: [] },
        { label: "N/A", backgroundColor: "red", data: [] }
  ];
  
  constructor(
    private cdr: ChangeDetectorRef,
    private sampling: Sampling,
    private translate: TranslateService
    ) { }

  shuffleArray() {
    // Create an array
    const array = [1, 2, 3, 4, 5];

    // Shuffle the array using the sampling service
    const shuffledArray = this.sampling.shuffle(array);

    console.log(shuffledArray); // Shuffled array
  }



  ngOnInit(): void {
    this.numASuccess = 0;
    this.numAFailure = 0;
    this.numBSuccess = 0;
    this.numBFailure = 0;

    this.numofSem = 1 
  }

  ngAfterViewInit(): void {
    this.CreateChart1()
    this.CreateChart2()
    this.CreateChart3()
  }

  CreateChart1(): void {
    const ctx = this.chart1Ref.nativeElement.getContext('2d');
    
    if (ctx) {
        this.chart1 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [this.translate.instant('tp_group_A'), this.translate.instant('tp_group_B')],
                datasets: this.barChartData1,
            },
            options: {
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            max: 100,
                        },
                    }],
                    yAxes: [{
                        id: 'groupAAxis',
                        stacked: true,
                        ticks: {
                            max: 100,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: ''
                        }
                    }]
                },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Corrected background color
                    callbacks: {
                        title: function(tooltipItem) {
                            let title = tooltipItem[0].xLabel || '';
                            return title.toString();
                        },
                        label: (tooltipItem, data) => {
                            return tooltipItem.yLabel + data.datasets[tooltipItem.datasetIndex].label;
                        }
                    }
                }
            }
        });
    }
}

CreateChart2(): void {
  const ctx = this.chart2Ref.nativeElement.getContext('2d');
  
  if (ctx) {
      this.chart2 = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: [this.translate.instant('tp_group_A'), this.translate.instant('tp_group_B')],
              datasets: this.barChartData2, // TODO: replace with a new dataset
          },
          options: {
              scales: {
                  xAxes: [{
                      stacked: true,
                      ticks: {
                          max: 100,
                      },
                  }],
                  yAxes: [{
                      id: 'groupAAxis',
                      stacked: true,
                      ticks: {
                          max: 100,
                      },
                      scaleLabel: {
                          display: true,
                          labelString: ''
                      }
                  }]
              },
              responsive: true,
              maintainAspectRatio: false,
              tooltips: {
                  mode: 'index',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Corrected background color
                  callbacks: {
                      title: function(tooltipItem) {
                          let title = tooltipItem[0].xLabel || '';
                          return title.toString();
                      },
                      label: (tooltipItem, data) => {
                          return tooltipItem.yLabel + data.datasets[tooltipItem.datasetIndex].label;
                      }
                  }
              }
          }
      });
  }
}

CreateChart3(): void {
  const ctx = this.chart3Ref.nativeElement.getContext('2d');
  
  if (ctx) {
      this.chart3 = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('tp_differences'),
              backgroundColor: 'green',
              data: [],
            },
            {
              label: this.translate.instant('tp_differences'),
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
                  labelString: this.translate.instant('tp_diff_mean'),
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
                  labelString: this.translate.instant('tp_freq'),
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

loadData(): void {
  let numAS = this.numASuccess * 1;
  let numAF = this.numAFailure * 1; 
  let numBS = this.numBSuccess * 1; 
  let numBF = this.numBFailure * 1;
  
  if (numAS <= 0 || numAF <= 0 || numBS <= 0 || numBF <= 0) {
    alert('Inputs need to be at least one');
  } else {
      // Calculate proportions
      this.sampleProportionA = this.roundToPlaces(numAS / (numAS + numAF), 2);
      this.sampleProportionB = this.roundToPlaces(numBS / (numBS + numBF), 2);
      this.sampleProportionDiff = this.roundToPlaces(this.sampleProportionA - this.sampleProportionB, 2);
     
      // Update chart 1
      this.setProportions(this.chart1, {
          numASuccess: numAS,
          numAFailure: numAF,
          numBSuccess: numBS,
          numBFailure: numBF
      });
      this.chart1.update();
      
      this.setProportions(this.chart2, {
          numASuccess: 0,
          numAFailure: 0,
          numBSuccess: 0,
          numBFailure: 0
      });
       this.chart2.update();
  }
}

runSim() {
    console.log('run sim started')
    let numSimulations = this.numofSem * 1;
    let totalSuccess = this.numASuccess + this.numBSuccess;
    let totalFailure = this.numAFailure + this.numBFailure;
    let totalGroupA = this.numASuccess + this.numAFailure;
    let totalGroupB = this.numBSuccess + this.numBFailure;
    let allItems, shuffled, sampleA, sampleASuccess, sampleAFailure, sampleAProportion = [];
    let sampleB, sampleBSuccess, sampleBFailure, sampleBProportion = [];
    for (let simIdx = 0; simIdx < numSimulations; simIdx++) {
      console.log('inside forloop of run sim')
      allItems = new Array(totalGroupA + totalGroupB);
      allItems.fill(0);
      allItems.fill(1, 0, totalSuccess);
      shuffled = this.sampling.shuffle(allItems);
      sampleA = shuffled.slice(0, totalGroupA);
      sampleB = shuffled.slice(totalGroupA);
      sampleASuccess = MathService.countWhere(sampleA, (x: number) => x == 1);
      sampleBSuccess = MathService.countWhere(sampleB, (x: number) => x == 1);
      sampleAFailure = totalGroupA - sampleASuccess;
      sampleBFailure = totalGroupB - sampleBSuccess;
      this.sampleProportionA_chart2 = (String) (MathService.roundToPlaces((sampleASuccess / totalGroupA),2));
      this.sampleProportionB_chart2 = (String) (MathService.roundToPlaces((sampleBSuccess / totalGroupB),2));
      this.samplePropDiff=(this.roundToPlaces(((sampleASuccess - sampleBSuccess) / (totalGroupA + totalGroupB)),2));
      this.simulations.push(this.samplePropDiff);
      this.sampleProportionDiff_chart2=  (String) (this.samplePropDiff);
      if (simIdx + 1 === numSimulations) {
        this.setProportions(this.chart2, {
          numASuccess: sampleASuccess,
          numBSuccess: sampleBSuccess,
          numAFailure: totalGroupA - sampleASuccess,
          numBFailure: totalGroupB - sampleBSuccess,
          
        });
        
      }
      allItems = [];
    }
    this.chart2.update();
    this.sampleMeanDiff_chart3 = (String)(MathService.roundToPlaces((MathService.mean(this.simulations)),2));
    this.stddev_chart3 = (String)(MathService.roundToPlaces((MathService.stddev(this.simulations)),2));
    this.totalsamples_chart3 = (String)(this.simulations.length);
    this.buildDiffOfProp();
    
    
  }

  buildDiffOfProp(){
    const tmpChecked = {min: this.includeValMin, max: this.includeValMax}

    const dataCustomChart = this.splitByPredicate(
      this.simulations,
      this.predicateForTail(this.tp_minTailValInput, this.tp_maxTailValInput, this.includeValMin,this.includeValMax)
    )

    this.chart3.data.datasets[0].label = `${this.tp_minTailValInput} ≤ ${this.translate.instant('tp_differences')} < ${this.tp_maxTailValInput}` 
    this.chart3.data.datasets[1].label = `${this.translate.instant('tp_differences')} < ${this.tp_minTailValInput} ∪ ${this.tp_maxTailValInput} ≤ ${this.translate.instant('tp_differences')}`

    this.setDataFromRaw(this.chart3, [dataCustomChart.chosen, dataCustomChart.unchosen])
    this.scaleToStackDots(this.chart3)
    this.chart3.update()

    this.updateInfoSampleProp(dataCustomChart.chosen.length, dataCustomChart.unchosen.length)

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
   

  predicateForTail(left: any, right: any, includeValMin: boolean, includeValMax: boolean) {
    if (includeValMin && includeValMax) {
        return function (x: any) {
            return x >= left && x <= right;
        };
    } else if (includeValMin && !includeValMax) {
        return function (x: any) {
            return x >= left && x < right;
        };
    } else if (!includeValMin && includeValMax) {
        return function (x: any) {
            return x > left && x <= right;
        };
    } else if (!includeValMin && !includeValMax) {
        return function (x: any) {
            return x > left && x < right;
        };
    } else return null;
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
  updateInfoSampleProp(totalChosen: number, totalUnchosen: number) {
    // Convert this.totalsamples_chart3 from String object to string
    const totalSamples: number = parseFloat(this.totalsamples_chart3.toString());

    // Calculate proportions
    const proportionChosen = MathService.roundToPlaces(totalChosen / totalSamples, 4);
    const proportionUnchosen = MathService.roundToPlaces(totalUnchosen / totalSamples, 4);

    // Update extreme difference and proportion of extreme difference
    this.extremediff_chart3 = (String)(this.simulations.length - totalChosen)
    this.propextremediff_chart3 = `${totalChosen} / ${this.simulations.length} = ${proportionChosen}`
}

  
  setProportions(chart:Chart, { numASuccess, numAFailure, numBSuccess, numBFailure } : { numASuccess: any; numAFailure: any; numBSuccess: any; numBFailure: any }): void{
    let totalInA = numASuccess + numAFailure
    let totalInB = numBSuccess + numBFailure
    let totalSuccess = numASuccess + numBSuccess
    let totalFailure = numAFailure + numBFailure

    chart.data.datasets[0].data[0] = this.roundToPlaces(100 * numASuccess/ totalInA, 2)
    chart.data.datasets[0].data[1] = this.roundToPlaces(100 * numBSuccess / totalInB, 2)
    chart.data.datasets[1].data[0] = this.roundToPlaces(100 * numAFailure / totalInA, 2)
    chart.data.datasets[1].data[1] = this.roundToPlaces(100 * numBFailure / totalInB, 2)
  }

  roundToPlaces(values: any, places: any) {
    let pow10 = Math.pow(10, places)
    return Math.round(values * pow10) / pow10 
  }


}
