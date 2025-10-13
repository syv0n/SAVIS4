//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartDataSets, ChartType, Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-user-manual',
  templateUrl: './tmht.component.html',
  styleUrls: ['./tmht.component.scss']
})
export class TMHTProblemsComponent implements AfterViewInit {

  @ViewChild('diffChart') chart5Ref: ElementRef<HTMLCanvasElement>

  chart5: Chart;

  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = '100'; //hardcoded the correct answer

  constructor(
    private translate: TranslateService,
  ) { }

  submitAnswer(){
    this.answerIsCorrect = this.inputAnswer.trim()===this.correctAnswer;
    this.showAnswer = true;
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
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
                  min: -5.4,
                  max: 75,
                  stepSize: 10,
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
                  min: 1,
                  max: 7,
                  //stepSize: 1,
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

}