import { Injectable } from '@angular/core';
import * as Chart from 'chart.js'; // Import Chart.js library

@Injectable({
  providedIn: 'root'
})
export class BarChartService {
  zoomIn: boolean = false;
  chart: any;

  constructor() { }

  createChart(canvasEle: any, datasets: any[], translation: any) {
    this.zoomIn = false;
    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontStyle = 'bold';
    Chart.defaults.global.defaultFontColor = "black";
    
    this.chart = new Chart(canvasEle, {
      type: "bar",
      data: {
        labels: [],
        datasets: datasets
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 1,
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: translation.yAxisTitle,
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                minRotation: 45,
                maxRotation: 45,
              },
              scaleLabel: {
                display: true,
                labelString: translation.xAxisTitle,
              }
            }  
          ]
        },
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }

  setScale(floor: number, ceil: number) {
    this.chart.options.scales.yAxes[0].ticks.min = floor;
    this.chart.options.scales.yAxes[0].ticks.max = ceil;
    this.chart.update();
  }

  clearChart() {
    this.chart.data.labels = [];
    this.chart.data.datasets[0].data = [];
    this.chart.options.scales.yAxes[0].ticks.max = 1;
    this.chart.update();
  }

  updateChartData(labels: any[], contElements: any[]) {
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = contElements;
    // ... [Rest of the logic if required]
    this.chart.update();
  }
}