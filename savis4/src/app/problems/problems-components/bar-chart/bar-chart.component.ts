//import { Component, OnInit } from '@angular/core';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { Chart } from 'chart.js'


@Component({
  selector: 'app-problems',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartProblemsComponent implements AfterViewInit {

  @ViewChild('inputChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  inputChart: Chart;

  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = '100'; //hardcoded the correct answer

  constructor() { }

  submitAnswer(){
    this.answerIsCorrect = this.inputAnswer.trim()===this.correctAnswer;
    this.showAnswer = true;
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  ngAfterViewInit():void {
    this.createInputChart();
  }
  
  createInputChart(): void{
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.inputChart = new Chart(ctx,{ 
      type: 'bar',
      data:{
        labels:[], //empty labels for blank chart
        datasets:[{
          label: 'Input Data',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]  
      },
      options:{
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 0.1,
              fontColor: 'black',
              fontSize: 14,
              fontStyle: 'bold'
            },
            scaleLabel: {
              display: true,
              labelString: 'Proportions',
              fontColor: 'black',
              fontSize: 14,
              fontStyle: 'bold'
            }
          }],
          xAxes: [{
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              fontColor: 'black',
              fontSize: 14,
              fontStyle: 'bold'
            },
            scaleLabel: {
              display: true,
              labelString: 'Categories',
              fontColor: 'black',
              fontSize: 14,
              fontStyle: 'bold'
            }
          }]
        }
      }
    })
  }
}  