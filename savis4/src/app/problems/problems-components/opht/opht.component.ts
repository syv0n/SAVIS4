//import { Component, OnInit } from '@angular/core';
import { AfterViewInit, Component, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-user-manual',
  templateUrl: './opht.component.html',
  styleUrls: ['./opht.component.scss']
})
export class OPHTProblemsComponent implements AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas: ElementRef<HTMLCanvasElement>

  chart: Chart;

  problemText: string = '';
  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = ''; //hardcoded the correct answer (false)

  acceptedRejectAnswers = [
      'reject',
      'reject h0',
      'reject h₀',
      'reject the null',
      'reject null hypothesis',
      'reject the null hypothesis'
    ];
  acceptedFailAnswers = [
    'fail',
    'fail to reject',
    'fail to reject h0',
    'fail to reject h₀',
    'do not reject',
    'do not reject h0',
    'do not reject the null',
    'do not reject null hypothesis'
    
  ];

  noOfCoin: number = 5

  interval: number = 0
  
  colors = {
    sample: "rgba(255, 0, 0, 0.7)",
      binomial: "rgba(0, 0, 255, 0.6)",
      selected: "rgba(0, 255, 0, 0.6)",
      line: "rgba(0, 255, 0, 0.6)",
      box: "rgba(0, 255, 0, 0.1)",
      invisible: "rgba(0, 255, 0, 0.0)"
  }

  constructor(
    private translate: TranslateService,
  ) {}

  generateNewProblem(): void {
    const sampleSize = this.randomInt(40, 100);
    const successes = this.randomInt(Math.floor(sampleSize * 0.3), Math.floor(sampleSize * 0.7));
    const hypothesizedP = [0.4, 0.5, 0.6][Math.floor(Math.random() * 3)];
    const confidence = [0.90, 0.95, 0.99][Math.floor(Math.random() * 3)];

    this.problemText = `A college professor believes that a coin is fair, meaning the probability of getting heads is ${hypothesizedP}.
    The coin is flipped ${sampleSize} times, and it lands on heads ${successes} times.
    Conduct a one-proportion hypothesis test at the ${confidence * 100}% confidence level to determine whether the coin is fair.`;

    const pHat = successes / sampleSize;
    const se = Math.sqrt(hypothesizedP * (1 - hypothesizedP) / sampleSize);
    const z = (pHat - hypothesizedP) / se;

    let zCritical = 1.96;
    if (confidence === 0.90) zCritical = 1.645;
    if (confidence === 0.99) zCritical = 2.575;

    this.correctAnswer = Math.abs(z) > zCritical ? 'Reject H₀' : 'Fail to Reject H₀';

    this.inputAnswer = '';
    this.showAnswer = false;

    this.updateChart(pHat, hypothesizedP)
  }

  //helper for generateNewProblem()
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  updateChart(pHat: number, hypothesizedP: number): void {
    const context = this.chartCanvas.nativeElement.getContext('2d');

    if (!context) return;
    
    const labels = ['Hypothesized (p₀)', 'Observed (p̂)'];
    const data = [hypothesizedP, pHat];
    const colors = ['rgba(13, 13, 172, 0.6)', 'rgba(255,99,132,0.6)'];

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.data.datasets[0].backgroundColor = colors;
      this.chart.update();
    } else {
      this.chart = new Chart(context, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Proportion comparison',
              data,
              backgroundColor: [colors]
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: { beginAtZero: true, max: 1}
            }],
            xAxes:[{
              ticks: { autoSkip: false }
            }]
          },
          legend: { display: false }
        }
      });
    }
  }

  submitAnswer(){
    const normalize = (s: string) =>
      s
    .toLowerCase()
    .replace(/o/g, '0')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

    const userInput = normalize(this.inputAnswer);

    const isReject = 
    this.acceptedRejectAnswers.some(ans => userInput === normalize(ans)) &&
    this.correctAnswer.startsWith('Reject');

    const isFail =
    this.acceptedFailAnswers.some(ans => userInput === normalize(ans)) &&
    this.correctAnswer.startsWith('Fail');

    this.answerIsCorrect = isReject || isFail;
    this.showAnswer = true;
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  ngAfterViewInit(): void{
    this.createChart();
    this.generateNewProblem();
  }

  createChart(): void {
    const context = this.chartCanvas.nativeElement.getContext('2d')
    if(context){
      this.chart = new Chart(context, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: this.translate.instant('op_bar_sample'),
              data: [],
              borderWidth: 1,
              // id: 'x-axis-1',
              backgroundColor: this.colors.sample,
              hidden: false,
            },
            {
              type: 'line',
              label: this.translate.instant('op_bar_binomial'),
              data: [],
              borderWidth: 1,
              // id: 'x-axis-2',
              borderColor: this.colors.binomial,
              backgroundColor: this.colors.binomial,
              pointRadius: 3,
              pointHoverRadius: 15,
              pointHoverBackgroundColor: this.colors.binomial,
              fill: false,
              hidden: false,
              showLine: false,
            },
            {
              type: 'line',
              label: this.translate.instant('op_bar_selected'),
              data: [],
              borderWidth: 0.1,
              // id: 'x-axis-3',
              backgroundColor: this.colors.selected,
              hidden: false,
              fill: 'end',
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  autoSkip: true,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('op_bar_num_samples'),
                  // fontColor: 'black',
                  // fontSize: 14
                }
              }
            ],
            xAxes: [
              {
                // barPercentage: 1.0,
                scaleLabel: {
                  display: true,
                  labelString: `${this.translate.instant('op_bar_heads')} ` + this.noOfCoin + ` ${this.translate.instant('op_bar_heads2')}`,
                  // fontColor: 'black',
                  // fontSize: 14
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: true,
          tooltips: {
            mode: 'index',
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            callbacks: {
              title: function(tooltipItem, data) {
                if (tooltipItem[0]) {
                  let title = tooltipItem[0].xLabel || ''
                  title += ` heads`;
                  return title.toString(); // Explicitly convert to string
                }
                return '' // Return an empty string if tooltipItem[0] is undefined
              },
              label: (tooltipItem, data) => {
                if (tooltipItem && tooltipItem.datasetIndex !== undefined) {
                  if (tooltipItem.datasetIndex !== 2) {
                    return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${tooltipItem.yLabel}`;
                  } else {
                    return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${
                      this.interval
                    }`
                  }
                }
                return '' // Return an empty string if tooltipItem or tooltipItem.datasetIndex is undefined
              }
            }
          }
        }  
      })
    }
  }
}  