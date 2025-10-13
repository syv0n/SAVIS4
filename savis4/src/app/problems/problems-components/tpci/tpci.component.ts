//import { Component, OnInit } from '@angular/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartPoint } from 'chart.js';

@Component({
  selector: 'app-user-manual',
  templateUrl: './tpci.component.html',
  styleUrls: ['./tpci.component.scss']
})
export class TPCIProblemsComponent implements AfterViewInit {

  @ViewChild('chart1') chart1Ref: ElementRef<HTMLCanvasElement>;
  
  chart1: Chart;

  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = '100'; //hardcoded the correct answer

  constructor(
    private translate: TranslateService
  ) {}

  submitAnswer(){
    this.answerIsCorrect = this.inputAnswer.trim()===this.correctAnswer;
    this.showAnswer = true;
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  ngAfterViewInit(): void {
    this.createChart1();
  }

  createChart1() {
      const ctx = this.chart1Ref.nativeElement.getContext('2d');
      if (ctx) {
        this.chart1 = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              this.translate.instant('tpci_group_A'),
              this.translate.instant('tpci_group_B'),
            ],
            datasets: [
              {
                label: '% ' + this.translate.instant('tpci_successes'),
                backgroundColor: 'green',
                data: [0, 0],
              },
              {
                label: '% ' + this.translate.instant('tpci_failures'),
                backgroundColor: 'red',
                data: [0, 0],
              },
            ],
          },
          options: {
            scales: {
              xAxes: [
                {
                  stacked: true,
                  ticks: {
                    max: 100,
                  },
                },
              ],
              yAxes: [
                {
                  id: 'groupAAxis',
                  stacked: true,
                  ticks: {
                    max: 100,
                  },
                },
              ],
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }

}
