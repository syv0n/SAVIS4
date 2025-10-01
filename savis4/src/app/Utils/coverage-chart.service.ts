import { Injectable } from '@angular/core';
// Ensure you've imported Chart.js in your project before using it
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class CoverageChartService {
  orientation: any;
  axis: any;
  chart: any;

  constructor() { 
    this.orientation = {
      horizontal: {
        h: 'x',
        v: 'y'
      },
      vertical: {
        h: 'y',
        v: 'x'
      }
    };
  }

  createChart(canvasEle: any, importData: any, orientation: string) {
    this.axis = this.orientation['horizontal' || orientation];

    this.chart = new Chart(canvasEle, {
      type: 'scatter',
      data: {
          datasets: importData
      },
      options: {
          animation: {
              duration: 0
          },
          elements: {
              line: {
                  fill: false
              }
          },
          responsive: true,
          scales: {
              xAxes: [{
                  ticks: {
                      min: 0,
                      //max: 1
                      suggestedMax: 100,
                      stepSize: 1
                  },
                  scaleLabel: {
                      display: true,
                      labelString: ''
                  }
              }],
              yAxes: [{
                  ticks: {
                      /*min: 1,
                      max: 2,*/
                      stepSize: 1,
                  },
                  scaleLabel: {
                      display: true,
                      labelString: ''
                  }
              }]
          },
          showLines: true
      }
    });
  }

  round(number: number): number {
    return Math.ceil(number * 1000) / 1000;
  }

  setScales(config: any) {
    const hMin = config.x_init || 0;
    const hMax = config.x_term || 1;
    const vMin = config.y_init || 1;
    const vMax = config.y_term || 2;

    const hDiff = hMax - hMin;
    const vDiff = vMax - vMin;
    const hStep = hDiff ? Math.floor(hDiff * 0.1) : 1;
    const vStep = vDiff != 0 ? Math.floor(vDiff * 0.2) : 1;
    this.chart.options.scales[this.axis.h + 'Axes'][0].ticks.stepSize = hStep;
    this.chart.options.scales[this.axis.v + 'Axes'][0].ticks.stepSize = vStep;
  }

  setAxisLabels(xLabel: string, yLabel: string) {
    this.chart.options.scales.xAxes[0].scaleLabel.labelString = xLabel;
    this.chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
  }

  clear() {
    for (let dataset of this.chart.data.datasets) {
      dataset.data = [];
    }

    this.setScales({});
  }
  
  updateChartData(rawDataArrays: any[]) {
    for (let idx = 0; idx < rawDataArrays.length; idx++) {
      this.chart.data.datasets[idx].data = rawDataArrays[idx];
    }
  }
}