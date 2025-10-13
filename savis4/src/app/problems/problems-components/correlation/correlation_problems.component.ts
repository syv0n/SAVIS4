import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-problems',
  templateUrl: './correlation_problems.component.html',
  styleUrls: ['./correlation_problems.component.scss']
})
export class CorrelationProblemsComponent implements AfterViewInit, OnDestroy{

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>

  inputChart: Chart;

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
    this.createInputChart()
  }  

  ngOnDestroy(): void{
    if(this.inputChart){
      this.inputChart.destroy();
    }
  }

  createInputChart(): void {
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.inputChart = new Chart(ctx, {
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
                  labelString: this.translate.instant('Data'),
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
                  labelString: this.translate.instant('Data'),
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

}


