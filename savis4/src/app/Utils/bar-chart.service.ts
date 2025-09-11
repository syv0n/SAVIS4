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
                // step: 0.1,
                beginAtZero: true,
                //fontColor: "black",
                //fontSize: "16"
              },
              scaleLabel: {
                display: true,
                labelString: translation.yAxisTitle,
                //fontColor: "black",
                //fontSize: "14"
              }
            }
          ],
          xAxes: [
            {
              // barPercentage: 1.0,
              ticks: {
                minRotation: 45,
                maxRotation: 45,
                //fontColor: "black",
                //fontSize: "14"
              },
              scaleLabel: {
                display: true,
                labelString: translation.xAxisTitle,
                //fontColor: "black",
                //fontSize: "14"
              }
            }  
          ]
        },
        responsive: true,
        maintainAspectRatio: true/*,
        tooltips: {
          mode: "index",
          backgroundColor: "rgba(0,0,0,1.0)",
          callbacks: {
            title: function(tooltipItem, data) {
              let title = tooltipItem[0].xLabel || "";
              title += " heads";
              return title;
            },
            label: (tooltipItem, data) => {
              if (tooltipItem.datasetIndex !== 2) {
                return `${data.datasets[tooltipItem.datasetIndex].label} : ${
                  tooltipItem.yLabel
                }`;
              } else {
                return `${data.datasets[tooltipItem.datasetIndex].label} : ${
                  this.dataFromCalculation.noOfSelected
                }`;
              }
            }
          }
        }*/
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