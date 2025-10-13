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

  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = '100'; //hardcoded the correct answer


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

  submitAnswer(){
    this.answerIsCorrect = this.inputAnswer.trim()===this.correctAnswer;
    this.showAnswer = true;
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  ngAfterViewInit(): void{
    this.createChart();
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