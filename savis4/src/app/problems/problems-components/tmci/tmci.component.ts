//import { Component, OnInit } from '@angular/core';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ChartDataSets, ChartType, Chart, ChartPoint } from 'chart.js';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-manual',
  templateUrl: './tmci.component.html',
  styleUrls: ['./tmci.component.scss']
})
export class TMCIProblemsComponent implements AfterViewInit {

  @ViewChild('chart5') chart5Ref: ElementRef<HTMLCanvasElement>;
  
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
    this.createChart5();
  }  

  createChart5() {
      const ctx = this.chart5Ref.nativeElement.getContext('2d');
      if (ctx) {
        this.chart5 = new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: this.translate.instant('tpci_values_in_interval'),
                backgroundColor: 'green',
                data: [],
              },
              {
                label: this.translate.instant('tpci_values_not_in_interval'),
                backgroundColor: 'red',
                data: [],
              },
            ],
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
                    labelString: '',
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    fontColor: 'black',
                    fontSize: 16,
                    padding: 0,
                    min: 1,
                    max: 7
                    //stepSize: 1,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: '',
                  },
                },
              ],
            },
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
              backgroundColor: 'rgba(0, 0, 0, 1.0)',
              bodyFontStyle: '16',
            },
            animation: {
              duration: 0,
            },
            elements: {
              point: {
                radius: 10,
              },
            },
          },
        });
      }
    }  
  }

