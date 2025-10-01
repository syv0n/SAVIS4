import { Inject, ElementRef, Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { minmax } from '../Dto/twomean';

@Injectable({
  providedIn: 'root'
})
export class StackedDotChartService {
  private domElement: any;
  private datasets: any[] = [];
  private chart: any;
  options: any;
  minmax: minmax;
  private bucketWidth: number = 0;
  config: any = {
    data: {
      label: '',
      data: 0,
      backgroundColor: 'orange',
      pointRadius: 8,
    },
    options: {
      xmin: 0,
      xmax: 0,
      stepSize: 1,
      ylabel:"",
      xlabel:"",
    }
  }
  constructor() {
  }

  initChart(domElement: any, datasets: any[], options: any = {}) {
    this.domElement = domElement;
    this.datasets = datasets

    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontStyle = 'bold';
    Chart.defaults.global.defaultFontColor = "black";
    if (this.domElement) {

      this.chart = new Chart(domElement, {

        type: "scatter",
        data: {

          datasets: [{
            label: 'Scatter Dataset',
            data: this.datasets,
            backgroundColor: 'orange',
            pointRadius: 8,
          }]
        },

        options: {

          scales: {
            xAxes: [{
              ticks: {
                fontColor: 'black',
                fontSize: 16,
                padding: 0,
                min: -5.4,
                max: 75
              },
              scaleLabel: {
                display: true,
                labelString: "",
              }
            }],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0, 
                  stepSize: 1,
                  max: 8
                },
                scaleLabel: {
                  display: true,
                  labelString: "",
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0,0,0,1.0)',
            bodyFontStyle: 'normal',
          }
        }
      });
    }

    options = options || {};
    this.options = {
      autoBuckets: options.autoBuckets !== undefined ? options.autoBuckets : true,
      bucketWidth: options.bucketWidth,
    };
  }

 

  round(x: number, bucketSize: number = NaN): number {
    if (!bucketSize) {
      if (this.options?.autoBuckets) {
        let scale = this.chart.scales['x-axis-1'];
        let inScaleWidth = this.minmax?.max - this.minmax?.min
        let chartWidth = this.chart.width;
        let pointRadius = this.chart.data.datasets[0].pointRadius;
        bucketSize = 2 * pointRadius * (inScaleWidth / chartWidth);
      }
      else if (this.options.bucketWidth) {
        bucketSize = this.bucketWidth;
      }
    }
    if (bucketSize) {
      let r = Math.floor(x / bucketSize) * bucketSize;
      return r;
    }
    else {
      return x;
    }
  }

  rawToScatter(arrs: any[]): any[] {
    let faceted = [];
    let counts: { [key: string]: number } = {};
    let scatter = [];
    for (let item of arrs) {
      item = this.round(item);
      let y = (counts[item] = (counts[item] || 0) + 1);
      scatter.push({ x: item, y: y/*, n:*/ });
    }
    faceted.push(scatter);
    return faceted;
  }

  clear() {
    for (let dataset of this.chart.data.datasets) {
      dataset.data = [];
    }
    this.chart.options.scales.xAxes[0].ticks.min = 0;
    this.chart.options.scales.xAxes[0].ticks.max = 1;
  }

  setDataFromRaw(rawDataArrays: any): void {
    this.minmax = rawDataArrays.minmax
    let scatterArrays = this.rawToScatter(rawDataArrays.data);
    this.chart.data.datasets[0].data = scatterArrays[0];
    let max = 1;
    for (let dataset of scatterArrays) {
      for (let item of dataset) {
        max = Math.max(max, item.y);
      }
    }
    this.chart.options.scales.yAxes[0].ticks.stepSize = Math.pow(10, Math.floor(Math.log10(max)));
  }

  setScale(start: number, end: number): void {
    this.chart.options.scales.xAxes[0].ticks.min = (Math.floor(start)) ? Math.floor(start) : 0;
    this.chart.options.scales.xAxes[0].ticks.max = Math.ceil(end) + 1;
  }

  setAxisLabels(xLabel: string, yLabel: string) {
    this.chart.options.scales.xAxes[0].scaleLabel.labelString = xLabel;
    this.chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
  }

  scaleToStackDots() {
    let max = 1;
    for (let dataset of this.chart.data.datasets) {
      for (let item of dataset.data) {
        max = Math.max(max, item.y);
      }
    }

    this.chart.options.scales.yAxes[0].ticks.stepSize = (max > 10) ? Math.ceil(max * 0.2) : 1;
    if (max > 1000) this.chart.options.scales.yAxes[0].ticks.min = 0
  }



  updateLabelName(datasetIndex: number, labelName: string) {
    this.datasets[datasetIndex].label = labelName;
  }

  changeDotAppearance(pointRadius: number) {
    this.chart.data.datasets.forEach((x: any) => {
      x.pointRadius = pointRadius;
    });
  }

  setAnimationDuration(duration: number) {
    if (this.chart) {
      this.chart.options.animation.duration = duration;
    }
  }

  public getChart(): any {
    return this.chart;
  }
}