//import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart }  from 'chart.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-manual',
  templateUrl: './tpht.component.html',
  styleUrls: ['./tpht.component.scss']
})
export class TPHTProblemsComponent implements AfterViewInit {

  @ViewChild('chart1') chart1Ref: ElementRef<HTMLCanvasElement>

  chart1: Chart;

  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = '100'; //hardcoded the correct answer

  constructor(
    private translate: TranslateService
  ) { }

  submitAnswer(){
    this.answerIsCorrect = this.inputAnswer.trim()===this.correctAnswer;
    this.showAnswer = true;
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  ngAfterViewInit(): void {
    this.CreateChart1()
  }  

  CreateChart1(): void {
      const ctx = this.chart1Ref.nativeElement.getContext('2d');
      
      if (ctx) {
          this.chart1 = new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: [this.translate.instant('tp_group_A'), this.translate.instant('tp_group_B')],
                  datasets: [],
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

}
