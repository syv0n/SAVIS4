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

    /*this.chart.options.scales[this.axis.h + 'Axes'][0].ticks.min = hMin;
    this.chart.options.scales[this.axis.h + 'Axes'][0].ticks.max = hMax;
    this.chart.options.scales[this.axis.v + 'Axes'][0].ticks.min = vMin;
    this.chart.options.scales[this.axis.v + 'Axes'][0].ticks.max = vMax;
    this.chart.options.scales[this.axis.h + 'Axes'][0].ticks.max = hMax;*/
    const hStep = hDiff ? Math.floor(hDiff * 0.1) : 1;
    const vStep = vDiff != 0 ? Math.floor(vDiff * 0.2) : 1;
    this.chart.options.scales[this.axis.h + 'Axes'][0].ticks.stepSize = hStep;
    this.chart.options.scales[this.axis.v + 'Axes'][0].ticks.stepSize = vStep;
    //this.chart.data.labels = [];
    //for (let it = 1; it < (hMax / hStep); it++) {this.chart.data.labels.push(it * hStep)};
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
  }/*

  buildCoverageIntervals(arr){
      let it, sampleMean, processedStd, lower, upper, minNum, maxNum, assignedDataset, tmp
      let inInterval = [], notInInterval = []
      const centMean = arr[arr.length - 1]

      for (it = 0; it < arr[0].length; it++) {
          sampleMean = arr[0][it]
          processedStd = arr[1][it]
          // Confidence Interval Formula
          // x_bar +/- ( 2 * sample_std / sqrt(sample size) )
          lower = sampleMean - processedStd
          upper = sampleMean + processedStd
          if (lower < minNum || !minNum)  minNum = lower
          if (upper > maxNum || !maxNum)  maxNum = upper

          assignedDataset = (lower <= centMean && centMean <= upper) ? inInterval : notInInterval

          assignedDataset.push(
              {x: it + 1, y: this.round(lower)},
              {x: it + 1, y: sampleMean},
              {x: it + 1, y: this.round(upper)},
              {x: undefined, y: undefined}
          )

      }
      it++
      tmp = inInterval.pop()
      tmp = notInInterval.pop()
      this.setScales({
          x_term: it,
          y_init: (minNum%1) ? Math.floor(minNum) : minNum-1,
          y_term: (maxNum%1) ? Math.ceil(maxNum) : maxNum+1
      })

      return [inInterval, notInInterval, [{x: 0, y: centMean}, {x: it, y: centMean}]]
  }*/

  

  updateChartData(rawDataArrays: any[]) {
    for (let idx = 0; idx < rawDataArrays.length; idx++) {
      this.chart.data.datasets[idx].data = rawDataArrays[idx];
    }
  }

  // Add more methods as needed
}