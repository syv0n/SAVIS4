//import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartType, Chart } from 'chart.js';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-user-manual',
  templateUrl: './opci.component.html',
  styleUrls: ['./opci.component.scss']
})
export class OPCIProblemsComponent implements AfterViewInit {

  @ViewChild('chart3') chart3Ref: ElementRef<HTMLCanvasElement>

  chart!: Chart;


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

  ngAfterViewInit(): void {
    const ctx = this.chart3Ref.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx,{
        type: 'bar',
        data: {
          labels: this.barChartLabels1,
          datasets: this.barChartData1
        },
        options: this.barChartOptions1
      })
    }
  }
}
